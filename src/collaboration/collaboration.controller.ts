import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { ShareBoardWithDto } from './dto/share-board-with.dto';

@Controller('collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) { }

  /**
   * Collaboration:
   * Users can share boards with other users.
   * Users can assign tasks to specific users within the board.
   */

  @Post()
  shareBoardWith(@Body() shareBoardWithDto: ShareBoardWithDto, @Request() req) {
    const currentUserId = req.user.userId;
    return this.collaborationService.shareBoardWith(shareBoardWithDto, currentUserId);
  }

}
