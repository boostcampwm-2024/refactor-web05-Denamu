import { container } from "tsyringe";
import { DatabaseConnection } from "./types/database-connection";
import { DEPENDENCY_SYMBOLS } from "./types/dependency-symbols";
import { MySQLConnection } from "./common/mysql-access";
import { RssRepository } from "./repository/rss.repository";
import { FeedRepository } from "./repository/feed.repository";
import { RedisConnection } from "./common/redis-access";
import { ClovaService } from "./clova.service";
import { FeedTagRepository } from "./repository/feed-tag.repository";

container.registerSingleton<DatabaseConnection>(
  DEPENDENCY_SYMBOLS.DatabaseConnection,
  MySQLConnection,
);
container.registerSingleton<RedisConnection>(
  DEPENDENCY_SYMBOLS.RedisConnection,
  RedisConnection,
);

container.registerSingleton<RssRepository>(
  DEPENDENCY_SYMBOLS.RssRepository,
  RssRepository,
);
container.registerSingleton<FeedRepository>(
  DEPENDENCY_SYMBOLS.FeedRepository,
  FeedRepository,
);

container.registerSingleton<ClovaService>(
  DEPENDENCY_SYMBOLS.ClovaService,
  ClovaService,
);
container.registerSingleton<FeedTagRepository>(
  DEPENDENCY_SYMBOLS.FeedTagRepository,
  FeedTagRepository,
);
export { container };
