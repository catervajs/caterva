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
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenDto } from './dto/access-token.dto';

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

  /**
   * Authenticate with DeviceID
   * @param authDto
   */
  // todo: revise, should i remove these
  @ApiBadRequestResponse()
  @Post('device')
  @HttpCode(HttpStatus.OK)
  async authWithDeviceId(@Body() authDto: AuthDto): Promise<AccessTokenDto> {
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
    return { accessToken: _generateJwt(this.jwtService, account) };
  }

  /**
   * Authenticate with Google ID
   * @param authDto
   */
  @ApiBadRequestResponse()
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async authWithGoogleId(@Body() authDto: AuthDto): Promise<AccessTokenDto> {
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
    return { accessToken: _generateJwt(this.jwtService, account) };
  }

  /**
   * Authenticate with Apple ID
   * @param authDto
   */
  @ApiBadRequestResponse()
  @Post('apple')
  @HttpCode(HttpStatus.OK)
  async authWithAppleId(@Body() authDto: AuthDto): Promise<AccessTokenDto> {
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
    return { accessToken: _generateJwt(this.jwtService, account) };
  }

  /**
   * Authenticate with Facebook ID
   * @param authDto
   */
  @ApiBadRequestResponse()
  @Post('facebook')
  @HttpCode(HttpStatus.OK)
  async authWithFacebookId(@Body() authDto: AuthDto): Promise<AccessTokenDto> {
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
    return { accessToken: _generateJwt(this.jwtService, account) };
  }
}
