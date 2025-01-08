import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/redis/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeedService } from '../service/feed.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { redisKeys } from '../../common/redis/redis.constant';
import * as _ from 'lodash';

@Injectable()
export class FeedScheduler {
  constructor(
    private readonly redisService: RedisService,
    private readonly eventService: EventEmitter2,
    private readonly feedService: FeedService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetTrendTable() {
    await this.redisService.redisClient.del(redisKeys.FEED_TREND_KEY);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async analyzeTrend() {
    const [originTrend, nowTrend] = await Promise.all([
      this.redisService.redisClient.lrange(
        redisKeys.FEED_ORIGIN_TREND_KEY,
        0,
        3,
      ),
      this.redisService.redisClient.zrevrange(redisKeys.FEED_TREND_KEY, 0, 3),
    ]);

    if (!_.isEqual(originTrend, nowTrend)) {
      const redisPipeline = this.redisService.redisClient.pipeline();
      redisPipeline.del(redisKeys.FEED_ORIGIN_TREND_KEY);
      redisPipeline.rpush(redisKeys.FEED_ORIGIN_TREND_KEY, ...nowTrend);
      await redisPipeline.exec();
      const trendFeeds = await this.feedService.readTrendFeedList();
      this.eventService.emit('ranking-update', trendFeeds);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetIpTable() {
    const redis = this.redisService.redisClient;
    const keys = await redis.keys(redisKeys.FEED_ALL_IP_KEY);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
