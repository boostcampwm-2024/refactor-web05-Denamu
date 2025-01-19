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
          ? "logs/production/feed-crawler.log"
          : "logs/test/feed-crawler-test.log"
      }`,
    }),
  ],
});

export default logger;
