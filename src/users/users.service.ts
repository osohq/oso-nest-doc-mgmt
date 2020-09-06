import { Injectable } from '@nestjs/common';
import { User } from './entity/user';

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      new User(1, 'john', 'changeme'),
      new User(2, 'chris', 'secret'),
      new User(3, 'maria', 'guess'),
    ];
  }

  findOne(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }
}
