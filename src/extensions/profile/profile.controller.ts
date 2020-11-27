import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Request,
  Delete,
  Patch,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProfileAlreadyExistsError, ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { Profile } from './entities/profile.entity';
import { ProfileDto } from './dto/profile.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Create new profile' })
  @ApiCreatedResponse({ type: ProfileDto })
  @ApiBadRequestResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ProfileDto> {
    try {
      const userId = req.user.sub;
      return {
        profile: await this.profileService.create(userId, createProfileDto),
      };
    } catch (e) {
      if (e instanceof ProfileAlreadyExistsError) {
        throw new HttpException(
          'Profile already exists',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw e;
      }
    }
  }

  @ApiOperation({ summary: 'Find profile of current user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async findMe(@Request() req): Promise<ProfileDto> {
    const userId = req.user.sub;
    return {
      profile: await this.profileService.findOne(userId),
    };
  }

  @ApiOperation({ summary: 'Find profile of any user' })
  @ApiParam({ name: 'userId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<ProfileDto> {
    return {
      profile: await this.profileService.findOne(userId),
    };
  }

  @ApiOperation({ summary: 'Update profile of current user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me')
  async update(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const userId = req.user.sub;
    return {
      profile: await this.profileService.update(userId, updateProfileDto),
    };
  }
}
