import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBoardListDto } from './dto/create-board-list.dto';
import { UpdateBoardListDto } from './dto/update-board-list.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BoardListsService {
  private logger = new Logger(BoardListsService.name);
  constructor(private readonly dbService: DatabaseService) { }

  async create(createBoardListDto: CreateBoardListDto, currentUserId: string) {
    await this.verifyBoardOfCurrentUser(createBoardListDto.boardId, currentUserId);
    return this.dbService.boardList
      .create({
        data: {
          name: createBoardListDto.name,
          boardId: createBoardListDto.boardId
        }
      });
  }

  async findAll() {
    return this.dbService.boardList.findMany({ include: { boardDetail: true } });
  }

  async findOne(id: string) {
    return this.dbService.boardList.findUnique({
      where: { id: id },
      include: { boardDetail: true }
    });
  }

  async update(boardListId: string, updateBoardListDto: UpdateBoardListDto, currentUser: string) {

    const boardListExists = await this.findOne(boardListId);
    if (!boardListExists) throw new NotFoundException('BoardList not found');

    if (updateBoardListDto.boardId)
      await this.verifyBoardOfCurrentUser(updateBoardListDto.boardId, currentUser);
    else
      throw new BadRequestException("Please provide a valid boardId in body");

    if (boardListExists.boardId !== updateBoardListDto.boardId)
      throw new BadRequestException('Trying to update Board Id of a BoardList that does not belong to it');

    delete updateBoardListDto.boardId

    return this.dbService.boardList
      .update({
        where: { id: boardListId }, data: {
          ...updateBoardListDto
        }
      });
  }

  async remove(id: string) {
    const boardListExists = await this.findOne(id);
    if (!boardListExists) throw new NotFoundException('BoardList not found');
    return this.dbService.boardList.delete({ where: { id: id } });
  }

  async verifyBoardOfCurrentUser(boardId: string, currentUserId: string) {
    const board = await this.dbService.board.findUnique({
      where: { id: boardId, user: { id: currentUserId } },
      include: { user: true }
    });
    if (!board) throw new Error('Board not found');
    if (board.user.id !== currentUserId) throw new UnauthorizedException('Board not owned by user');
    return board;
  }
}
