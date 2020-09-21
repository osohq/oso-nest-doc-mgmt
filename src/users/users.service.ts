import { Set } from 'immutable';
import { Injectable } from '@nestjs/common';
import { User } from './entity/user';

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      new User(1, 'john', 'changeme'),
      new User(2, 'chris', 'changeme'),
      new User(3, 'maria', 'changeme'),
    ];
  }

  findOne(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  findAll(): Set<User> {
    return Set(this.users);
  }

  findById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}
