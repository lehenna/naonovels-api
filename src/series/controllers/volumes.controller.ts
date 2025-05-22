import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TeamMembersService } from '@/teams/services/team-members.service';
import { CreateVolumeDto } from '../dto/create-volume.dto';
import { UpdateVolumeDto } from '../dto/update-volume.dto';
import { VolumesService } from '../services/volumes.service';
import { Public } from '@/common/lib/decorators';

@Controller('volumes')
export class VolumesController {
  constructor(
    private readonly volumesService: VolumesService,
    private readonly teamMembersService: TeamMembersService,
  ) {}

  @Post()
  async createVolume(@Body() createVolumeDto: CreateVolumeDto, @Req() req) {
    const userId = req.user.id;
    const hasPermission = await this.teamMembersService.hasSomeTeam(userId);

    if (!hasPermission)
      throw new HttpException('Permission denied', HttpStatus.UNAUTHORIZED);

    return this.volumesService.createVolume(createVolumeDto);
  }

  @Public()
  @Get(':volumeId')
  async getVolume(@Param('volumeId') volumeId: string) {
    return this.volumesService.getVolumeById(volumeId);
  }

  @Patch(':volumeId')
  async updateVolume(
    @Param('volumeId') volumeId: string,
    @Body() updateVolumeDto: UpdateVolumeDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    const hasPermission = await this.teamMembersService.hasSomeTeam(userId);

    if (!hasPermission)
      throw new HttpException('Permission denied', HttpStatus.UNAUTHORIZED);

    return this.volumesService.updateVolume(volumeId, updateVolumeDto);
  }
}
