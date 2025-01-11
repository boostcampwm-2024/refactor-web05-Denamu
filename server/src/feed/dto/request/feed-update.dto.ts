import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class FeedViewUpdateRequestDto {
  @ApiProperty({
    example: 10,
    description: '조회할 ID 입력',
  })
  @IsInt({
    message: '정수를 입력해주세요.',
  })
  @Type(() => Number)
  feedId: number;
}
