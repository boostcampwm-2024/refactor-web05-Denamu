import { injectable } from "tsyringe";
import Anthropic from "@anthropic-ai/sdk";
import { ClaudeResponse, FeedDetail } from "./common/types";
import { TagMapRepository } from "./repository/tag-map.repository";
import { FeedRepository } from "./repository/feed.repository";
import logger from "./common/logger";

@injectable()
export class ClaudeService {
  private readonly client: Anthropic;

  constructor(
    private readonly tagMapRepository: TagMapRepository,
    private readonly feedRepository: FeedRepository,
  ) {
    this.client = new Anthropic({
      apiKey: process.env.AI_API_KEY,
    });
  }

  async useCaludeService(feeds: FeedDetail[]) {
    const processedFeeds = await Promise.allSettled(
      feeds.map(async (feed) => {
        try {
          const params: Anthropic.MessageCreateParams = {
            max_tokens: 8192,
            system:
              'You need to assign tags and provide a summary of the content.\nThe input format is XML.\nRemove the XML tags and analyze the content.\n\nThe language of the content is Korean.\nAnalyze the content and assign 0 to 5 relevant tags.\nOnly assign tags that have at least 90% relevance to the content.\n\nIf no tag has 90% relevance or more, return:\ntags: { }\n\nThe summary of the content should be returned in the summary field.\nThe summary must be in Korean.\nWhen summarizing, make it engaging and intriguing so that a first-time reader would want to click on the original post.\n\nIf possible, organize the summary using Markdown format.\n\nOutput Format:\nYou must respond with raw JSON only, without any code blocks or backticks. \nThe output should be in JSON format only, containing tags, relevance, and summary.\nDo not wrap the response in code blocks.\nDo not provide any additional explanations.\nDo not use any markdown formatting for the JSON output itself.\n\nThe response should look exactly like this, without any surrounding characters:\n{\n  "tags": {\n      "javascript": confidence<float>,\n      "typescript": confidence<float>,\n      "network": confidence<float>\n  },\n  "summary": summary<string>\n}\n\n## Do not assign any tags that are not in the predefined tag list.\nStrictly follow this rule.\n\nTag List:\n회고\nFrontend\nBackend\nDB\nNetwork\nOS\nAlgorithm\nInfra\nSoftware Engineer\nTypeScript\nJavaScript\nJava\nReact\nVue.JS\nNest.JS\nExpress.JS\nSpring\nMySQL\nSQLite\nPostgreSQL\nMongoDB\nRedis\nDocker',
            messages: [{ role: "user", content: feed.content }],
            model: "claude-3-5-haiku-latest",
          };
          const message = await this.client.messages.create(params);
          let responseText: string = message.content[0]["text"];
          responseText = responseText.replace(/\n/g, "");
          const result: ClaudeResponse = JSON.parse(responseText);
          await this.generateTag(feed, result["tags"]);
          await this.summarize(feed, result["summary"]);
          return {
            succeeded: true,
            feed,
          };
        } catch (error) {
          logger.error(
            `${feed.id}의 태그 생성, 컨텐츠 요약 에러 발생: `,
            error,
          );
          return {
            succeeded: false,
            feed,
            error,
          };
        }
      }),
    );

    const successFeeds = processedFeeds
      .map((result) =>
        result.status === "fulfilled" && result.value.succeeded === true
          ? result.value.feed
          : null,
      )
      .filter((result) => result !== null);

    const failedFeeds = processedFeeds
      .map((result, index) => {
        if (result.status === "rejected") {
          const failedFeed = feeds[index];
          return {
            succeeded: false,
            feed: failedFeed,
          };
        }
        return result.status === "fulfilled" && result.value.succeeded === false
          ? result.value
          : null;
      })
      .filter((result) => result !== null && result.succeeded === false)
      .map((result) => result.feed);

    logger.info(
      `${successFeeds.length}개의 태그 생성 및 컨텐츠 요약이 성공했습니다.\n ${failedFeeds.length}개의 태그 생성 및 컨텐츠 요약이 실패했습니다.`,
    );

    return [...successFeeds, ...failedFeeds];
  }

  private async generateTag(feed: FeedDetail, tags: Record<string, number>) {
    try {
      const tag = Object.keys(tags);
      if (tag.length === 0) return;
      await this.tagMapRepository.insertTags(feed.id, tag);
      feed.tag = tag;
    } catch (error) {
      logger.error(
        `[DB] 태그 데이터를 저장하는 도중 에러가 발생했습니다.
      에러 메시지: ${error.message}
      스택 트레이스: ${error.stack}`,
      );
    }
  }

  private async summarize(feed: FeedDetail, summary: string) {
    try {
      await this.feedRepository.insertSummary(feed.id, summary);
      feed.summary = summary;
    } catch (error) {
      logger.error(
        `[DB] 게시글 요약 데이터를 저장하는 도중 에러가 발생했습니다.
      에러 메시지: ${error.message}
      스택 트레이스: ${error.stack}`,
      );
    }
  }
}
