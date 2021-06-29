import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepo: Repository<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    accountRepo = module.get<Repository<Account>>(getRepositoryToken(Account));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating account', () => {
    it('should return created account', async () => {
      const createAccountDto: CreateAccountDto = {
        appleId: 'apple',
        deviceId: 'device',
        facebookId: 'facebook',
        googleId: 'google',
      };
      const shouldReturnGroup: Account = {
        ...createAccountDto,
        id: '00000000-0000-0000-0000-000000000000',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(accountRepo, 'save').mockResolvedValueOnce(shouldReturnGroup);
      expect(await service.create(createAccountDto)).toEqual(shouldReturnGroup);
    });
  });

  describe('when updating account', () => {
    it('should return updated account', async () => {
      const updateAccountDto: UpdateAccountDto = {
        googleId: 'alphabet',
      };
      const createAccountDto: CreateAccountDto = {
        appleId: 'apple',
        deviceId: 'device',
        facebookId: 'facebook',
        googleId: 'google',
      };
      const shouldReturnGroup: Account = {
        ...createAccountDto,
        id: '00000000-0000-0000-0000-000000000000',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      shouldReturnGroup.googleId = 'alphabet';
      jest
        .spyOn(accountRepo, 'findOne')
        .mockResolvedValueOnce(shouldReturnGroup);
      jest.spyOn(accountRepo, 'save').mockResolvedValueOnce(shouldReturnGroup);
      expect(
        await service.update(
          '00000000-0000-0000-0000-000000000000',
          updateAccountDto,
        ),
      ).toEqual(shouldReturnGroup);
    });
  });
});
