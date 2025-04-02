import { Module } from '@nestjs/common';
import { BoardListsService } from './board-lists.service';
import { BoardListsController } from './board-lists.controller';
import { DatabaseService } from 'src/database/database.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [BoardListsController],
  providers: [BoardListsService, DatabaseService],
})
export class BoardListsModule { }
