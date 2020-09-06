import { ExecutionContext, ForbiddenException, Type, UnauthorizedException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { mock } from 'jest-mock-extended';
import { Oso } from 'oso';
import { OsoInstance } from './oso-instance';
import { authorizeFactory, OsoGuard } from './oso.guard';

describe('OsoGuard', () => {
  let handler;
  let reflector: Reflector;
  let osoInstance: OsoInstance;
  let executionContext: ExecutionContext;
  let osoGuard: OsoGuard;
  let mockGetRequest;
  let request;
  beforeEach(() => {
    handler = jest.fn();
    request = {};
    reflector = mock<Reflector>();
    osoInstance = mock<OsoInstance>();
    executionContext = mock<ExecutionContext>();
    const httpContext: HttpArgumentsHost = mock<HttpArgumentsHost>();

    jest.spyOn(executionContext, 'getHandler').mockReturnValue(handler);
    jest.spyOn(executionContext, 'switchToHttp').mockReturnValue(httpContext);
    mockGetRequest = jest.spyOn(httpContext, 'getRequest');
    mockGetRequest.mockReturnValue(request);

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

  it('should have an authorize factory for the @Authorize decorator', async () => {
    const data = 'data';

    const resource = {};
    const mockOso = {
      isAllowed: jest.fn()
    };
    request.oso = mockOso;
    mockOso.isAllowed.mockReturnValue(Promise.resolve(true));
    expect(request.oso).toBeDefined();

    let authorizeFunction = authorizeFactory(data, executionContext);
    await authorizeFunction(resource);
    expect(mockOso.isAllowed).toHaveBeenCalledTimes(1);

    // test the case where data is undefined
    // TODO: Break these out into separate tests so that it's not so fragile
    authorizeFunction = authorizeFactory(undefined, executionContext);
    await authorizeFunction(resource);
    expect(mockOso.isAllowed).toHaveBeenCalledTimes(2);

    // test the unauthorized case
    mockOso.isAllowed.mockReturnValueOnce(Promise.resolve(false));
    // XXX: This should be prettier, but the expect infrastructure for testing if an async function throws an error
    // doesn't seem to work.
    let err;
    try {
      await authorizeFunction(resource);
    } catch (e) {
      err = e;
    }
    expect(err).toEqual(new ForbiddenException());
  });
});