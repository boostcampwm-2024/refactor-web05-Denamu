import { Injectable } from '@nestjs/common';
import { Anthropic } from '@anthropic-ai/sdk';
import { WinstonLoggerService } from '../../common/logger/logger.service';

const PROMPT_CONTENT = `[System]
You need to assign tags and provide a summary of the content.
The input format is XML.
Remove the XML tags and analyze the content.

The language of the content is Korean.
Analyze the content and assign 0 to 5 relevant tags.
Only assign tags that have at least 90% relevance to the content.

If no tag has 90% relevance or more, return:

\`\`\`json
tags: { }
\`\`\`

The summary of the content should be returned in the summary field.
The summary must be in Korean.
When summarizing, make it engaging and intriguing so that a first-time reader would want to click on the original post.

If possible, organize the summary using Markdown format.

Output Format:
You must respond with raw JSON only. Do not use code blocks or any other formatting.
The output should be in JSON format only, containing tags, relevance, and summary.
Do not provide any additional explanations.

\`\`\`json
{
  "tags": {
      "javascript": confidence<float>,
      "typescript": confidence<float>,
      "network": confidence<float>
  },
  "summary": summary<string>
}
\`\`\`

## Do not assign any tags that are not in the predefined tag list.
Strictly follow this rule.

Tag List:
- MySQL
- TypeScript
- JavaScript
- Nest.JS
- React
- DB
- Express.JS
- Backend
- Redis
- Frontend
- Network`;

type AIResult = {
  tags: Record<string, number>;
  summary: string;
};

@Injectable()
export class AITagSummaryService {
  private anthropic: Anthropic;
  constructor(private readonly winstonLogger: WinstonLoggerService) {
    this.anthropic = new Anthropic({
      apiKey: process.env.AI_API_KEY,
    });
  }

  async request(feedContent: string) {
    try {
      const aiResult = await this.anthropic.messages.create({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 8192,
        messages: [
          {
            role: 'user',
            content: PROMPT_CONTENT,
          },
          {
            role: 'user',
            content: feedContent,
          },
        ],
      });
      const resultJson: AIResult = JSON.parse(
        aiResult.content[0]['text'] as string,
      );
      return [Object.keys(resultJson.tags), resultJson.summary];
    } catch (error) {
      this.winstonLogger.error(error);
      return [[], ''];
    }
  }
}
