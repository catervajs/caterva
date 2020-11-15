import { Group } from '../entities/group.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GroupDto {
  @ApiProperty()
  group: Group;
}
