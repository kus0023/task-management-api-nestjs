import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TasksService {

  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly dbService: DatabaseService) { }
  async create(createTaskDto: Prisma.TaskCreateManyAssignedToDetailInput, currentUserId: string) {

    const boardListExists = await this.dbService.boardList
      .findUnique({
        where: { id: createTaskDto.boardListId, },
        include: { boardDetail: true }
      });

    if (!boardListExists) {
      throw new NotFoundException('Board list does not exist');
    }

    if (boardListExists.boardDetail.userId !== currentUserId) {
      throw new UnauthorizedException('Board does not belong to user');
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

  async findOne(id: string, currentUserId: string) {
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

  async update(id: string, updateTaskDto: Prisma.TaskUncheckedUpdateManyInput, currentUserId: string) {

    const taskExists = await this.dbService.task.findUnique({
      where: { id },
      include: {
        boardListDetail: {
          include: {
            boardDetail: true,
          }
        }
      }
    });

    if (!taskExists) throw new NotFoundException("Task not found");

    let isOwnerOfBoard = taskExists.boardListDetail.boardDetail.userId === currentUserId;
    let isAssignedToTask = taskExists.assignedTo === currentUserId

    if (!isOwnerOfBoard && !isAssignedToTask)
      throw new UnauthorizedException("You are not authorized to update this task");

    // update done by current user
    // The user also can't change assignee from here
    // It should be from route ==> POST /collaborate/board/share
    if (isOwnerOfBoard) {
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


    // update done by another user whom board is shared
    // The user who don't own the task cannot update assignee
    if (isAssignedToTask) {
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
          deadline: updateTaskDto.deadline && new Date(updateTaskDto.deadline as string),
          // The user who don't own the task cannot update assignee
          assignedTo: currentUserId
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
  }

  async remove(id: string, currentUserId: string) {
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
