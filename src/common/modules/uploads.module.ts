import { Module } from '@nestjs/common';
import { UploadsService } from '../services/uploads.service';

@Module({
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
