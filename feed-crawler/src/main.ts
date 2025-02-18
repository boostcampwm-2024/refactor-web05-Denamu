import "reflect-metadata";
import logger from "./common/logger";
import { FeedCrawler } from "./feed-crawler";
import { container } from "./container";
import { RssRepository } from "./repository/rss.repository";
import { FeedRepository } from "./repository/feed.repository";
import { DEPENDENCY_SYMBOLS } from "./types/dependency-symbols";
import { DatabaseConnection } from "./types/database-connection";
import { ClaudeService } from "./claude.service";
import * as schedule from "node-schedule";
import { RedisConnection } from "./common/redis-access";
import { TagMapRepository } from "./repository/tag-map.repository";

async function main() {
  logger.info("==========작업 시작==========");
  const startTime = Date.now();

  const rssRepository = container.resolve<RssRepository>(
    DEPENDENCY_SYMBOLS.RssRepository
  );
  const feedRepository = container.resolve<FeedRepository>(
    DEPENDENCY_SYMBOLS.FeedRepository
  );
  const tagMapRepository = container.resolve<TagMapRepository>(
    DEPENDENCY_SYMBOLS.TagMapRepository
  );
  const dbConnection = container.resolve<DatabaseConnection>(
    DEPENDENCY_SYMBOLS.DatabaseConnection
  );
  const claudeService = container.resolve<ClaudeService>(
    DEPENDENCY_SYMBOLS.ClaudeService
  );
  const redisConnection = container.resolve<RedisConnection>(
    DEPENDENCY_SYMBOLS.RedisConnection
  );

  const feedCrawler = new FeedCrawler(
    rssRepository,
    feedRepository,
    claudeService
  );
  await feedCrawler.start();

  const endTime = Date.now();
  const executionTime = endTime - startTime;

  await dbConnection.end();
  logger.info(`실행 시간: ${executionTime / 1000}seconds`);
  logger.info("==========작업 완료==========");

  schedule.scheduleJob(
    "AI API PER MINUTE REQUEST RATE LIMIT",
    "*/1 * * * *",
    () => {
      const aiRequest = new ClaudeService(
        tagMapRepository,
        feedRepository,
        redisConnection
      );
      aiRequest.startRequestAI();
    }
  );
}

main();
