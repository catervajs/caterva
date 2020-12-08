import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Wallet } from './entities/wallet.entity';
import { FriendService } from '../../core/friend/friend.service';
import { FriendshipTwoWayRelationStatus } from '../../core/friend/enums/friendship-two-way-relation-status.enum';

@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly friendService: FriendService,
  ) {}

  @ApiOperation({ summary: 'Get current users wallet info ' })
  @ApiOkResponse({ type: Wallet })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMe(@Request() req): Promise<Wallet> {
    const userId = req.user.sub;
    return this.walletService.findOrCreate(userId);
  }

  @ApiOperation({ summary: 'Get friends wallet info ' })
  @ApiOkResponse({ type: Wallet })
  @ApiForbiddenResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findOne(
    @Request() req,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Wallet> {
    const requestingUserId = req.user.sub;
    // check
    const friendshipStatus = await this.friendService.get(
      requestingUserId,
      userId,
    );
    if (friendshipStatus !== FriendshipTwoWayRelationStatus.Friends) {
      throw new HttpException(
        `Not friends, cannot see wallet`,
        HttpStatus.FORBIDDEN,
      );
    }
    return this.walletService.findOrCreate(userId);
  }
}
