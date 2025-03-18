import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../message/message.entity';
import { OpenAIModule } from '../openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), OpenAIModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
