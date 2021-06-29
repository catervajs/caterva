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

  /**
   * Create an account object with given createAccountDto
   * @param createAccountDto
   */
  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = new Account();
    account.deviceId = createAccountDto.deviceId;
    account.appleId = createAccountDto.appleId;
    account.googleId = createAccountDto.googleId;
    return this.accountRepository.save(account);
  }

  /**
   * Update existing account
   * @param id
   * @param updateAccountDto
   */
  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);
    account.deviceId = updateAccountDto.deviceId ?? account.deviceId;
    account.appleId = updateAccountDto.appleId ?? account.appleId;
    account.googleId = updateAccountDto.googleId ?? account.googleId;
    return this.accountRepository.save(account);
  }

  /**
   * Find account by id
   * @param id
   */
  async findOne(id: string): Promise<Account> {
    return this.accountRepository.findOne({ id: id });
  }

  /**
   * Find account by device id
   * @param deviceId
   */
  async findOneWithDeviceId(deviceId: string): Promise<Account> {
    return this.accountRepository.findOne({ deviceId: deviceId });
  }

  /**
   * Find account by apple id
   * @param appleId
   */
  async findOneWithAppleId(appleId: string): Promise<Account> {
    return this.accountRepository.findOne({ appleId: appleId });
  }

  /**
   * Find account by google id
   * @param googleId
   */
  async findOneWithGoogleId(googleId: string): Promise<Account> {
    return this.accountRepository.findOne({ googleId: googleId });
  }
  /**
   * Find account by facebook id
   * @param facebookId
   */
  async findOneWithFacebookId(facebookId: string): Promise<Account> {
    return this.accountRepository.findOne({ facebookId: facebookId });
  }
}
