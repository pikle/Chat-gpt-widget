// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { Message } from './message/message.entity';
import { FileController } from './upload/file.controller';
import { HistoryController } from './history/history.controller';
import { ManagerController } from './manager/manager.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Message],
      synchronize: true,
    }),
    ChatModule,
  ],
  controllers: [FileController, HistoryController, ManagerController],
})
export class AppModule {}
