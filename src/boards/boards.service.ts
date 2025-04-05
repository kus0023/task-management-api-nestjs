import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BoardsService {
  private readonly logger = new Logger(BoardsService.name);
  constructor(
    private readonly dbService: DatabaseService
  ) { }

  async create(createBoardDto: Prisma.BoardCreateManyInput) {
    this.logger.log(`Creating board with details: ${JSON.stringify(createBoardDto)}`);
    const board = await this.dbService.board.create({ data: createBoardDto });
    this.logger.log(`Created board: ${JSON.stringify(board)}`);

    this.logger.log('Creating board lists of name In-Progress, Completed and To-do');
    const boardLists = await this.dbService.$transaction([
      this.dbService.boardList.create({
        data: {
          name: "In-Progress",
          boardId: board.id
        }
      }),
      this.dbService.boardList.create({
        data: {
          name: "Completed",
          boardId: board.id
        }
      }),
      this.dbService.boardList.create({
        data: {
          name: "To-do",
          boardId: board.id
        }
      })

    ])

    this.logger.log(`Created board lists: ${JSON.stringify(boardLists)}`);


    return board
  }

  async findAll(currentUserId: string) {
    this.logger.log('Retrieving all boards');
    return this.dbService.board.findMany({
      where: {
        userId: currentUserId
      },
      include: {
        BoardList: true,
        user: { omit: { password: true } },
        sharedWith: true
      }
    });
  }

  async findOne(boardId: string, requestingUserId: string) {
    this.logger.log(`Retrieving board with id ${boardId} and user id ${requestingUserId}`);
    return this.dbService.board.findUnique({
      where: {
        id: boardId,
        user: { id: requestingUserId }
      },
      include: { BoardList: true, user: { omit: { password: true } }, sharedWith: true },

    });
  }

  async update(boardId: string, updateBoardDto: UpdateBoardDto, currentUserId: string) {
    this.logger.log(`Updating board with id ${boardId} and user id ${currentUserId}`);
    return this.dbService.board
      .update({
        where: {
          id: boardId,
          user: { id: currentUserId }
        },
        data: updateBoardDto
      });
  }

  async remove(boardId: string, currentUserId: string) {
    this.logger.log(`Deleting board with id ${boardId} and user id ${currentUserId}`);
    const board = await this.findOne(boardId, currentUserId);
    if (!board) throw new NotFoundException("Board not found");
    return this.dbService.board.delete({ where: { id: boardId, user: { id: currentUserId } } });
  }
}

