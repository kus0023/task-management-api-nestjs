import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ShareBoardWithDto } from './dto/share-board-with.dto';

@Injectable()
export class CollaborationService {

  constructor(private readonly dbService: DatabaseService) { }

  async shareBoardWith(shareBoardWithDto: ShareBoardWithDto, currentUserId: string) {

    // check if current user is the owner of the board
    const board = await this.dbService.board.findUnique({ where: { id: shareBoardWithDto.boardId, userId: currentUserId } });
    if (!board) throw new UnauthorizedException('Board not owned by user');

    // check if all users exist
    const users = await this.dbService.user
      .findMany({ where: { id: { in: shareBoardWithDto.userIds } } });
    if (users.length !== shareBoardWithDto.userIds.length) throw new BadRequestException('User/users does not exist');

    // get all unique Id of users
    const uniqueUserIds = [...new Set([...shareBoardWithDto.userIds, ...board.sharedWithIds])];

    return this.dbService.board.update({
      where: { id: shareBoardWithDto.boardId },
      data: {
        sharedWithIds: {
          set: uniqueUserIds
        }
      },
      include: {
        BoardList: true
      }
    });
  }

}
