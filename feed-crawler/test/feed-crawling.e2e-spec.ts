import { setupTestContainer } from "./setup/testContext.setup";
import { FeedCrawler } from "../src/feed-crawler";
import { redisConstant } from "../src/common/constant";
import { ClaudeService } from "../src/claude.service";

describe("feed crawling e2e-test", () => {
  const testContext = setupTestContainer();
  let feedCrawler: FeedCrawler;
  let claudeService: ClaudeService;
  beforeAll(async () => {
    feedCrawler = new FeedCrawler(
      testContext.rssRepository,
      testContext.feedRepository,
      testContext.claudeService,
    );
    claudeService = testContext.claudeService;
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("RSS 피드가 정상적으로 DB, Redis에 저장된다.", async () => {
    // given
    jest.spyOn(claudeService["client"].messages, "create").mockResolvedValue({
      id: "msg_01Y8fr6G3m7BFpkzoNAhKqD7",
      type: "message",
      role: "assistant",
      model: "claude-3-5-haiku-20241022",
      content: [
        {
          type: "text",
          text:
            "{\n" +
            '  "tags": {\n' +
            '    "Frontend": 0.95,\n' +
            '    "React": 0.92\n' +
            "  },\n" +
            '  "summary": "test summary ."\n' +
            "}",
          citations: [],
        },
      ],
      stop_reason: "end_turn",
      stop_sequence: null,
      usage: {
        input_tokens: 1759,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        output_tokens: 282,
      },
    });
    await testContext.dbConnection.executeQuery(
      `INSERT INTO rss_accept (name, user_name, email, rss_url, blog_platform) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        "나무보다 숲을",
        "채준혁",
        "test@test.com",
        "https://laurent.tistory.com/rss",
        "tistory",
      ],
    );
    // when
    await feedCrawler.start();

    // then
    const feedsFromDB = await testContext.dbConnection.executeQuery(
      "SELECT * FROM feed",
      [],
    );
    const recentFeedsKeys = [];
    let cursor = "0";
    do {
      const [newCursor, keys] = await testContext.redisConnection.scan(
        cursor,
        redisConstant.FEED_RECENT_ALL_KEY,
        100,
      );
      recentFeedsKeys.push(...keys);
      cursor = newCursor;
    } while (cursor !== "0");
    const tags = await testContext.dbConnection.executeQuery(
      "SELECT * FROM tag_map",
      [],
    );

    expect(feedsFromDB.length).not.toBe(0);
    expect(recentFeedsKeys.length).not.toBe(0);
    expect(tags.length).not.toBe(0);
  });

  it("RSS URL이 잘못된 경우 에러 로그를 남기고 계속 진행한다", async () => {
    // given
    await testContext.dbConnection.executeQuery(
      `INSERT INTO rss_accept (name, user_name, email, rss_url, blog_platform) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        "Wrong Test",
        "tester",
        "test@test.com",
        "https://test.tistory.com/test",
        "tistory",
      ],
    );
    // when
    await feedCrawler.start();

    // then
    const feeds = await testContext.dbConnection.executeQuery(
      "SELECT * FROM feed",
      [],
    );
    expect(feeds.length).toBe(0);
  });
});
