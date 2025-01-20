import * as winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(),
    logFormat,
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `${
        process.env.NODE_ENV === "production"
          ? "feed-crawler/logs/production/feed-crawler.log"
          : process.env.NODE_ENV === "test"
            ? "logs/test/feed-crawler-test.log"
            : "logs/production/feed-crawler.log"
      }`,
    }),
  ],
});

export default logger;
