import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TasksService {

  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly dbService: DatabaseService) { }
  async create(createTaskDto: Prisma.TaskCreateManyAssignedToDetailInput, currentUserId: string) {

    const boardListExists = await this.dbService.boardList
      .findUnique({ where: { id: createTaskDto.boardListId, }, include: { boardDetail: true } });

    if (!boardListExists) {
      throw new Error('Board list does not exist');
    }

    if (boardListExists.boardDetail.userId !== currentUserId) {
      throw new Error('Board does not belong to user');
    }


    this.logger.log(`Creating task with details: ${JSON.stringify(createTaskDto)}`);
    return this.dbService.task.create({
      data: {
        ...createTaskDto,
        deadline: new Date(createTaskDto.deadline)
      },
      include: {
        boardListDetail: {
          include: {
            boardDetail: true
          }
        },
      }
    });
  }

  findOne(id: string, currentUserId: string) {
    return this.dbService.task.findUnique({
      where: {
        id: id, boardListDetail: {
          boardDetail: {
            userId: currentUserId
          }
        }
      },
      include: {
        boardListDetail: {
          include: {
            boardDetail: true
          }
        },
      }
    });
  }

  update(id: string, updateTaskDto: Prisma.TaskUpdateInput, currentUserId: string) {
    return this.dbService.task.update({
      where: {
        id: id,
        boardListDetail: {
          boardDetail: {
            userId: currentUserId
          }
        }
      },
      data: {
        ...updateTaskDto,
        deadline: updateTaskDto.deadline && new Date(updateTaskDto.deadline as string)
      },
      include: {
        boardListDetail: {
          include: {
            boardDetail: true
          }
        },
      }
    });
  }

  remove(id: string, currentUserId: string) {
    const taskExists = this.findOne(id, currentUserId);
    if (!taskExists) throw new NotFoundException("Task not found");
    return this.dbService.task.delete({
      where: {
        id: id,
        boardListDetail: {
          boardDetail: {
            userId: currentUserId
          }
        }
      }
    });
  }
}
