import { Injectable } from '@nestjs/common';

export class Actor {}

export class Guest extends Actor {}

export class User extends Actor {
  constructor(public id: number, public username: string, public password: string){
    super();
  }
}

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
