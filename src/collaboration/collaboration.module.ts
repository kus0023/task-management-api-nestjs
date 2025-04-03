import { Module } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { CollaborationController } from './collaboration.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [CollaborationController],
  providers: [CollaborationService, DatabaseService],
})
export class CollaborationModule { }
