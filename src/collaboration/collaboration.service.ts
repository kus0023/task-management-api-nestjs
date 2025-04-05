import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ShareBoardWithDto } from './dto/share-board-with.dto';
import { AssignTaskDto } from './dto/assign-task.dto';

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

  async assignTaskToUser(assignTaskDto: AssignTaskDto, currentUserId: string) {
    // check if current user is the owner of the task
    const task = await this.dbService.task.findUnique({
      where: {
        id: assignTaskDto.taskId,
        boardListDetail: {
          boardDetail: {
            userId: currentUserId
          }
        }
      },
      include: {
        boardListDetail: true
      }
    });
    if (!task) throw new UnauthorizedException('Board not owned by user');

    // check if user exist
    const user = await this.dbService.user
      .findUnique({ where: { id: assignTaskDto.userId } });
    if (!user) throw new BadRequestException('User does not exist');


    // check if user exists in board
    const board = await this.dbService.board.findUnique({
      where: {
        id: task.boardListDetail.boardId,
        sharedWithIds: {
          has: assignTaskDto.userId
        }
      }
    });


    if (!board) throw new BadRequestException('Please share board with user first');

    return this.dbService.task.update({
      where: { id: assignTaskDto.taskId },
      data: {
        assignedTo: assignTaskDto.userId
      }
    });
  }

  getAllSharedTasks(currentUserId: string) {
    return this.dbService.task.findMany({
      where: {
        assignedTo: currentUserId
      },
      include: {
        boardListDetail: {
          include: {
            boardDetail: true
          }
        }
      }
    })
  }
  getAllSharedBoards(currentUserId: string) {
    return this.dbService.board.findMany({
      where: {
        sharedWithIds: {
          has: currentUserId
        }
      },
      include: {
        BoardList: {
          include: {
            Task: true
          }
        },
      }
    })
  }

}
