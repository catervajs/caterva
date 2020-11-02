import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  id: string;
}
