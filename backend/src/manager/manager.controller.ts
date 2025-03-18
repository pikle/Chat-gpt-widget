// backend/src/manager/manager.controller.ts
import { Controller, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from '../chat/chat.service';

@Controller('manager')
export class ManagerController {
  constructor(private readonly chatService: ChatService) {}

  @Delete('clear-chat')
  async clearChat(@Res() res: Response) {
    await this.chatService.clearChat();
    res.status(200).json({ message: 'Чат очищен.' });
  }
}
