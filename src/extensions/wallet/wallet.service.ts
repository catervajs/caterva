import { Injectable } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
  ) {}

  async findOrCreate(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne(userId);
    if (wallet != null) {
      return wallet;
    }

    const newWallet = new Wallet();
    newWallet.userId = userId;
    return this.walletRepository.save(newWallet);
  }

  /**
   * Set new amount for the normal currency
   * @param userId
   * @param newAmount
   */
  async updateNormalCurrency(
    userId: string,
    newAmount: number,
  ): Promise<Wallet> {
    const wallet = await this.findOrCreate(userId);
    wallet.normalCurrency = newAmount;
    return this.walletRepository.save(wallet);
  }

  /**
   * Set new amount for the premium currency
   * @param userId
   * @param newAmount
   */
  async updatePremiumCurrency(
    userId: string,
    newAmount: number,
  ): Promise<Wallet> {
    const wallet = await this.findOrCreate(userId);
    wallet.premiumCurrency = newAmount;
    return this.walletRepository.save(wallet);
  }
}
