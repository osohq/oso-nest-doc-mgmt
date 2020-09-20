import { Injectable } from '@nestjs/common';

export class Project {
  private members: Set<number> = new Set();

  constructor(public readonly name: string, public readonly id: number, public readonly ownerId: number) {
    this.addMember(ownerId);
  }

  addMember(userId: number): void {
    this.members.add(userId);
  }

  getMembers(): Set<number> {
    return new Set(this.members);
  }

  isMember(userId: number): boolean {
    return this.members.has(userId);
  }
}

@Injectable()
export class ProjectService {
  private sequence = 0;
  private readonly projects = {}

  create(name: string, ownerId: number) {
    const id = ++this.sequence;
    this.projects[id] = new Project(name, id, ownerId);
    return id;
  }

  findOne(id: number): Project {
    return this.projects[id];
  }

  addMember(id: number, userId: number): void {
    this.findOne(id).addMember(userId);
  }

  findMembers(projectId: number): number[] {
    return Array.from(this.findOne(projectId).getMembers());
  }
}
