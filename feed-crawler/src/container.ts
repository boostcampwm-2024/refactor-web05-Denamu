import { container } from "tsyringe";
import { DatabaseConnection } from "./types/database-connection";
import { DEPENDENCY_SYMBOLS } from "./types/dependency-symbols";
import {MySQLConnection} from "./common/mysql-access";
import {RssRepository} from "./repository/rss.repository";
import {FeedRepository} from "./repository/feed.repository";

container.registerSingleton<DatabaseConnection>(DEPENDENCY_SYMBOLS.DatabaseConnection, MySQLConnection);

container.registerSingleton<RssRepository>(DEPENDENCY_SYMBOLS.RssRepository, RssRepository);
container.registerSingleton<FeedRepository>(DEPENDENCY_SYMBOLS.FeedRepository, FeedRepository);

export { container };
