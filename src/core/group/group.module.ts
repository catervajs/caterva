import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMember])],
  controllers: [],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
