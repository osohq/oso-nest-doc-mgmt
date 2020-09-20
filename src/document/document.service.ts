import { Injectable } from '@nestjs/common';
import { Project, ProjectService } from '../project/project.service';
import { User } from '../users/entity/user';
import { UsersService } from '../users/users.service';
import { CreateDocumentDto } from './dto/document.dto';
import { Document } from './entity/document';
import { Comment } from './entity/comment';
import { EditActionDto } from './dto/edit-action.dto';

@Injectable()
export class DocumentService {
  private sequence = 0
  private readonly documents: Document[];
  private readonly comments: Comment[];

  constructor(private readonly usersService: UsersService, private readonly projectService: ProjectService) {
    // Create some initial data for demo purposes
    const maria = usersService.findOne('maria');
    const john = usersService.findOne('john');
    const project = projectService.findOne(projectService.create('Maria\'s default project', maria.id));
    // Add maria and john as demo project members; leave chris not a member of the demo project.
    projectService.addMember(project.id, maria.id);
    projectService.addMember(project.id, john.id);

    this.documents = [
      new Document(this.nextSequence(), maria, project, 'Hello, World!', false, false),
      new Document(this.nextSequence(), john, project, 'Goodbye, Moon!', false, false)
    ];
    this.comments = [];
  }

  async create(document: CreateDocumentDto): Promise<number> {
    const id = ++this.sequence;
    const owner: User = this.usersService.findById(document.ownerId);
    if (owner === undefined) {
      throw new Error(`No such user: ${document.ownerId}`);
    }

    const project: Project = this.projectService.findOne(document.projectId);
    if (project === undefined) {
      throw new Error(`No such project: ${document.projectId}`);
    }

    this.documents.push(new Document(id,
      owner,
      project,
      document.document,
      document.allowsDocumentComment,
      document.allowsInlineComment));
    return id;
  }

  async findOne(id: number): Promise<Document | undefined> {
    return this.documents.find(document => document.id === id);
  }

  async findAll(): Promise<Document[]> {
    return [...this.documents];
  }

  async edit(edit: EditActionDto): Promise<void> {
    const document: Document = await this.findOne(edit.documentId);
    if (document) {
      document.document = edit.document;
    }
  }

  async findCommentsByDocument(documentId: number): Promise<Comment[]> {
    return this.comments.filter(comment => comment.documentId === documentId);
  }

  async createComment(documentId: number, data: string): Promise<number> {
    const id = ++this.sequence;
    this.comments.push(new Comment(id, documentId, data));
    return id;
  }

  private nextSequence(): number {
    return ++this.sequence;
  }
}
