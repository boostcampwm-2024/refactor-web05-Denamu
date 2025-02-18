import { injectable } from "tsyringe";
import Anthropic from "@anthropic-ai/sdk";
import { ClaudeResponse, FeedDetail } from "./common/types";
import { TagMapRepository } from "./repository/tag-map.repository";
import { FeedRepository } from "./repository/feed.repository";
import logger from "./common/logger";
import { PROMPT_CONTENT } from "./common/constant";

@injectable()
export class ClaudeService {
  private readonly client: Anthropic;

  constructor(
    private readonly tagMapRepository: TagMapRepository,
    private readonly feedRepository: FeedRepository
  ) {
    this.client = new Anthropic({
      apiKey: process.env.AI_API_KEY,
    });
  }

  async useCaludeService(feeds: FeedDetail[]) {
    const processedFeeds = await Promise.allSettled(
      feeds.map(async (feed) => {
        const params: Anthropic.MessageCreateParams = {
          max_tokens: 8192,
          system: PROMPT_CONTENT,
          messages: [{ role: "user", content: feed.content }],
          model: "claude-3-5-haiku-latest",
        };
        const message = await this.client.messages.create(params);
        let responseText: string = message.content[0]["text"];
        responseText = responseText.replace(/\n/g, "");
        const result: ClaudeResponse = JSON.parse(responseText);

        await Promise.all([
          this.generateTag(feed, result["tags"]),
          this.summarize(feed, result["summary"]),
        ]);

        return feed;
      })
    );

    const successFeeds = processedFeeds
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const failedFeeds = processedFeeds
      .map((result, index) => {
        if (result.status === "rejected") {
          logger.error(
            `[ClaudeService] 피드 분석 도중 에러가 발생했습니다.
            에러 메시지: ${result.reason.message}
            스택 트레이스: ${result.reason.stack}`
          );
          return feeds[index];
        }
        return null;
      })
      .filter((result) => result !== null);

    logger.info(
      `${successFeeds.length}개의 태그 생성 및 컨텐츠 요약이 성공했습니다.\n ${failedFeeds.length}개의 태그 생성 및 컨텐츠 요약이 실패했습니다.`
    );

    return [...successFeeds, ...failedFeeds];
  }

  private async generateTag(feed: FeedDetail, tags: Record<string, number>) {
    const tagList = Object.keys(tags);
    if (tagList.length === 0) return;
    await this.tagMapRepository.insertTags(feed.id, tagList);
    feed.tag = tagList;
  }

  private async summarize(feed: FeedDetail, summary: string) {
    await this.feedRepository.insertSummary(feed.id, summary);
    feed.summary = summary;
  }
}
