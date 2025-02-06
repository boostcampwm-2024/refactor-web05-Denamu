import { inject, injectable } from "tsyringe";
import { DEPENDENCY_SYMBOLS } from "../types/dependency-symbols";
import { DatabaseConnection } from "../types/database-connection";
import logger from "../common/logger";

@injectable()
export class FeedTagRepository {
  constructor(
    @inject(DEPENDENCY_SYMBOLS.DatabaseConnection)
    private readonly dbConnection: DatabaseConnection
  ) {}

  public async insertFeedTags(
    feedId: number,
    tagNames: string[]
  ): Promise<void> {
    try {
      if (tagNames.length === 0) {
        return;
      }

      const tagIdsQuery = "SELECT id FROM tag WHERE name IN (?)";
      const tagIds = await this.dbConnection.executeQuery(tagIdsQuery, [
        tagNames,
      ]);

      const insertPromises = tagIds.map(({ id: tagId }) => {
        const query = "INSERT INTO feed_tag (feed_id, tag_id) VALUES (?, ?)";
        return this.dbConnection.executeQuery(query, [feedId, tagId]);
      });

      await Promise.all(insertPromises);

      logger.info(`Feed ${feedId}의 태그 저장 완료: ${JSON.stringify(tagIds)}`);
    } catch (error) {
      throw error;
    }
  }
}
