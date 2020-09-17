import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';

@Module({
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}
