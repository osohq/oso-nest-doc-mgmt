import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OsoInstance } from './oso-instance';

export const Action = (action: string) => SetMetadata('action', action[0]);
export const Resource = (resource: any) => SetMetadata('resource', resource);


export const Authorize = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const action = data || ctx.getHandler().name;
    const oso = request.oso;
    return async (resource: any) => {
      if(!await oso.isAllowed(user, action, resource)) {
        throw new ForbiddenException();
      }
    };
  }
);

@Injectable()
export class OsoGuard implements CanActivate {
  constructor(private reflector: Reflector, private oso: OsoInstance) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const actor = request.user || 'anonymous';
    const action =
      this.reflector.get<string[]>('action', context.getHandler()) ||
      context.getHandler().name;
    const resource =
      this.reflector.get<string[]>('resource', context.getHandler()) ||
      context.getClass().name;
    return Promise.resolve(this.oso.isAllowed(actor, action, resource));
  }
}
