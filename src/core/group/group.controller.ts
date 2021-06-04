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

  /**
   * Create group
   * @param req
   * @param createGroupDto
   */
  @ApiOperation({ summary: 'Create group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Post()
  async createGroup(
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

  /**
   * Find groups
   * @param name
   * @param inviteOnly
   */
  @ApiOperation({ summary: 'Find groups' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get()
  async findGroups(
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

  /**
   * Find single group
   * @param groupId
   */
  @ApiOperation({ summary: 'Find group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get(':groupId')
  async findGroup(@Param('groupId') groupId: string): Promise<GroupDto> {
    const dto = new GroupDto();
    dto.group = await this.groupService.findOne(groupId);
    if (dto.group === undefined) {
      dto.group = null;
    }
    return dto;
  }

  /**
   * Update group
   * @param req
   * @param groupId
   * @param updateGroupDto
   */
  @ApiOperation({ summary: 'Update group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Patch(':groupId')
  async updateGroup(
    @Request() req,
    @Param('groupId') groupId: string,
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

  /**
   * Delete group
   * @param req
   * @param groupId
   */
  @ApiOperation({ summary: 'Delete group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Delete(':groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(@Request() req, @Param('groupId') groupId: string) {
    const memberId = req.user.sub;
    await this.groupService.delete(groupId, memberId);
  }

  /**
   * Get memberships of current user
   * @param req
   */
  @ApiOperation({ summary: 'Get memberships of me' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
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

  /**
   * Get memberships of user
   * @param req
   * @param userId
   */
  @ApiOperation({ summary: 'Get memberships of user' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get('memberships/:userId')
  async getMembershipsOfUser(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<MembershipsDto> {
    const memberships = await this.groupService.findMembershipsOfUser(userId);
    return {
      count: memberships.length,
      memberships: memberships,
    };
  }

  /**
   * Get members of group
   * @param req
   * @param groupId
   */
  @ApiOperation({ summary: 'Get members of group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get(':groupId/members')
  async getMembersOfGroup(
    @Request() req,
    @Param('groupId') groupId: string,
  ): Promise<MembershipsDto> {
    const [members, count] = await this.groupService.getMembers(groupId);
    return {
      count: count,
      memberships: members,
    };
  }

  /**
   * Get member of group
   * @param req
   * @param groupId
   * @param userId
   */
  @ApiOperation({ summary: 'Get member of group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Get(':groupId/members/:userId')
  async getMemberOfGroup(
    @Request() req,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<MembershipDto> {
    const member = await this.groupService.getMember(groupId, userId);
    return {
      membership: member,
    };
  }

  /**
   * Join group
   * @param req
   * @param groupId
   */
  @ApiOperation({ summary: 'Join group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Post(':groupId/members/me')
  async joinGroup(
    @Request() req,
    @Param('groupId') groupId: string,
  ): Promise<MembershipDto> {
    const actingUserId: string = req.user.sub;
    const member = await this.groupService.join(groupId, actingUserId);
    return {
      membership: member,
    };
  }

  /**
   * Invite user to group
   * @param req
   * @param groupId
   * @param targetUserId
   */
  @ApiOperation({ summary: 'Invite user to group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Post(':groupId/members/:userId')
  async inviteToGroup(
    @Request() req,
    @Param('groupId') groupId: string,
    @Param('userId') targetUserId: string,
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

  /**
   * Leave group
   * @param req
   * @param groupId
   */
  @ApiOperation({ summary: 'Leave group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Delete(':groupId/members/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveGroup(
    @Request() req,
    @Param('groupId') groupId: string,
  ): Promise<void> {
    const actingUserId: string = req.user.sub;
    await this.groupService.leave(groupId, actingUserId);
  }

  /**
   * Remove user from group
   * @param req
   * @param groupId
   * @param targetUserId
   */
  @ApiOperation({ summary: 'Remove user from group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Delete(':groupId/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMemberOfGroup(
    @Request() req,
    @Param('groupId') groupId: string,
    @Param('userId') targetUserId: string,
  ): Promise<void> {
    const actingUserId: string = req.user.sub;
    await this.groupService.removeMember(groupId, actingUserId, targetUserId);
  }

  /**
   * Ban user from group
   * @param req
   * @param groupId
   * @param targetUserId
   */
  @ApiOperation({ summary: 'Ban user from group' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Post(':groupId/members/:userId/ban')
  async banFromGroup(
    @Request() req,
    @Param('groupId') groupId: string,
    @Param('userId') targetUserId: string,
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

  /**
   * Promote user to admin
   * @param req
   * @param groupId
   * @param targetUserId
   */
  @ApiOperation({ summary: 'Promote user to admin' })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(GroupExceptionFilter)
  @Post(':groupId/members/:userId/promote')
  async promote(
    @Request() req,
    @Param('groupId') groupId: string,
    @Param('userId') targetUserId: string,
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
