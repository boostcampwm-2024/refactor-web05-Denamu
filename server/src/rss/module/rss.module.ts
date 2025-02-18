import { Module } from '@nestjs/common';
import { RssController } from '../controller/rss.controller';
import { RssService } from '../service/rss.service';
import {
  RssRejectRepository,
  RssRepository,
  RssAcceptRepository,
} from '../repository/rss.repository';
import { FeedCrawlerService } from '../service/feed-crawler.service';
import { FeedRepository } from '../../feed/repository/feed.repository';
import { RssParserService } from '../service/rss-parser.service';
import { EmailModule } from '../../common/email/email.module';
import { AITagSummaryService } from '../service/ai-tag-summary.service';
import { TagMapRepository } from '../../feed/repository/tag-map.repository';

@Module({
  imports: [EmailModule],
  controllers: [RssController],
  providers: [
    RssService,
    FeedCrawlerService,
    RssParserService,
    AITagSummaryService,
    RssRepository,
    RssAcceptRepository,
    RssRejectRepository,
    FeedRepository,
    TagMapRepository,
  ],
})
export class RssModule {}
