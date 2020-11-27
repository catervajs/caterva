import { CreateProfileDto } from './create-profile.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
