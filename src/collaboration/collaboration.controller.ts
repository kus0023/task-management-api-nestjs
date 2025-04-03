import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { ShareBoardWithDto } from './dto/share-board-with.dto';
import { AssignTaskDto } from './dto/assign-task.dto';

@Controller('collaborate')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) { }

  /**
   * Collaboration:
   * Users can share boards with other users.
   * Users can assign tasks to specific users within the board.
   */

  @Post("/board/share")
  shareBoardWith(@Body() shareBoardWithDto: ShareBoardWithDto, @Request() req) {
    const currentUserId = req.user.userId;
    return this.collaborationService.shareBoardWith(shareBoardWithDto, currentUserId);
  }


  @Post("/task/assign")
  assignTaskToUser(@Body() assignTaskDto: AssignTaskDto, @Request() req) {
    const currentUserId = req.user.userId;
    return this.collaborationService.assignTaskToUser(assignTaskDto, currentUserId);
  }

  @Get("/board")
  // To get all the shared board for current user
  getAllSharedBoards(@Request() req) {
    const currentUserId = req.user.userId;
    return this.collaborationService.getAllSharedBoards(currentUserId);
  }

  @Get("/task")
  // To get all the shared tasks for current user
  getAllSharedTasks(@Request() req) {
    const currentUserId = req.user.userId;
    return this.collaborationService.getAllSharedTasks(currentUserId);
  }

}
