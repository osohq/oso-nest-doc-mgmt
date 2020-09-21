import { Actor } from './actor';

export class User extends Actor {
  constructor(public id: number, public username: string, public password: string) {
    super();
  }

  isGuest(): boolean {
    return false;
  }
}