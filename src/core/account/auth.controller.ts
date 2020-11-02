import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Account } from './entities/account.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

function _generateJwt(jwtService: JwtService, account: Account): string {
  const payload = {
    sub: account.id,
  };
  return jwtService.sign(payload);
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({
    description: 'Authenticate account with Device ID',
    summary: 'Auth with deviceId',
  })
  @Post('device')
  @HttpCode(HttpStatus.OK)
  async authWithDeviceId(@Body() authDto: AuthDto) {
    const account = await this.accountService.findOneWithDeviceId(authDto.id);
    if (account == null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Authentication failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { access_token: _generateJwt(this.jwtService, account) };
  }

  @ApiOperation({
    description: 'Authenticate account with Google ID',
    summary: 'Auth with googleId',
  })
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async authWithGoogleId(@Body() authDto: AuthDto) {
    const account = await this.accountService.findOneWithGoogleId(authDto.id);
    if (account == null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Authentication failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { access_token: _generateJwt(this.jwtService, account) };
  }

  @ApiOperation({
    description: 'Authenticate account with Apple ID',
    summary: 'Auth with appleId',
  })
  @Post('apple')
  @HttpCode(HttpStatus.OK)
  async authWithAppleId(@Body() authDto: AuthDto) {
    const account = await this.accountService.findOneWithAppleId(authDto.id);
    if (account == null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Authentication failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { access_token: _generateJwt(this.jwtService, account) };
  }

  @ApiOperation({
    description: 'Authenticate account with Apple ID',
    summary: 'Auth with appleId',
  })
  @Post('apple')
  @HttpCode(HttpStatus.OK)
  async authWithFacebookId(@Body() authDto: AuthDto) {
    const account = await this.accountService.findOneWithFacebookId(authDto.id);
    if (account == null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Authentication failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { access_token: _generateJwt(this.jwtService, account) };
  }
}
