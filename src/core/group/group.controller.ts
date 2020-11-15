import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { GroupDto } from './dto/group.dto';
import { GroupsDto } from './dto/groups.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupExceptionFilter } from './filters/group-exception.filter';
import { MembershipsDto } from './dto/memberships.dto';
import { MembershipDto } from './dto/membership.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequestDto } from '../../common/dto/bad-request.dto';

@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: 'Create group' })
  @ApiCreatedResponse({ type: CreateGroupDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // POST /groups
  // service.create
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Post()
  async create(
    @Request() req,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<GroupDto> {
    const dto = new GroupDto();
    dto.group = await this.groupService.create(
      req.user.sub,
      createGroupDto.name,
      createGroupDto.inviteOnly,
    );
    if (dto.group === undefined) {
      dto.group = null;
    }
    return dto;
  }

  @ApiOperation({ summary: 'Find groups' })
  @ApiOkResponse({ type: GroupsDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // GET /groups
  // service.findMany
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get()
  async findMany(
    @Query('name') name?: string,
    @Query('inviteOnly') inviteOnly?: boolean,
  ): Promise<GroupsDto> {
    const dto = new GroupsDto();
    [dto.groups, dto.count] = await this.groupService.findMany({
      name: name,
      inviteOnly: inviteOnly,
    });
    return dto;
  }

  @ApiOperation({ summary: 'Find group' })
  @ApiParam({ name: 'groupId' })
  @ApiOkResponse({ type: GroupDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // GET /groups/{groupId}
  // service.findOne
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get(':groupId')
  async findOne(@Param('groupId') groupId): Promise<GroupDto> {
    const dto = new GroupDto();
    dto.group = await this.groupService.findOne(groupId);
    if (dto.group === undefined) {
      dto.group = null;
    }
    return dto;
  }

  @ApiOperation({ summary: 'Update group' })
  @ApiParam({ name: 'groupId' })
  @ApiOkResponse({ type: GroupDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // PATCH /groups/{groupId}
  // service.update
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Patch(':groupId')
  async update(
    @Request() req,
    @Param('groupId') groupId,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupDto> {
    const memberId = req.user.sub;
    const dto = new GroupDto();
    dto.group = await this.groupService.update(
      groupId,
      memberId,
      updateGroupDto,
    );
    return dto;
  }

  @ApiOperation({ summary: 'Delete group' })
  @ApiParam({ name: 'groupId' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // DELETE /groups/{groupId}
  // service.delete
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Delete(':groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req, @Param('groupId') groupId) {
    const memberId = req.user.sub;
    await this.groupService.delete(groupId, memberId);
  }

  @ApiOperation({ summary: 'Get memberships of me' })
  @ApiOkResponse({ type: MembershipsDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // GET /groups/memberships/me
  // service.findMembershipOfUser
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get('memberships/me')
  async getMembershipsOfMe(@Request() req): Promise<MembershipsDto> {
    const userId = req.user.sub;
    const memberships = await this.groupService.findMembershipsOfUser(userId);
    return {
      count: memberships.length,
      memberships: memberships,
    };
  }

  @ApiOperation({ summary: 'Get memberships of user' })
  @ApiParam({ name: 'userId' })
  @ApiOkResponse({ type: MembershipsDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // GET /groups/memberships/{userId}
  // service.findMembershipOfUser
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get('memberships/:userId')
  async getMembershipsOfUser(
    @Request() req,
    @Param('userId') userId,
  ): Promise<MembershipsDto> {
    const memberships = await this.groupService.findMembershipsOfUser(userId);
    return {
      count: memberships.length,
      memberships: memberships,
    };
  }

  @ApiOperation({ summary: 'Get members of group' })
  @ApiParam({ name: 'groupId' })
  @ApiOkResponse({ type: MembershipsDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // GET /groups/{groupId}/members
  // service.getMembers
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get(':groupId/members')
  async getMembersOfGroup(
    @Request() req,
    @Param('groupId') groupId,
  ): Promise<MembershipsDto> {
    const [members, count] = await this.groupService.getMembers(groupId);
    return {
      count: count,
      memberships: members,
    };
  }

  @ApiOperation({ summary: 'Get member of group' })
  @ApiParam({ name: 'groupId' })
  @ApiParam({ name: 'userId' })
  @ApiOkResponse({ type: MembershipDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // GET /groups/{groupId}/members/{userId}
  // service.getMember
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get(':groupId/members/:userId')
  async getMemberOfGroup(
    @Request() req,
    @Param('groupId') groupId,
    @Param('userId') userId,
  ): Promise<MembershipDto> {
    const member = await this.groupService.getMember(groupId, userId);
    return {
      membership: member,
    };
  }

  @ApiOperation({ summary: 'Join group' })
  @ApiParam({ name: 'groupId' })
  @ApiCreatedResponse({ type: MembershipDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // POST /groups/{groupId}/members/me
  // service.join
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Post(':groupId/members/me')
  async joinGroup(
    @Request() req,
    @Param('groupId') groupId,
  ): Promise<MembershipDto> {
    const actingUserId: string = req.user.sub;
    const member = await this.groupService.join(groupId, actingUserId);
    return {
      membership: member,
    };
  }

  @ApiOperation({ summary: 'Invite user to group' })
  @ApiParam({ name: 'groupId' })
  @ApiParam({ name: 'userId' })
  @ApiCreatedResponse({ type: MembershipDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // POST /groups/{groupId}/members/{userId}
  // service.invite
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Post(':groupId/members/:userId')
  async inviteToGroup(
    @Request() req,
    @Param('groupId') groupId,
    @Param('userId') targetUserId,
  ): Promise<MembershipDto> {
    const actingUserId: string = req.user.sub;
    const member = await this.groupService.invite(
      groupId,
      actingUserId,
      targetUserId,
    );
    return {
      membership: member,
    };
  }

  @ApiOperation({ summary: 'Leave group' })
  @ApiParam({ name: 'groupId' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // DELETE /groups/{groupId}/members/me
  // service.leave
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Delete(':groupId/members/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveGroup(@Request() req, @Param('groupId') groupId): Promise<void> {
    const actingUserId: string = req.user.sub;
    await this.groupService.leave(groupId, actingUserId);
  }

  @ApiOperation({ summary: 'Remove user from group' })
  @ApiParam({ name: 'groupId' })
  @ApiParam({ name: 'userId' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // DELETE /groups/{groupId}/members/{userId}
  // service.removeMember
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Delete(':groupId/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMemberOfGroup(
    @Request() req,
    @Param('groupId') groupId,
    @Param('userId') targetUserId,
  ): Promise<void> {
    const actingUserId: string = req.user.sub;
    await this.groupService.removeMember(groupId, actingUserId, targetUserId);
  }

  @ApiOperation({ summary: 'Ban user from group' })
  @ApiParam({ name: 'groupId' })
  @ApiParam({ name: 'userId' })
  @ApiOkResponse({ type: MembershipDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // POST /groups/{groupId}/members/{userId}/ban
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Post(':groupId/members/:userId/ban')
  async banFromGroup(
    @Request() req,
    @Param('groupId') groupId,
    @Param('userId') targetUserId,
  ): Promise<MembershipDto> {
    const actingUserId: string = req.user.sub;
    const member = await this.groupService.ban(
      groupId,
      actingUserId,
      targetUserId,
    );
    return {
      membership: member,
    };
  }

  @ApiOperation({ summary: 'Promote user to admin' })
  @ApiParam({ name: 'groupId' })
  @ApiParam({ name: 'userId' })
  @ApiCreatedResponse({ type: MembershipDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  // POST /groups/{groupId}/members/{userId}/promote
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Post(':groupId/members/:userId/ban')
  async promote(
    @Request() req,
    @Param('groupId') groupId,
    @Param('userId') targetUserId,
  ): Promise<MembershipDto> {
    const actingUserId: string = req.user.sub;
    const member = await this.groupService.promoteToAdmin(
      groupId,
      actingUserId,
      targetUserId,
    );
    return {
      membership: member,
    };
  }
}
