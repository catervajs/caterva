import { Group } from '../entities/group.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GroupsDto {
  @ApiProperty()
  count;

  @ApiProperty({ type: [Group] })
  groups: Group[];
}
