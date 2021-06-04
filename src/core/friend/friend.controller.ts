import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Post,
  Body,
  Delete,
  UseFilters,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendshipTwoWayRelationStatusesDto } from './dto/friendship-two-way-relation-statuses.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { FriendshipTwoWayRelationStatusDto } from './dto/friendship-two-way-relation-status.dto';
import { ReferenceFriendDto } from './dto/reference-friend.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SelfReferenceErrorFilter } from './self-reference-error.filter';

@ApiTags('friends')
@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  /**
   * Find relations of this user
   * @param req
   */
  @ApiOperation({
    summary: 'Find relations of this user',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findRelationsOfMe(
    @Request() req,
  ): Promise<FriendshipTwoWayRelationStatusesDto> {
    return this.friendService.getAll(req.user.sub);
  }

  /**
   * Find relation of current user and any other user
   * @param req
   * @param otherId
   */
  @ApiOperation({
    summary: 'Find relation of this user and any other user',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/:otherId')
  @UseFilters(new SelfReferenceErrorFilter())
  async findRelationOfMeAndOther(
    @Request() req,
    @Param('otherId') otherId: string,
  ): Promise<FriendshipTwoWayRelationStatusDto> {
    const dto = new FriendshipTwoWayRelationStatusDto();
    dto.status = await this.friendService.get(req.user.sub, otherId);
    return dto;
  }

  /**
   * Find relations of any user
   * @param req
   * @param aId
   */
  @ApiOperation({
    summary: 'Find relations of any user',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':aId')
  async findRelations(
    @Request() req,
    @Param('aId') aId: string,
  ): Promise<FriendshipTwoWayRelationStatusesDto> {
    return this.friendService.getAll(aId);
  }

  /**
   * Find relation of any two users
   * @param req
   * @param aId
   * @param bId
   */
  @ApiOperation({
    summary: 'Find relation of any two users',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':aId/:bId')
  @UseFilters(new SelfReferenceErrorFilter())
  async findRelationWithOther(
    @Request() req,
    @Param('aId') aId: string,
    @Param('bId') bId: string,
  ): Promise<FriendshipTwoWayRelationStatusDto> {
    const dto = new FriendshipTwoWayRelationStatusDto();
    dto.status = await this.friendService.get(aId, bId);
    return dto;
  }

  /**
   * Send or accept friend request
   * @param req
   * @param addFriendDto
   */
  @ApiOperation({
    summary: 'Send or accept friend request',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me')
  @UseFilters(new SelfReferenceErrorFilter())
  async addFriend(
    @Request() req,
    @Body() addFriendDto: ReferenceFriendDto,
  ): Promise<FriendshipTwoWayRelationStatusDto> {
    const dto = new FriendshipTwoWayRelationStatusDto();
    dto.status = await this.friendService.add(req.user.sub, addFriendDto.id);
    return dto;
  }

  /**
   * Remove friendship or cancel friend request
   * @param req
   * @param removeFriendDto
   */
  @ApiOperation({
    summary: 'Remove friendship or cancel friend request',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  @UseFilters(new SelfReferenceErrorFilter())
  async removeFriend(
    @Request() req,
    @Body() removeFriendDto: ReferenceFriendDto,
  ): Promise<FriendshipTwoWayRelationStatusDto> {
    const dto = new FriendshipTwoWayRelationStatusDto();
    dto.status = await this.friendService.remove(
      req.user.sub,
      removeFriendDto.id,
    );
    return dto;
  }

  /**
   * Block user
   * @param req
   * @param blockFriendDto
   */
  @ApiOperation({
    summary: 'Block user',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me/block')
  @HttpCode(HttpStatus.OK)
  @UseFilters(new SelfReferenceErrorFilter())
  async block(
    @Request() req,
    @Body() blockFriendDto: ReferenceFriendDto,
  ): Promise<FriendshipTwoWayRelationStatusDto> {
    const dto = new FriendshipTwoWayRelationStatusDto();
    dto.status = await this.friendService.block(
      req.user.sub,
      blockFriendDto.id,
    );
    return dto;
  }

  /**
   * Unblock user
   * @param req
   * @param unblockFriendDto
   */
  @ApiOperation({
    summary: 'Unblock user',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me/unblock')
  @HttpCode(HttpStatus.OK)
  @UseFilters(new SelfReferenceErrorFilter())
  async unblock(
    @Request() req,
    @Body() unblockFriendDto: ReferenceFriendDto,
  ): Promise<FriendshipTwoWayRelationStatusDto> {
    const dto = new FriendshipTwoWayRelationStatusDto();
    dto.status = await this.friendService.unblock(
      req.user.sub,
      unblockFriendDto.id,
    );
    return dto;
  }
}
