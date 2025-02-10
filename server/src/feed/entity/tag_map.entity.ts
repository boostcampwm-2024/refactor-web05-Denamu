import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Feed } from './feed.entity';

@Entity({ name: 'tag_map' })
export class TagMap extends BaseEntity {
  @ManyToOne(() => Feed, (feed) => feed.id)
  @JoinColumn({
    name: 'feed_id',
  })
  @Index()
  feedId: number;

  @Column({
    length: 50,
    nullable: false,
  })
  tag: string;
}
