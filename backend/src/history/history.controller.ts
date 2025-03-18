import { Controller, Get, Res } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';
import { Response } from 'express';

@Controller()
export class HistoryController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history/json')
  async exportJson(@Res() res: Response) {
    const messages = await this.chatService.getAllMessages();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="chat_history.json"');
    res.send(JSON.stringify(messages, null, 2));
  }

  @Get('history/csv')
  async exportCsv(@Res() res: Response) {
    const messages = await this.chatService.getAllMessages();
    let csv = 'timestamp,sender,text,fileUrl\n';
    messages.forEach(msg => {
      csv += `"${msg.timestamp.toISOString()}","${msg.sender}","${msg.text.replace(/"/g, '""')}","${msg.fileUrl || ''}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="chat_history.csv"');
    res.send(csv);
  }
}
