import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { LeaderboardEntryDto } from './dto/leaderboard-entry.dto';
import { LeaderboardEntriesDto } from './dto/leaderboard-entries.dto';

export class _BaseLeaderboardException extends Error {}
export class LeaderboardEntryNotFoundError extends _BaseLeaderboardException {}
export class CouldNotUpdateLeaderboardEntryError extends _BaseLeaderboardException {}

@Injectable()
export class LeaderboardService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Get entry of user in a leaderboard
   * @param leaderboardId
   * @param userId
   */
  async getEntry(
    leaderboardId: string,
    userId: string,
  ): Promise<LeaderboardEntryDto> {
    const client = this.redisService.getClient();
    const [score, rank] = await Promise.all([
      client.zscore(leaderboardId, userId),
      client.zrevrank(leaderboardId, userId),
    ]);
    if (score == null || rank == null) {
      throw new LeaderboardEntryNotFoundError(
        `Leaderboard entry of user "${userId}" in leaderboard "${leaderboardId}" was not found`,
      );
    }
    return {
      userId: userId,
      score: Number(score),
      rank: Number(rank),
    };
  }

  /**
   * Get entries in leaderboard
   * @param leaderboardId
   * @param options
   */
  async getEntries(
    leaderboardId: string,
    options?: {
      offset: string;
      limit: string;
    },
  ): Promise<LeaderboardEntriesDto> {
    const client = this.redisService.getClient();

    let start = 0;
    let stop = -1;

    let normalizedOffset = null;
    let normalizedLimit = null;

    if (options.offset && isFinite(Number(options.offset))) {
      normalizedOffset = Number(options.offset);
      start = normalizedOffset;
    }
    if (options.limit && isFinite(Number(options.limit))) {
      normalizedLimit = Number(options.limit);
      stop = start + Number(options.limit) - 1;
    }

    const result = await client.zrevrange(
      leaderboardId,
      start,
      stop,
      'WITHSCORES',
    );

    // construct entries array
    const entries: LeaderboardEntryDto[] = [];
    for (let i = 0; i < result.length; i += 2) {
      entries.push({
        userId: result[i],
        score: Number(result[i + 1]),
        rank: start + i / 2,
      });
    }

    return {
      offset: normalizedOffset,
      limit: normalizedLimit,
      entries: entries,
    };
  }

  /**
   * Update users score in leaderboard
   * @param leaderboardId
   * @param userId
   * @param score
   */
  async updateEntry(
    leaderboardId: string,
    userId: string,
    score: number,
  ): Promise<LeaderboardEntryDto> {
    const client = this.redisService.getClient();

    const updatedEntryCount = await client.zadd(
      leaderboardId,
      'GT',
      score,
      userId,
    );
    if (updatedEntryCount !== 1) {
      throw new CouldNotUpdateLeaderboardEntryError(
        `Leaderboard entry of user "${userId}" in leaderboard "${leaderboardId}" could not be updated with score "${score}"`,
      );
    }

    return this.getEntry(leaderboardId, userId);
  }
}
