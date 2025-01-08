import { Feed } from '../../entity/feed.entity';

export class SearchFeedResult {
  constructor(
    private id: number,
    private blogName: string,
    private title: string,
    private path: string,
    private createdAt: Date,
  ) {}

  static feedsToResults(feeds: Feed[]): SearchFeedResult[] {
    return feeds.map((item) => {
      return new SearchFeedResult(
        item.id,
        item.blog.name,
        item.title,
        item.path,
        item.createdAt,
      );
    });
  }
}

export class SearchFeedResponseDto {
  constructor(
    private totalCount: number,
    private result: SearchFeedResult[],
    private totalPages: number,
    private limit: number,
  ) {}
}
