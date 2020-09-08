import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable, Logger,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OsoInstance } from './oso-instance';

export const Action = (action: string) => SetMetadata('action', action);
export const Resource = (resource: any) => SetMetadata('resource', resource);

export const authorizeFactory = (data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  const action = data || ctx.getHandler().name;
  const oso = request.oso;
  return async (resource: any) => {
    const isAllowed = await oso.isAllowed(user, action, resource);
    console.log('authorize(): user: ', user, '; action: ', action, '; resource: ', resource, 'isAllowed: ', isAllowed);
    if (!isAllowed) {
      throw new ForbiddenException();
    }
  };
};

export const Authorize = createParamDecorator(authorizeFactory);

@Injectable()
export class OsoGuard implements CanActivate {

  private readonly logger = new Logger(OsoGuard.name);

  constructor(private reflector: Reflector, private oso: OsoInstance) {
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const actor = request.user || 'anonymous';
    const action =
      this.reflector.get<string[]>('action', context.getHandler()) ||
      context.getHandler().name;
    const resource =
      this.reflector.get<string[]>('resource', context.getHandler()) ||
      context.getClass().name;
    this.logger.log(`Checking to see if actor is authorized: actor: ${actor}, action: ${action}, resource: ${resource}`);
    return this.oso.isAllowed(actor, action, resource);
  }
}
