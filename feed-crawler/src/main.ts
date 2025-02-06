import "reflect-metadata";
import logger from "./common/logger";
import { FeedCrawler } from "./feed-crawler";
import { container } from "./container";
import { RssRepository } from "./repository/rss.repository";
import { FeedRepository } from "./repository/feed.repository";
import { DEPENDENCY_SYMBOLS } from "./types/dependency-symbols";
import { DatabaseConnection } from "./types/database-connection";
import { ClovaService } from "./clova.service";
import { FeedTagRepository } from "./repository/feed-tag.repository";


async function main() {
  logger.info("==========작업 시작==========");
  const startTime = Date.now();

  const rssRepository = container.resolve<RssRepository>(
    DEPENDENCY_SYMBOLS.RssRepository,
  );
  const feedRepository = container.resolve<FeedRepository>(
    DEPENDENCY_SYMBOLS.FeedRepository,
  );
  const dbConnection = container.resolve<DatabaseConnection>(
    DEPENDENCY_SYMBOLS.DatabaseConnection,
  );
  const clovaService = container.resolve<ClovaService>(
    DEPENDENCY_SYMBOLS.ClovaService,
  );
  const feedTagRepository = container.resolve<FeedTagRepository>(
    DEPENDENCY_SYMBOLS.FeedTagRepository,
  );
  const feedRepository = container.resolve<FeedRepository>(
    DEPENDENCY_SYMBOLS.FeedRepository
  );
  const dbConnection = container.resolve<DatabaseConnection>(
    DEPENDENCY_SYMBOLS.DatabaseConnection
  );

  const feedCrawler = new FeedCrawler(
    rssRepository,
    feedRepository,
    clovaService,
    feedTagRepository,
  );
  await feedCrawler.start();

  const endTime = Date.now();
  const executionTime = endTime - startTime;

  await dbConnection.end();
  logger.info(`실행 시간: ${executionTime / 1000}seconds`);
  logger.info("==========작업 완료==========");
}

main();
