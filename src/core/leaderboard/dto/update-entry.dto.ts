import { ApiProperty } from '@nestjs/swagger';

export class UpdateEntryDto {
  @ApiProperty()
  score: number;
}
