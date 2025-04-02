import { Injectable, Logger } from '@nestjs/common';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BoardsService {
  private readonly logger = new Logger(BoardsService.name);
  constructor(
    private readonly dbService: DatabaseService
  ) { }

  async create(createBoardDto: Prisma.BoardCreateInput) {

    this.logger.log(`Creating board with details: ${JSON.stringify(createBoardDto)}`);
    const board = await this.dbService.board.create({ data: createBoardDto });
    this.logger.log(`Created board: ${JSON.stringify(board)}`);
    return board;
  }

  findAll() {
    return `This action returns all boards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
