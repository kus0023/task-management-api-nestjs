import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ValidationPipe } from '@nestjs/common';
import { BoardListsService } from './board-lists.service';
import { CreateBoardListDto } from './dto/create-board-list.dto';
import { UpdateBoardListDto } from './dto/update-board-list.dto';

@Controller('board-lists')
export class BoardListsController {
  constructor(private readonly boardListsService: BoardListsService) { }

  @Post()
  create(@Body() createBoardListDto: CreateBoardListDto, @Request() req: any) {
    const currentUserId = req.user.userId;
    return this.boardListsService.create(createBoardListDto, currentUserId);
  }

  @Get()
  findAll(@Request() req: any) {
    const currentUserId = req.user.userId;
    return this.boardListsService.findAll(currentUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const currentUserId = req.user.userId;
    return this.boardListsService.findOne(id, currentUserId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBoardListDto: UpdateBoardListDto,
    @Request() req: any
  ) {
    const currentUserId = req.user.userId;
    return this.boardListsService.update(id, updateBoardListDto, currentUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const currentUserId = req.user.userId;
    return this.boardListsService.remove(id, currentUserId);
  }
}
