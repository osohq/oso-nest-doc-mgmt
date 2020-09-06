import { ExecutionContext, Type } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { mock } from 'jest-mock-extended';
import { OsoInstance } from './oso-instance';
import { OsoGuard } from './oso.guard';

describe('OsoGuard', () => {
  let handler;
  let reflector: Reflector;
  let osoInstance: OsoInstance;
  let executionContext: ExecutionContext;
  let osoGuard: OsoGuard;
  let request: Request;
  beforeEach(() => {
    handler = jest.fn();
    request = mock<Request>();
    reflector = mock<Reflector>();
    osoInstance = mock<OsoInstance>();
    executionContext = mock<ExecutionContext>();
    const httpContext: HttpArgumentsHost = mock<HttpArgumentsHost>();

    jest.spyOn(executionContext, 'getHandler').mockReturnValue(handler);
    jest.spyOn(executionContext, 'switchToHttp').mockReturnValue(httpContext);
    jest.spyOn(httpContext, 'getRequest').mockReturnValue(request);

    osoGuard = new OsoGuard(reflector, osoInstance);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(OsoGuard).toBeDefined();
  });

  it('should implement canActivate()', async () => {
    const mockIsAllowed = jest.spyOn(osoInstance, 'isAllowed');
    const handlerClass: Type<any> = mock<Type<any>>();
    jest.spyOn(executionContext, 'getClass').mockReturnValue(handlerClass);
    mockIsAllowed.mockReturnValueOnce(Promise.resolve(true));
    const returnValue = await osoGuard.canActivate(executionContext);

    expect(mockIsAllowed).toHaveBeenCalledTimes(1);
    expect(returnValue).toBeTruthy();
  });
});