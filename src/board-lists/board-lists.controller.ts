import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardListsService } from './board-lists.service';
import { CreateBoardListDto } from './dto/create-board-list.dto';
import { UpdateBoardListDto } from './dto/update-board-list.dto';

@Controller('board-lists')
export class BoardListsController {
  constructor(private readonly boardListsService: BoardListsService) {}

  @Post()
  create(@Body() createBoardListDto: CreateBoardListDto) {
    return this.boardListsService.create(createBoardListDto);
  }

  @Get()
  findAll() {
    return this.boardListsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardListsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardListDto: UpdateBoardListDto) {
    return this.boardListsService.update(+id, updateBoardListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardListsService.remove(+id);
  }
}
