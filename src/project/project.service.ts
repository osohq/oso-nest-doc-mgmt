import { Injectable } from '@nestjs/common';

export class Project {
  constructor(public readonly id: number, public readonly ownerId: number) {
  }
}

@Injectable()
export class ProjectService {
  private sequence = 0;
  private readonly projects = {}

  create(ownerId: number) {
    const id = ++this.sequence;
    this.projects[id] = new Project(id, ownerId);
    return id;
  }

  findOne(id: number): Project {
    return this.projects[id];
  }
}
