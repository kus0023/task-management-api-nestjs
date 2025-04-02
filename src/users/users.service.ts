import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {

    private readonly logger = new Logger(UsersService.name);

    constructor(private readonly dbService: DatabaseService) { }

    /**
     * Creates a new user given their details.
     * @param {Prisma.UserCreateInput} userDetails The details of the user to be created.
     * @returns {Promise<Prisma.User>} The created user.
     */
    createUser(userDetails: Prisma.UserCreateInput) {
        this.logger.log(`Creating user with details: ${JSON.stringify(userDetails)}`);
        return this.dbService.user.create({ data: userDetails })
            .then(user => {
                this.logger.log(`Created user: ${JSON.stringify(user)}`);
                return user;
            });
    }

    /**
     * Returns a user given their id.
     * @param {string} userId The id of the user to be retrieved.
     * @returns {Promise<Prisma.UserGetPayload<{ select: Prisma.UserSelect }>>} The user.
     */
    async getUser(userId: string) {
        this.logger.log(`Retrieving user with id ${userId}`);
        const user = await this.dbService.user.findUnique({ where: { id: userId } });
        this.logger.log(`Retrieved user: ${JSON.stringify(user)}`);
        return user;
    }
}
