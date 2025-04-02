import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcrypt'

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly usersService: UsersService) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.getUserByEmail(email);
        if (user && compareSync(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
