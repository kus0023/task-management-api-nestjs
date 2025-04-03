import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
    const currentUserId = req.user.userId;
    return this.tasksService.create(createTaskDto, currentUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const currentUserId = req.user.userId;
    return this.tasksService.findOne(id, currentUserId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: any
  ) {
    const currentUserId = req.user.userId;
    return this.tasksService.update(id, updateTaskDto, currentUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const currentUserId = req.user.userId;
    return this.tasksService.remove(id, currentUserId);
  }
}
