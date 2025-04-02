import { Injectable } from '@nestjs/common';
import { CreateBoardListDto } from './dto/create-board-list.dto';
import { UpdateBoardListDto } from './dto/update-board-list.dto';

@Injectable()
export class BoardListsService {
  create(createBoardListDto: CreateBoardListDto) {
    return 'This action adds a new boardList';
  }

  findAll() {
    return `This action returns all boardLists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boardList`;
  }

  update(id: number, updateBoardListDto: UpdateBoardListDto) {
    return `This action updates a #${id} boardList`;
  }

  remove(id: number) {
    return `This action removes a #${id} boardList`;
  }
}
