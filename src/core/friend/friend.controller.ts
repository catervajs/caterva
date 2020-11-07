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
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendshipTwoWayRelationStatusesDto } from './dto/friendship-two-way-relation-statuses.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { FriendshipTwoWayRelationStatusDto } from './dto/friendship-two-way-relation-status.dto';
import { ReferenceFriendDto } from './dto/reference-friend.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SelfReferenceErrorFilter } from './self-reference-error.filter';

@ApiTags('friends')
@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiOperation({
    summary: 'Find relations of this user',
  })
  @ApiResponse({
    type: FriendshipTwoWayRelationStatusesDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findRelationsOfMe(
    @Request() req,
  ): Promise<FriendshipTwoWayRelationStatusesDto> {
    return this.friendService.getAll(req.user.sub);
  }

  @ApiOperation({
    summary: 'Find relation of this user and any other user',
  })
  @ApiResponse({
    type: FriendshipTwoWayRelationStatusDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/:otherId')
  @UseFilters(new SelfReferenceErrorFilter())
  async findRelationOfMeAndOther(
    @Request() req,
    @Param('otherId') otherId,
  ): Promise<FriendshipTwoWayRelationStatusDto> {
    const dto = new FriendshipTwoWayRelationStatusDto();
    dto.status = await this.friendService.get(req.user.sub, otherId);
    return dto;
  }

  @ApiOperation({
    summary: 'Find relations of any user',
  })
  @ApiResponse({
    type: FriendshipTwoWayRelationStatusesDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':aId')
  async findRelations(
    @Request() req,
    @Param('aId') aId,
  ): Promise<FriendshipTwoWayRelationStatusesDto> {
    return this.friendService.getAll(aId);
  }

  @ApiOperation({
    summary: 'Find relation of any two users',
  })
  @ApiResponse({
    type: FriendshipTwoWayRelationStatusDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':aId/:bId')
  @UseFilters(new SelfReferenceErrorFilter())
  async findRelationWithOther(
    @Request() req,
    @Param('aId') aId,
    @Param('bId') bId,
  ): Promise<FriendshipTwoWayRelationStatusDto> {
    const dto = new FriendshipTwoWayRelationStatusDto();
    dto.status = await this.friendService.get(aId, bId);
    return dto;
  }

  @ApiOperation({
    summary: 'Send or accept friend request',
  })
  @ApiResponse({
    type: FriendshipTwoWayRelationStatusDto,
    status: 201,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me')
  @UseFilters(new SelfReferenceErrorFilter())
  async add(
    @Request() req,
    @Body() addFriendDto: ReferenceFriendDto,
  ): Promise<FriendshipTwoWayRelationStatusDto> {
    const dto = new FriendshipTwoWayRelationStatusDto();
    dto.status = await this.friendService.add(req.user.sub, addFriendDto.id);
    return dto;
  }

  @ApiOperation({
    summary: 'Remove friendship or cancel friend request',
  })
  @ApiResponse({
    type: FriendshipTwoWayRelationStatusDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  @UseFilters(new SelfReferenceErrorFilter())
  async remove(
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

  @ApiOperation({
    summary: 'Block user',
  })
  @ApiResponse({
    type: FriendshipTwoWayRelationStatusDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me/block')
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

  @ApiOperation({
    summary: 'Unblock user',
  })
  @ApiResponse({
    type: FriendshipTwoWayRelationStatusDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me/unblock')
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
