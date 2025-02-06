import { injectable } from "tsyringe";

@injectable()
export class ClovaService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly requestId: string;

  constructor() {
    this.apiKey = process.env.CLOVA_STUDIO_TEST_API_KEY;
    this.apiUrl = process.env.CLOVA_STUDIO_TEST_API_URL;
    this.requestId = process.env.X_NCP_CLOVA_STUDIO_REQUEST_ID;
  }

  async postFeedContent(text: string): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "X-NCP-CLOVASTUDIO-REQUEST-ID": `${this.requestId}`,
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "당신의 유일한 역할은 제공된 텍스트를 분석하여 관련된 기술 스택과 도구를 식별하는 것입니다.\\n\\nALLOWED_TAGS: [Vue, React, HTML, Shadcn, SCSS, JavaScript, TypeScript, Spring Boot, Fast API, Nest.js, MySQL, MariaDB, Oracle DB, PostgresQL, Network, Linux, Window, Mac, Docker, kubernates]\\n\\n절대적인 규칙:\\n1. ALLOWED_TAGS 리스트의 키워드만 사용 가능\\n2. 리스트에 없는 기술 용어는 무시\\n3. 문맥상 실제로 해당 기술을 다루는 경우만 태그 선정\\n4. 단순 언급이나 비교 대상으로 등장하는 경우는 제외\\n5. 연관도는 해당 기술의 중요도/비중을 0-100% 사이로 표현\\n6. 같은 기술은 ALLOWED_TAGS의 형식으로 고쳐주세요. 예를 들어 자바, java, JAVA, Java는 모두 Java로 표현합니다.\\n7.연관도가 60%보다 떨어지면 출력하지 않아도 됩니다.\\n\\n출력 형식:\\n키워드1/연관도%, 키워드2/연관도%, ...\\n\\n이 작업만 수행하세요. 다른 설명이나 분석은 하지 마세요.",
            },
            {
              role: "user",
              content: text,
            },
          ],
          topP: 0.8,
          topK: 0,
          maxTokens: 1500,
          temperature: 0.5,
          repeatPenalty: 5.0,
          stopBefore: [],
          includeAiFilters: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();

      return await this.createTagResult(reader);
    } catch (error) {
      throw error;
    }
  }

  private async createTagResult(
    reader: ReadableStreamDefaultReader<Uint8Array>,
  ) {
    let tagResult = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);

      buffer += chunk;

      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        const lines = event.split("\n");
        let eventData = "";

        for (const line of lines) {
          if (line.startsWith("data:")) {
            eventData += line.slice(5).trim();
          }
        }

        if (eventData) {
          try {
            const parsedData = JSON.parse(eventData);
            if (parsedData.message.content) {
              tagResult = parsedData.message.content;
            }
          } catch (e) {
            continue;
          }
        }
      }
    }

    return tagResult;
  }
}
