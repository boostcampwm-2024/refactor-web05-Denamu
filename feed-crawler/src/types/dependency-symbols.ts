import { FeedTagRepository } from "../repository/feed-tag.repository";

export const DEPENDENCY_SYMBOLS = {
  DatabaseConnection: Symbol.for("DatabaseConnection"),
  RssRepository: Symbol.for("RssRepository"),
  FeedRepository: Symbol.for("FeedRepository"),
  RedisConnection: Symbol.for("RedisConnection"),
  ClovaService: Symbol.for("ClovaService"),
  FeedTagRepository: Symbol.for("FeedTagRepository"),
};
