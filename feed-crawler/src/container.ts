import { container } from "tsyringe";
import { DatabaseConnection } from "./types/database-connection";
import { DEPENDENCY_SYMBOLS } from "./types/dependency-symbols";
import { mysqlConnection } from "./common/mysql-access";
import {RssRepository} from "./repository/rss.repository";
import {FeedRepository} from "./repository/feed.repository";

container.register<DatabaseConnection>(DEPENDENCY_SYMBOLS.DatabaseConnection, {
    useValue: mysqlConnection
});

container.registerSingleton<RssRepository>(DEPENDENCY_SYMBOLS.RssRepository, RssRepository);
container.registerSingleton<FeedRepository>(DEPENDENCY_SYMBOLS.FeedRepository, FeedRepository);

export { container };
