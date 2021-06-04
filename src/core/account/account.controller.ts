import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Account } from './entities/account.entity';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * Create account
   * @param createAccountDto
   */
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createAccount(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  /**
   * Get current account
   * @param req
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCurrentAccount(@Request() req): Promise<Account> {
    return this.accountService.findOne(req.user.sub);
  }

  /**
   * Update current account
   * @param req
   * @param updateAccountDto
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateCurrentAccount(
    @Request() req,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(req.user.sub, updateAccountDto);
  }
}
