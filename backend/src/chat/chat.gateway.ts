import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { OpenAIService } from '../openai/openai.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;

  // Флаг, включен ли бот
  private botEnabled = true;

  // Общий контекст (system‑сообщение), которое учитывается при ответах
  private systemContext = 'Ты — дружелюбный ассистент. Старайся помогать пользователю и давать развернутые ответы.';

  constructor(
    private readonly chatService: ChatService,
    private readonly openAIService: OpenAIService,
  ) {}

  // При новом подключении сразу отдаем историю
  async handleConnection(client: Socket) {
    const allMessages = await this.chatService.getAllMessages();
    client.emit('initHistory', allMessages);
  }

  // Менеджер может включать/выключать бота
  @SubscribeMessage('toggleBot')
  handleToggleBot(@MessageBody() payload: { enable: boolean }) {
    this.botEnabled = payload.enable;
    this.server.emit('botStatus', { botEnabled: this.botEnabled });
  }

  // Менеджер может менять контекст (system‑сообщение)
  @SubscribeMessage('setContext')
  handleSetContext(@MessageBody() payload: { context: string }) {
    this.systemContext = payload.context;
    // При желании можно оповестить всех, что контекст изменился
    // this.server.emit('contextUpdated', { context: this.systemContext });
  }

  // Если клиент повторно открыл чат, он может запросить историю
  @SubscribeMessage('getHistory')
  async handleGetHistory(@ConnectedSocket() client: Socket) {
    const allMessages = await this.chatService.getAllMessages();
    client.emit('initHistory', allMessages);
  }

  // Основной метод обработки сообщения от клиента
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { text: string; fileUrl?: string; sender?: string },
  ) {
    // Определяем, кто отправитель (по умолчанию 'user')
    const sender = payload.sender || 'user';

    // 1. Сохраняем сообщение в базе
    const savedMsg = await this.chatService.saveMessage(payload.text, sender, payload.fileUrl);
    // 2. Рассылаем всем
    this.server.emit('message', {
      id: savedMsg.id,
      sender: savedMsg.sender,
      text: savedMsg.text,
      fileUrl: savedMsg.fileUrl,
      timestamp: savedMsg.timestamp,
    });

    // 3. Если бот отключен или сообщение от менеджера, GPT не вызываем
    if (!this.botEnabled || sender === 'manager') {
      return;
    }

    // 4. Сообщаем клиенту, что ассистент «печатает»
    client.emit('typing');

    // 5. Получаем последние N сообщений для контекста
    let context = await this.chatService.getRecentMessages(10);

    // 6. Добавляем system‑сообщение, если оно не пустое
    if (this.systemContext.trim()) {
      context = [{ role: 'system', content: this.systemContext }, ...context];
    }

    try {
      // 7. Вызываем OpenAI
      const replyText = await this.openAIService.generateReply(context);
      // 8. Сохраняем ответ ассистента
      const assistantMsg = await this.chatService.saveMessage(replyText, 'assistant');
      // 9. Рассылаем ответ ассистента
      this.server.emit('message', {
        id: assistantMsg.id,
        sender: assistantMsg.sender,
        text: assistantMsg.text,
        timestamp: assistantMsg.timestamp,
      });
    } catch (err) {
      console.error('Ошибка OpenAI:', err);
      const errMsg = await this.chatService.saveMessage('Ошибка: не удалось получить ответ.', 'assistant');
      this.server.emit('message', {
        id: errMsg.id,
        sender: errMsg.sender,
        text: errMsg.text,
        timestamp: errMsg.timestamp,
      });
    }
  }
}
