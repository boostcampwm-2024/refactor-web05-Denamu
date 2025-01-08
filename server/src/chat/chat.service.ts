import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RedisService } from '../common/redis/redis.service';
import { getRandomNickname } from '@woowa-babble/random-nickname';
import { Cron, CronExpression } from '@nestjs/schedule';

const MAX_CLIENTS = 500;
const CLIENT_KEY_PREFIX = 'socket_client:';
const CHAT_HISTORY_KEY = 'chat:history';
const CHAT_HISTORY_LIMIT = 20;
const CHAT_MIDNIGHT_CLIENT_NAME = 'system';

type BroadcastPayload = {
  username: string;
  message: string;
  timestamp: Date;
};

@Injectable()
export class ChatService {
  private dayInit: boolean = false;

  constructor(private readonly redisService: RedisService) {}

  async isMaxClientExceeded(userCount: number) {
    return userCount > MAX_CLIENTS;
  }

  private getClientIp(client: Socket) {
    const forwardedFor = client.handshake.headers['x-forwarded-for'] as string;
    const ip = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : client.handshake.address;

    return ip;
  }

  async getClientNameByIp(client: Socket) {
    const ip = this.getClientIp(client);
    const redisKey = CLIENT_KEY_PREFIX + ip;
    const clientName: string = await this.getClientName(redisKey);
    if (clientName) {
      return clientName;
    }
    const createdClientName = this.setClientName(redisKey);
    return createdClientName;
  }

  private async getClientName(redisKey: string) {
    return await this.redisService.redisClient.get(redisKey);
  }

  private async setClientName(redisKey: string) {
    const clientName = this.generateRandomUsername();
    await this.redisService.redisClient.set(
      redisKey,
      clientName,
      'EX',
      3600 * 24,
    );
    return clientName;
  }

  private generateRandomUsername(): string {
    const type = 'animals';

    return getRandomNickname(type);
  }

  async getChatHistory() {
    return (await this.getRecentChatMessages())
      .map((msg) => JSON.parse(msg))
      .reverse();
  }

  private async getRecentChatMessages() {
    return await this.redisService.redisClient.lrange(
      CHAT_HISTORY_KEY,
      0,
      CHAT_HISTORY_LIMIT - 1,
    );
  }

  async saveMessageToRedis(payload: BroadcastPayload) {
    await this.redisService.redisClient.lpush(
      CHAT_HISTORY_KEY,
      JSON.stringify(payload),
    );

    await this.redisService.redisClient.ltrim(
      CHAT_HISTORY_KEY,
      0,
      CHAT_HISTORY_LIMIT - 1,
    );
  }

  async saveDateMessage() {
    const broadcastPayload: BroadcastPayload = {
      username: CHAT_MIDNIGHT_CLIENT_NAME,
      message: '',
      timestamp: new Date(),
    };

    await this.saveMessageToRedis(broadcastPayload);

    return broadcastPayload;
  }

  async handleDateMessage() {
    if (this.dayInit) {
      this.dayInit = false;
      return await this.saveDateMessage();
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private midnightInitializer() {
    this.dayInit = true;
  }
}
