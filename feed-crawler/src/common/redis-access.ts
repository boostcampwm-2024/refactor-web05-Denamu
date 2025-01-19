import Redis, { ChainableCommander } from "ioredis";
import Redis_Mock from "ioredis-mock";
import logger from "../common/logger";
import * as dotenv from "dotenv";
import { injectable } from "tsyringe";

dotenv.config();

@injectable()
export class RedisConnection {
  private redis: Redis;
  private nameTag: string;
  private isConnected: boolean = false;

  constructor() {
    this.nameTag = "[Redis]";
  }

  connect() {
    if (process.env.NODE_ENV === "production") {
      this.redis = new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
      });
    } else {
      this.redis = new Redis_Mock();
    }

    this.isConnected = true;
  }

  async quit() {
    if (this.isConnected && this.redis) {
      try {
        await this.redis.quit();
      } catch (error) {
        logger.error(
          `${this.nameTag} connection quit 중 오류 발생
          에러 메시지: ${error.message}
          스택 트레이스: ${error.stack}`,
        );
      }
    }
  }

  async del(...keys: string[]): Promise<number> {
    if (!this.isConnected || !this.redis) {
      this.connect();
    }
    return this.redis.del(...keys);
  }

  async scan(
    cursor: string | number,
    match?: string,
    count?: number,
  ): Promise<[cursor: string, keys: string[]]> {
    const result = await this.redis.scan(
      cursor,
      "MATCH",
      match || "*",
      "COUNT",
      count || 10,
    );
    return [result[0], result[1]];
  }

  async executePipeline(commands: (pipeline: ChainableCommander) => void) {
    if (!this.isConnected || !this.redis) {
      this.connect();
    }
    const pipeline = this.redis.pipeline();
    try {
      commands(pipeline);
      return pipeline.exec();
    } catch (error) {
      logger.error(
        `${this.nameTag} 파이프라인 실행 중 오류 발생:
        메시지: ${error.message}
        스택 트레이스: ${error.stack}`,
      );
      throw error;
    }
  }
}
