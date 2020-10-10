import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { getLogger } from 'log4js';
import { Oso } from 'oso';
import { Document } from '../document/entity/document';
import { Project, ProjectService } from '../project/project.service';
import { Guest } from '../users/entity/guest';
import { User } from '../users/entity/user';

@Injectable()
export class OsoInstance extends Oso implements CanActivate {
  private readonly logger = getLogger(OsoInstance.name);
  private readonly init: Promise<void[]>;

  constructor() {
    super();
    this.logger.info('Creating new OsoInstance...');
    this.logger.info('registering User...');
    this.registerClass(User);
    this.logger.info('registering Guest...');
    this.registerClass(Guest);
    this.logger.info('registering Document...');
    this.registerClass(Document);
    this.logger.info('registering Project...');
    // TODO: Handle promises
    this.registerClass(Project);
    this.registerClass(ProjectService);
    this.registerConstant('console', console);
    const files = ["roles", "permissions"];
    this.init = Promise.all(files.map(file => this.loadFile(`${__dirname}/${file}.polar`)));
  }

  async initialized() {
    await this.init;
  }

  isAllowed(actor: unknown, action: unknown, resource: unknown): Promise<boolean> {
    const isAllowed = super.isAllowed(actor, action, resource);
    isAllowed.then(
      (answer) => this.logger.info('isAllowed(): actor: ', actor, '; action: ', action, '; resource: ', resource, '; isAllowed: ', answer)
    );
    return isAllowed;
  }

  canActivate(context: ExecutionContext): boolean {
    context.switchToHttp().getRequest().oso = this;
    return true;
  }

  unauthorized() {
    throw new UnauthorizedException();
  }
}