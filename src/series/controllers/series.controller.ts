import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
  Patch,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SeriesService } from '../services/series.service';
import { TeamMembersService } from '@/teams/services/team-members.service';
import { CreateSeriesDto } from '../dto/create-series.dto';
import { UpdateSeriesDto } from '../dto/update-series.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '@/common/services/uploads.service';

@Controller('series')
export class SeriesController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly teamMembersService: TeamMembersService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Get()
  async listSeries(
    @Query('title') title?: string,
    @Query('tags') tags?: string[],
    @Query('demography') demography?: number,
    @Query('genres') genres?: number[],
    @Query('state') state?: number,
    @Query('format') format?: number,
    @Query('authors') authors?: string[],
    @Query('artists') artists?: string[],
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const filters = {
      title,
      tags,
      demography,
      genres,
      state,
      format,
      authors,
      artists,
    };
    return this.seriesService.findSeries(filters, Number(page), Number(limit));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('icon'))
  async createSerie(
    @Body() serieData: CreateSeriesDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) throw new HttpException('Icon required', HttpStatus.BAD_REQUEST);

    const userId = req.user.id;
    const iconName = await this.uploadsService.saveImage(file);

    const hasPermission = await this.teamMembersService.hasSomeTeam(userId);
    if (!hasPermission)
      throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);

    return this.seriesService.createSerie(
      { ...serieData, icon: iconName },
      userId,
    );
  }

  @Get(':seriesId')
  async getSeries(@Param('seriesId') seriesId: string) {
    return this.seriesService.getSerieById(seriesId);
  }

  @Patch(':seriesId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('icon'))
  async updateSeries(
    @Param('seriesId') seriesId: string,
    @Body() updateData: UpdateSeriesDto,
    @Req() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const hasPermission = await this.teamMembersService.hasSomeTeam(userId);
    if (!hasPermission)
      throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);

    const iconName = file
      ? await this.uploadsService.saveImage(file)
      : undefined;

    return this.seriesService.updateSerie(seriesId, {
      ...updateData,
      icon: iconName,
    });
  }
}
