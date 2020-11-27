import { ApiPropertyOptional } from '@nestjs/swagger';
import { Profile } from '../entities/profile.entity';

export class ProfileDto {
  @ApiPropertyOptional()
  profile?: Profile;
}
