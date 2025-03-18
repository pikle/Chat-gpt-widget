// backend/src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../message/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async saveMessage(text: string, sender: string, fileUrl?: string): Promise<Message> {
    const msg = this.messageRepository.create({ text, sender, fileUrl });
    return this.messageRepository.save(msg);
  }

  async getRecentMessages(limit: number): Promise<{ role: string; content: string }[]> {
    const messages = await this.messageRepository.find({
      order: { timestamp: 'ASC' },
      take: limit,
    });
    return messages.map(msg => ({
      role: msg.sender === 'assistant' ? 'assistant' : 'user',
      content: msg.text,
    }));
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find({ order: { timestamp: 'ASC' } });
  }

  // Добавленный метод для очистки чата
  async clearChat(): Promise<void> {
    await this.messageRepository.query('TRUNCATE TABLE "message" RESTART IDENTITY CASCADE;');
  }
}
