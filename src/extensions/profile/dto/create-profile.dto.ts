import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ minLength: 3 })
  displayName: string;

  @ApiPropertyOptional()
  avatarUrl?: string;
}
