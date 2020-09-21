import { Actor } from './actor';

export class Guest extends Actor {
  isGuest(): boolean {
    return true;
  }
}