import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  UseFilters,
  Query,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { LeaderboardService } from './leaderboard.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LeaderboardEntryDto } from './dto/leaderboard-entry.dto';
import { BadRequestDto } from '../../common/dto/bad-request.dto';
import { LeaderboardExceptionFilter } from './filters/leaderboard-exception.filter';
import { LeaderboardEntriesDto } from './dto/leaderboard-entries.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@ApiTags('leaderboards')
@Controller('leaderboards')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @ApiOperation({ summary: 'Get leaderboard entry for current user' })
  @ApiOkResponse({ type: LeaderboardEntryDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiParam({ name: 'leaderboardId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':leaderboardId/me')
  @UseFilters(LeaderboardExceptionFilter)
  async getEntryOfMe(
    @Request() req,
    @Param('leaderboardId') leaderboardId,
  ): Promise<LeaderboardEntryDto> {
    const userId = req.user.sub;
    return this.leaderboardService.getEntry(leaderboardId, userId);
  }

  @ApiOperation({ summary: 'Get leaderboard entry for user' })
  @ApiOkResponse({ type: LeaderboardEntryDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiParam({ name: 'leaderboardId' })
  @ApiParam({ name: 'userId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(LeaderboardExceptionFilter)
  @Get(':leaderboardId/:userId')
  async getEntry(
    @Request() req,
    @Param('leaderboardId') leaderboardId,
    @Param('userId') userId,
  ): Promise<LeaderboardEntryDto> {
    return this.leaderboardService.getEntry(leaderboardId, userId);
  }

  @ApiOperation({ summary: 'Get leaderboard entries' })
  @ApiOkResponse({ type: LeaderboardEntriesDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiParam({ name: 'leaderboardId' })
  @ApiQuery({ name: 'offset' })
  @ApiQuery({ name: 'limit' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(LeaderboardExceptionFilter)
  @Get(':leaderboardId')
  async getEntries(
    @Request() req,
    @Param('leaderboardId') leaderboardId,
    @Query('offset') offset: string = undefined,
    @Query('limit') limit: string = undefined,
  ): Promise<LeaderboardEntriesDto> {
    return this.leaderboardService.getEntries(leaderboardId, {
      offset: offset,
      limit: limit,
    });
  }

  @ApiOperation({ summary: 'Update leaderboard entry of user' })
  @ApiOkResponse({ type: LeaderboardEntryDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiParam({ name: 'leaderboardId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(LeaderboardExceptionFilter)
  @Post(':leaderboardId')
  async updateEntry(
    @Request() req,
    @Param('leaderboardId') leaderboardId,
    @Body() updateEntryDto: UpdateEntryDto,
  ): Promise<LeaderboardEntryDto> {
    const userId = req.user.sub;
    return this.leaderboardService.updateEntry(
      leaderboardId,
      userId,
      updateEntryDto.score,
    );
  }
}
