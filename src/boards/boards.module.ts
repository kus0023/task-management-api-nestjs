import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService, DatabaseService],
})
export class BoardsModule { }
