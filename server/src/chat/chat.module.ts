import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatService } from './chat.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
