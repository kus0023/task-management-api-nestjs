import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBoardListDto } from './dto/create-board-list.dto';
import { UpdateBoardListDto } from './dto/update-board-list.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardListsService {
  private logger = new Logger(BoardListsService.name);
  constructor(private readonly dbService: DatabaseService) { }

  async create(createBoardListDto: Prisma.BoardListCreateManyInput, currentUserId: string) {
    this.logger.log(`Creating board list with details: ${JSON.stringify(createBoardListDto)}`);
    await this.verifyBoardOfCurrentUser(createBoardListDto.boardId, currentUserId);
    return this.dbService.boardList
      .create({
        data: createBoardListDto
      });
  }

  async findAll(currentUser: string) {
    this.logger.log('Retrieving all board lists');
    return this.dbService.boardList
      .findMany({
        where: {
          boardDetail: {
            userId: currentUser
          }
        },
        include:
          { boardDetail: true }
      });
  }

  async findOne(id: string, currentUser: string) {
    return this.dbService.boardList.findUnique({
      where: {
        id: id,
        boardDetail: {
          userId: currentUser
        }
      },
      include: { boardDetail: true }
    });
  }

  async update(
    boardListId: string,
    updateBoardListDto: Prisma.BoardListUpdateManyMutationInput,
    currentUserId: string
  ) {

    const boardListExists = await this.findOne(boardListId, currentUserId);
    if (!boardListExists) throw new NotFoundException('BoardList not found');

    return this.dbService.boardList
      .update({
        where: { id: boardListId }, data: updateBoardListDto
      });
  }

  async remove(id: string, currentUserId: string) {
    const boardListExists = await this.findOne(id, currentUserId);
    if (!boardListExists) throw new NotFoundException('BoardList not found');
    return this.dbService.boardList.delete({ where: { id: id } });
  }

  private async verifyBoardOfCurrentUser(boardId: string, currentUserId: string) {
    const board = await this.dbService.board.findUnique({
      where: { id: boardId, user: { id: currentUserId } },
      include: { user: true }
    });
    if (!board) throw new Error('Board not found');
    if (board.user.id !== currentUserId) throw new UnauthorizedException('Board not owned by user');
    return board;
  }
}
