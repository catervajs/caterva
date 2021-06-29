import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ minLength: 3 })
  displayName: string;

  avatarUrl?: string | null;

  location?: string | null;

  language?: string | null;
}
