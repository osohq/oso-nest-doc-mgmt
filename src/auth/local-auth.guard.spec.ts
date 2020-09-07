import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, mockDeep } from 'jest-mock-extended';
import { Actor } from '../users/entity/actor';
import { LocalAuthGuard } from './local-auth.guard';
import { LocalStrategy } from './local.strategy';

describe(LocalAuthGuard.name, () => {

  let guard: LocalAuthGuard;
  let strategy: LocalStrategy;
  let executionContext: ExecutionContext;
  let mockRequest;
  let mockValidate;
  beforeEach(async () => {
    // TODO: refactor mock execution context plumbing so it's reusable.
    mockRequest = {
      body: {},
      user: undefined
    };
    executionContext = mock<ExecutionContext>();
    const mockHttpContext = mock<HttpArgumentsHost>();
    const switchToHttp = jest.spyOn(executionContext, 'switchToHttp');
    switchToHttp.mockReturnValue(mockHttpContext);

    const mockGetRequest = jest.spyOn(mockHttpContext, 'getRequest');
    mockGetRequest.mockReturnValue(mockRequest);

    strategy = mock<LocalStrategy>();
    mockValidate = jest.spyOn(strategy, 'validate');
    guard = new LocalAuthGuard(strategy);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define canActivate()', () => {
    expect(guard.canActivate).toBeDefined();
  });

  it('should resolve the user and put it into request.user', async () => {
    const mockUser = {
      username: 'mockUser'
    };
    mockValidate.mockReturnValueOnce(Promise.resolve(mockUser));
    const returnValue = await guard.canActivate(executionContext);
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockRequest.user).toEqual(mockUser);
    expect(returnValue).toBeTruthy();
  });

  it('should not hide errors.', async () => {
    const err = new Error('Some Error');
    mockValidate.mockReturnValueOnce(Promise.reject(err));
    await expect(guard.canActivate(executionContext)).rejects.toEqual(err);
  });
}); 
