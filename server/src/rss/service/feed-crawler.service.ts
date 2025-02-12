import { TagMapRepository } from './../../feed/repository/tag-map.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import { FeedRepository } from '../../feed/repository/feed.repository';
import { RssParserService } from '../service/rss-parser.service';
import { Feed } from '../../feed/entity/feed.entity';
import { RssAccept } from '../entity/rss.entity';
import * as sanitize from 'sanitize-html';
import { TagMap } from '../../feed/entity/tag-map.entity';
import { AITagSummaryService } from './ai-tag-summary.service';

@Injectable()
export class FeedCrawlerService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly tagMapRepository: TagMapRepository,
    private readonly rssParser: RssParserService,
    private readonly aiTagSummaryService: AITagSummaryService,
  ) {}
  async parseRssFeeds(
    rssXmlResponse: Response,
  ): Promise<Partial<Feed & { tags: string[] }>[]> {
    const xmlParser = new XMLParser();

    const xmlData = await rssXmlResponse.text();
    const objFromXml = xmlParser.parse(xmlData);

    if (!Array.isArray(objFromXml.rss.channel.item)) {
      objFromXml.rss.channel.item = [objFromXml.rss.channel.item];
    }

    return await Promise.all(
      objFromXml.rss.channel.item.map(async (feed) => {
        const date = new Date(feed.pubDate);
        const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        const thumbnail = await this.rssParser.getThumbnailUrl(feed.link);

        const content = sanitize(feed.description ?? feed['content:encoded'], {
          allowedTags: [],
        }).replace(/[\n\r\t\s]+/g, ' ');
        const [tags, summary] = await this.aiTagSummaryService.request(content);
        return {
          title: this.rssParser.customUnescape(feed.title),
          path: decodeURIComponent(feed.link),
          thumbnail,
          createdAt: formattedDate,
          summary,
          tags,
        };
      }),
    );
  }

  async saveRssFeeds(
    feeds: Partial<Feed & { tags: string[] }>[],
    newRssAccept: RssAccept,
  ) {
    feeds.forEach((feed) => (feed.blog = newRssAccept));
    const insertResult = await this.feedRepository.insert(feeds);

    feeds.forEach((feed, index) => {
      feed.id = insertResult.identifiers[index]?.id;
    });

    return feeds;
  }

  async saveFeedsTags(feeds: Partial<Feed & { tags: string[] }>[]) {
    const tagsToInsert: Partial<TagMap>[] = feeds.flatMap(
      (feed) =>
        feed.tags.map((tag) => {
          return {
            feed: feed as Feed,
            tag,
          };
        }) ?? [],
    );

    if (tagsToInsert.length > 0) {
      await this.tagMapRepository.insert(tagsToInsert);
    }
  }
}
