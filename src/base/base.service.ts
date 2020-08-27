import { Injectable } from '@nestjs/common';

export class Base {
    ownerId: number
    constructor(public id: number) {
        this.ownerId = id; // hack this in for now
    }
}

@Injectable()
export class BaseService {}
