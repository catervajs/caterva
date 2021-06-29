import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

export class ProfileAlreadyExistsError extends Error {}

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    let profile = await this.profileRepository.findOne(userId);
    if (profile != null) {
      throw new ProfileAlreadyExistsError();
    }

    profile = new Profile();
    profile.userId = userId;
    profile.displayName = createProfileDto.displayName;
    profile.avatarUrl = createProfileDto?.avatarUrl;
    profile.language = createProfileDto?.language;
    profile.location = createProfileDto?.location;
    return this.profileRepository.save(profile);
  }

  async findOne(userId: string): Promise<Profile> {
    return this.profileRepository.findOne(userId);
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.profileRepository.findOne(userId);
    if (profile == null) {
      return;
    }
    profile.displayName = updateProfileDto?.displayName ?? profile.displayName;
    profile.avatarUrl = updateProfileDto?.avatarUrl ?? profile.avatarUrl;
    profile.language = updateProfileDto?.language ?? profile.language;
    profile.location = updateProfileDto?.location ?? profile.location;
    return this.profileRepository.save(profile);
  }
}
