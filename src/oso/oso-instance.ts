import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { getLogger } from 'log4js';
import { Oso } from 'oso';
import { Base } from '../base/base.service';
import { Document } from '../document/entity/document';
import { Actor } from '../users/entity/actor';
import { Guest } from '../users/entity/guest';
import { User } from '../users/entity/user';

const POLAR_FILES: string[] = [
  `${__dirname}/root.polar`,
  `${__dirname}/policy.polar`
];

@Injectable()
export class OsoInstance extends Oso implements CanActivate {
  private readonly logger = getLogger(OsoInstance.name);
  private readonly init: Promise<void>;

  constructor() {
    super();
    this.logger.info('Creating new OsoInstance...');
    this.init = new Promise((resolve, reject) => {
      this.registerClass(User);
      this.registerClass(Guest);
      this.registerClass(Actor);
      this.registerClass(Document);
      this.registerClass(Base);
      this.registerConstant('console', console);

      Promise.all(POLAR_FILES.map(file => this.loadFile(file)))
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }

  async initialized() {
    await this.init;
  }

  canActivate(context: ExecutionContext): boolean {
    context.switchToHttp().getRequest().oso = this;
    return true;
  }

  unauthorized() {
    throw new UnauthorizedException();
  }
}