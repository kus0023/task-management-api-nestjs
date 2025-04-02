import { Controller, Get, Post, Body, Patch, Param, Delete, Request, NotFoundException } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) { }

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto, @Request() req) {

    createBoardDto.user = { connect: { id: req.user.userId } };

    const board = await this.boardsService.create(createBoardDto);
    return board
  }

  @Get()
  findAll() {
    const boards = this.boardsService.findAll();
    if (!boards) throw new NotFoundException("No boards are available");
    return boards;
  }

  @Get(':id')
  findOne(@Param('id') boardId: string, @Request() req) {
    const boards = this.boardsService.findOne(boardId, req.user.userId);
    if (!boards) throw new NotFoundException("No boards are available");
    return boards;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.remove(+id);
  }
}
