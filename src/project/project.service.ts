import { Injectable } from '@nestjs/common';

export class Project {
  private readonly members: Set<number> = new Set();

  constructor(public readonly id: number, public readonly ownerId: number) {
    this.addMember(ownerId);
  }

  addMember(userId: number): void {
    this.members.add(userId);
  }

  getMembers(): Set<number> {
    return new Set(this.members);
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

  addMember(id: number, userId: number): void {
    this.findOne(id).addMember(userId);
  }

  findMembers(projectId: number): Set<number> {
    return this.findOne(projectId).getMembers();
  }
}
