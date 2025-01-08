import Redis, {ChainableCommander} from "ioredis";
import logger from "../common/logger";
import * as dotenv from "dotenv";
import {injectable} from "tsyringe";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? "feed-crawler/.env" : ".env",
});

@injectable()
export class RedisConnection {
  private redis: Redis;
  private nameTag: string;

  constructor() {
    this.nameTag = "[Redis]";
  }

  connect() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    });
  }

  async quit() {
    if (this.redis) {
      try {
        await this.redis.quit();
      } catch (error) {
        logger.error(
          `${this.nameTag} connection quit 중 오류 발생
          에러 메시지: ${error.message}
          스택 트레이스: ${error.stack}`
        );
      }
    }
  }

  async del(...keys: string[]){
    this.redis.del(...keys);
  }

  async scan(pattern: string, count: number = 100): Promise<string[]> {
    let cursor = "0";
    const resultKeys: string[] = [];

    do {
      const [newCursor, keys] = await this.redis.scan(cursor, "MATCH", pattern, "COUNT",  count.toString())
      resultKeys.push(...keys);
      cursor = newCursor;
    } while (cursor !== "0");

    return resultKeys;
  }

  async executePipeline(commands: (pipeline: ChainableCommander) => void) {
    const pipeline = this.redis.pipeline();
    try {
      commands(pipeline);
      const results = await pipeline.exec();
      return results;
    } catch (error) {
      logger.error(
          `${this.nameTag} 파이프라인 실행 중 오류 발생:
        메시지: ${error.message}
        스택 트레이스: ${error.stack}`
      );
      throw error;
    }
  }
}
