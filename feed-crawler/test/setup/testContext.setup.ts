import "reflect-metadata";
import { DatabaseConnection } from "../../src/types/database-connection";
import { DEPENDENCY_SYMBOLS } from "../../src/types/dependency-symbols";
import { SQLiteConnection } from "../../src/common/sqlite-access";
import { RedisConnection } from "../../src/common/redis-access";
import { RssRepository } from "../../src/repository/rss.repository";
import { FeedRepository } from "../../src/repository/feed.repository";
import { container } from "tsyringe";
import { DependencyContainer } from "tsyringe";
import { RssParser } from "../../src/common/rss-parser";

export interface TestContext {
  container: DependencyContainer;
  rssRepository: RssRepository;
  feedRepository: FeedRepository;
  dbConnection: DatabaseConnection;
  redisConnection: RedisConnection;
  rssParser: RssParser;
}

declare global {
  var testContext: TestContext;
}

export function setupTestContainer(): TestContext {
  if (!global.testContext) {
    const testContainer = container.createChildContainer();

    testContainer.registerSingleton<DatabaseConnection>(
      DEPENDENCY_SYMBOLS.DatabaseConnection,
      SQLiteConnection
    );

    testContainer.registerSingleton<RedisConnection>(
      DEPENDENCY_SYMBOLS.RedisConnection,
      RedisConnection
    );

    testContainer.registerSingleton<RssRepository>(
      DEPENDENCY_SYMBOLS.RssRepository,
      RssRepository
    );

    testContainer.registerSingleton<FeedRepository>(
      DEPENDENCY_SYMBOLS.FeedRepository,
      FeedRepository
    );

    testContainer.registerSingleton<RssRepository>(
      DEPENDENCY_SYMBOLS.RssRepository,
      RssRepository
    );

    testContainer.registerSingleton<FeedRepository>(
      DEPENDENCY_SYMBOLS.FeedRepository,
      FeedRepository
    );

    testContainer.registerSingleton<RssParser>(
      DEPENDENCY_SYMBOLS.RssParser,
      RssParser
    );

    global.testContext = {
      container: testContainer,
      rssRepository: testContainer.resolve<RssRepository>(
        DEPENDENCY_SYMBOLS.RssRepository
      ),
      feedRepository: testContainer.resolve<FeedRepository>(
        DEPENDENCY_SYMBOLS.FeedRepository
      ),
      dbConnection: testContainer.resolve<DatabaseConnection>(
        DEPENDENCY_SYMBOLS.DatabaseConnection
      ),
      redisConnection: testContainer.resolve<RedisConnection>(
        DEPENDENCY_SYMBOLS.RedisConnection
      ),
      rssParser: testContainer.resolve<RssParser>(DEPENDENCY_SYMBOLS.RssParser),
    };
  }

  return global.testContext;
}
