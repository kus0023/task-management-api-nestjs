import { Controller, Get, Post, Body, Patch, Param, Delete, Request, NotFoundException } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) { }

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto, @Request() req) {

    createBoardDto.userId = req.user.userId;

    const board = await this.boardsService.create(createBoardDto);
    return board
  }

  @Get()
  async findAll(@Request() req) {
    const currentUserId = req.user.userId;
    const boards = await this.boardsService.findAll(currentUserId);
    if (!boards) throw new NotFoundException("No boards are available");
    return boards;
  }

  @Get(':id')
  async findOne(@Param('id') boardId: string, @Request() req) {
    const boards = await this.boardsService.findOne(boardId, req.user.userId);
    if (!boards) throw new NotFoundException("No boards are available");
    return boards;
  }

  @Patch(':id')
  async update(
    @Param('id') boardId: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Request() req) {
    const currentUserId = req.user.userId;
    return this.boardsService.update(boardId, updateBoardDto, currentUserId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {

    const currentUserId = req.user.userId;
    return this.boardsService.remove(id, currentUserId);
  }
}
