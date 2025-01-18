import * as Database from "better-sqlite3";
import { DatabaseConnection } from "../types/database-connection";
import logger from "./logger";

export class SQLiteConnection implements DatabaseConnection {
  private db: Database;
  private nameTag: string;

  constructor() {
    this.nameTag = "[SQLite]";
    this.db = this.createConnection();
    this.initializeTables();
  }

  private createConnection() {
    return new Database(":memory:");
  }

  private initializeTables() {
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS rss_accept
      (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        name          VARCHAR(255) NOT NULL,
        user_name     VARCHAR(50) NOT NULL,
        email         VARCHAR(255) NOT NULL,
        rss_url       VARCHAR(255) NOT NULL,
        blog_platform VARCHAR(255) NOT NULL DEFAULT 'etc'
      );
    
    CREATE TABLE IF NOT EXISTS feed
    (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at DATETIME NOT NULL,
        title      VARCHAR(255)     NOT NULL,
        view_count INTEGER  NOT NULL DEFAULT 0,
        path       VARCHAR(512)     NOT NULL UNIQUE,
        thumbnail  VARCHAR(255),
        blog_id    INTEGER  NOT NULL,
        FOREIGN KEY (blog_id) REFERENCES rss_accept (id)
  );
    `;
    this.db.exec(createTablesQuery);
  }

  async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    try {
      const lowercaseQuery = query.toLowerCase().trim();

      if (lowercaseQuery.startsWith("insert")) {
        const result = this.db.prepare(query).run(params);
        return [
          { insertId: result.lastInsertRowid, affectedRows: result.changes },
        ] as T[];
      } else if (lowercaseQuery.startsWith("select")) {
        return this.db.prepare(query).all(params) as T[];
      }
    } catch (error) {
      logger.error(
        `${this.nameTag} 쿼리 ${query} 실행 중 오류 발생
          오류 메시지: ${error.message}
          스택 트레이스: ${error.stack}`,
      );
      throw error;
    }
  }

  public async end(): Promise<void> {
    this.db.close();
  }
}
