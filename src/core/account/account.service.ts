import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = new Account();
    account.deviceId = createAccountDto.deviceId;
    account.appleId = createAccountDto.appleId;
    account.googleId = createAccountDto.googleId;
    account.location = createAccountDto.location;
    account.language = createAccountDto.language;
    return this.accountRepository.save(account);
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);
    account.deviceId = updateAccountDto.deviceId ?? account.deviceId;
    account.appleId = updateAccountDto.appleId ?? account.appleId;
    account.googleId = updateAccountDto.googleId ?? account.googleId;
    account.language = updateAccountDto.language ?? account.language;
    account.location = updateAccountDto.location ?? account.location;
    return this.accountRepository.save(account);
  }

  async findOne(id: string): Promise<Account> {
    return this.accountRepository.findOne({ id: id });
  }

  async findOneWithDeviceId(deviceId: string): Promise<Account> {
    return this.accountRepository.findOne({ deviceId: deviceId });
  }
  async findOneWithAppleId(appleId: string): Promise<Account> {
    return this.accountRepository.findOne({ appleId: appleId });
  }
  async findOneWithGoogleId(googleId: string): Promise<Account> {
    return this.accountRepository.findOne({ googleId: googleId });
  }

  async findOneWithFacebookId(facebookId: string): Promise<Account> {
    return this.accountRepository.findOne({ facebookId: facebookId });
  }
}
