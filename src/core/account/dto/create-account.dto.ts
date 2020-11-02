import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty()
  deviceId: string;

  @ApiPropertyOptional()
  appleId?: string;

  @ApiPropertyOptional()
  googleId?: string;

  @ApiPropertyOptional()
  facebookId?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  language?: string;
}
