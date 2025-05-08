import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from '@/teams/teams.module';
import { Serie, SerieSchema } from './schemas/serie.schema';
import { SeriesController } from './controllers/series.controller';
import { SeriesService } from './services/series.service';
import { UploadsModule } from '@/common/modules/uploads.module';
import { ChaptersController } from './controllers/chapters.controller';
import { VolumesController } from './controllers/volumes.controller';
import { VolumesService } from './services/volumes.service';
import { ChaptersService } from './services/chapters.service';
import { Volume, VolumeSchema } from './schemas/volume.schema';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { JwtWrapperModule } from '@/common/modules/jwt-wrapper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Serie.name, schema: SerieSchema },
      { name: Volume.name, schema: VolumeSchema },
      {
        name: Chapter.name,
        schema: ChapterSchema,
      },
    ]),
    TeamsModule,
    UploadsModule,
    JwtWrapperModule,
  ],
  controllers: [SeriesController, ChaptersController, VolumesController],
  providers: [SeriesService, VolumesService, ChaptersService],
  exports: [SeriesService, VolumesService, ChaptersService],
})
export class SeriesModule {}
