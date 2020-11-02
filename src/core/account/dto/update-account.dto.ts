import { CreateAccountDto } from './create-account.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
