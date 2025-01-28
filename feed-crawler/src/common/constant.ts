import * as dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? "feed-crawler/.env" : ".env",
});
export const CONNECTION_LIMIT = 50;
export const redisConstant = {
  FEED_RECENT_ALL_KEY: "feed:recent:*",
};
export const ONE_MINUTE = 60 * 1000;
export const INTERVAL =
  process.env.NODE_ENV === "test"
    ? parseInt(process.env.TEST_TIME_INTERVAL)
    : parseInt(process.env.TIME_INTERVAL);
