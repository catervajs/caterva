import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccountDto {
  deviceId: string;
  appleId?: string;
  googleId?: string;
  facebookId?: string;
}
