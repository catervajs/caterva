import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {
  ApiBearerAuth,
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

  @ApiOperation({
    summary: 'Create new account',
    description: 'Create new account',
  })
  @ApiResponse({
    type: Account,
    status: 201,
  })
  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @ApiOperation({
    summary: 'Get own account',
    description: 'Get account info (derives account from token)',
  })
  @ApiResponse({
    type: Account,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async find(@Request() req): Promise<Account> {
    return this.accountService.findOne(req.user.sub);
  }

  @ApiOperation({
    summary: 'Update own account',
    description: 'Update account info (derives account from token)',
  })
  @ApiResponse({
    type: Account,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Request() req,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(req.user.sub, updateAccountDto);
  }
}
