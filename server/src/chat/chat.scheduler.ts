import { Injectable } from '@nestjs/common';
import { RedisService } from '../common/redis/redis.service';
import { ChatService } from './chat.service';
import { Cron, CronExpression } from '@nestjs/schedule';

const CHAT_MIDNIGHT_CLIENT_NAME = 'system';

type BroadcastPayload = {
  username: string;
  message: string;
  timestamp: Date;
};

@Injectable()
export class ChatScheduler {
  private dayInit: boolean = false;

  constructor(private readonly chatService: ChatService) {}

  async handleDateMessage() {
    if (this.dayInit) {
      this.dayInit = false;
      return await this.saveDateMessage();
    }
  }

  private async saveDateMessage() {
    const broadcastPayload: BroadcastPayload = {
      username: CHAT_MIDNIGHT_CLIENT_NAME,
      message: '',
      timestamp: new Date(),
    };

    await this.chatService.saveMessageToRedis(broadcastPayload);

    return broadcastPayload;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private midnightInitializer() {
    this.dayInit = true;
  }
}
