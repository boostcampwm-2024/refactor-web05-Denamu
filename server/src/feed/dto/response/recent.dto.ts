export class FeedRecentResponseDto {
  constructor(
    private id: number,
    private author: string,
    private blogPlatform: string,
    private title: string,
    private path: string,
    private createdAt: string,
    private thumbnail: string,
    private viewCount: number,
    private isNew: boolean,
  ) {}

  static toRecentResponseDto(feed: FeedRecentRedis) {
    return new FeedRecentResponseDto(
      feed.id,
      feed.blogName,
      feed.blogPlatform,
      feed.title,
      feed.path,
      feed.createdAt,
      feed.thumbnail,
      feed.viewCount,
      feed.isNew,
    );
  }

  static toRecentResponseDtoArray(feeds: FeedRecentRedis[]) {
    return feeds.map(this.toRecentResponseDto);
  }
}

export type FeedRecentRedis = {
  id: number;
  blogPlatform: string;
  createdAt: string;
  viewCount: number;
  blogName: string;
  thumbnail: string;
  path: string;
  title: string;
  isNew?: boolean;
};
