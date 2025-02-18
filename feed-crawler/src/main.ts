import "reflect-metadata";
import logger from "./common/logger";
import { FeedCrawler, RssParser } from "./feed-crawler";
import { container } from "./container";
import { RssRepository } from "./repository/rss.repository";
import { FeedRepository } from "./repository/feed.repository";
import { DEPENDENCY_SYMBOLS } from "./types/dependency-symbols";
import { DatabaseConnection } from "./types/database-connection";

async function main() {
  logger.info("==========작업 시작==========");
  const startTime = Date.now();

  const rssRepository = container.resolve<RssRepository>(
    DEPENDENCY_SYMBOLS.RssRepository
  );
  const feedRepository = container.resolve<FeedRepository>(
    DEPENDENCY_SYMBOLS.FeedRepository
  );
  const dbConnection = container.resolve<DatabaseConnection>(
    DEPENDENCY_SYMBOLS.DatabaseConnection
  );

  const rssParser = container.resolve<RssParser>(DEPENDENCY_SYMBOLS.RssParser);

  const feedCrawler = new FeedCrawler(rssRepository, feedRepository, rssParser);
  await feedCrawler.start();

  const endTime = Date.now();
  const executionTime = endTime - startTime;

  await dbConnection.end();
  logger.info(`실행 시간: ${executionTime / 1000}seconds`);
  logger.info("==========작업 완료==========");
}

main();
