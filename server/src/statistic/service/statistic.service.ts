import { StatisticAllResponseDto } from './../dto/response/all-view-count.dto';
import { RssAcceptRepository } from '../../rss/repository/rss.repository';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/redis/redis.service';
import { FeedRepository } from '../../feed/repository/feed.repository';
import { redisKeys } from '../../common/redis/redis.constant';
import { StatisticPlatformResponseDto } from '../dto/response/platform.dto';
import { StatisticTodayResponseDto } from '../dto/response/today.dto';
import { Feed } from '../../feed/entity/feed.entity';

@Injectable()
export class StatisticService {
  constructor(
    private readonly redisService: RedisService,
    private readonly feedRepository: FeedRepository,
    private readonly rssAcceptRepository: RssAcceptRepository,
  ) {}

  async readTodayStatistic(limit: number) {
    const ranking = await this.redisService.redisClient.zrevrange(
      redisKeys.FEED_TREND_KEY,
      0,
      limit - 1,
      'WITHSCORES',
    );
    const result: Partial<Feed>[] = [];

    for (let i = 0; i < ranking.length; i += 2) {
      const feedId = parseInt(ranking[i]);
      const score = parseFloat(ranking[i + 1]);

      const feedData = await this.feedRepository.findOne({
        where: { id: feedId },
        relations: ['blog'],
      });

      result.push({
        id: feedData.id,
        title: feedData.title,
        viewCount: score,
      });
    }

    return StatisticTodayResponseDto.toResponseDtoArray(result);
  }

  async readAllStatistic(limit: number) {
    const ranking =
      await this.feedRepository.findAllStatisticsOrderByViewCount(limit);
    return StatisticAllResponseDto.toResponseDtoArray(ranking);
  }

  async readPlatformStatistic() {
    const platformStatistics =
      await this.rssAcceptRepository.countByBlogPlatform();
    return StatisticPlatformResponseDto.toResponseDtoArray(platformStatistics);
  }
}
