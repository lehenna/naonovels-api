import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TeamMembersService } from '@/teams/services/team-members.service';
import { CreateChapterDto } from '../dto/create-chapter.dto';
import { UpdateChapterDto } from '../dto/update-chapter.dto';
import { ChaptersService } from '../services/chapters.service';

@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly chaptersService: ChaptersService,
    private readonly teamMembersService: TeamMembersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createChapter(@Body() createChapterDto: CreateChapterDto, @Req() req) {
    const userId = req.user.id;
    const hasPermission = await this.teamMembersService.hasSomeTeam(userId);

    if (!hasPermission)
      throw new HttpException('Permission denied', HttpStatus.UNAUTHORIZED);

    return this.chaptersService.createChapter(createChapterDto);
  }

  @Get(':chapterId')
  async getChapter(@Param('chapterId') chapterId: string) {
    return this.chaptersService.getChapterById(chapterId);
  }

  @Patch(':chapterId')
  @UseGuards(JwtAuthGuard)
  async updateChapter(
    @Param('chapterId') chapterId: string,
    @Body() updateChapterDto: UpdateChapterDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    const hasPermission = await this.teamMembersService.hasSomeTeam(userId);

    if (!hasPermission)
      throw new HttpException('Permission denied', HttpStatus.UNAUTHORIZED);

    return this.chaptersService.updateChapter(chapterId, updateChapterDto);
  }

  @Delete(':chapterId')
  @UseGuards(JwtAuthGuard)
  async deleteChapter(@Param('chapterId') chapterId: string, @Req() req) {
    const userId = req.user.id;

    const hasPermission = await this.teamMembersService.hasSomeTeam(userId);

    if (!hasPermission)
      throw new HttpException('Permission denied', HttpStatus.UNAUTHORIZED);

    return this.chaptersService.deleteChapter(chapterId);
  }
}
