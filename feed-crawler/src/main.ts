import "reflect-metadata";
import logger from "./common/logger";
import { FeedCrawler, RssParser } from "./feed-crawler";
import { container } from "./container";
import { RssRepository } from "./repository/rss.repository";
import { FeedRepository } from "./repository/feed.repository";
import { DEPENDENCY_SYMBOLS } from "./types/dependency-symbols";
import { DatabaseConnection } from "./types/database-connection";
import { ClaudeService } from "./claude.service";
import * as schedule from "node-schedule";
import { RedisConnection } from "./common/redis-access";
import { TagMapRepository } from "./repository/tag-map.repository";

async function main(rssRepository, feedRepository, rssParser) {
  logger.info("==========작업 시작==========");
  const startTime = Date.now();

  const feedCrawler = new FeedCrawler(rssRepository, feedRepository, rssParser);
  await feedCrawler.start();

  const endTime = Date.now();
  const executionTime = endTime - startTime;

  logger.info(`실행 시간: ${executionTime / 1000}seconds`);
  logger.info("==========작업 완료==========");
}

function startScheduler() {
  logger.info("feed-crawler 스케줄러 시작");

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

  const rssParser = container.resolve<RssParser>(DEPENDENCY_SYMBOLS.RssParser);

  schedule.scheduleJob("0,30 * * * *", async () => {
    logger.info(`feed crawling 시작: ${new Date().toISOString()}`);
    try {
      await main(rssRepository, feedRepository, rssParser);
    } catch (error) {
      logger.error(
        `[Feed-Crawler] 피드 크롤링 작업 도중 에러가 발생했습니다.
        에러 메시지: ${error.message}
        스택 트레이스: ${error.stack}`
      );
    }
  });

  process.on("SIGINT", async () => {
    logger.info("SIGINT 신호 수신, feed-crawler 종료 중...");
    await dbConnection.end();
    logger.info("DB 연결 종료");
    process.exit(0);
  });
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

startScheduler();
