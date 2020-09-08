import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { OsoInstance } from './oso-instance';
import { mockDeep } from 'jest-mock-extended';

describe('OsoInstance', () => {
  let osoInstance: OsoInstance;
  let executionContext: ExecutionContext;
  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [OsoInstance]
    }).compile();
    executionContext = mockDeep<ExecutionContext>();
    osoInstance = testingModule.get<OsoInstance>(OsoInstance);
    await osoInstance.initialized();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(OsoInstance).toBeDefined();
  });

  it('should put itself into the request context on canActivate()', () => {
    const mockSwitchToHttp = jest.spyOn(executionContext, 'switchToHttp');
    const mockHttpContext: HttpArgumentsHost = mockDeep<HttpArgumentsHost>();
    const mockGetRequest = jest.spyOn(mockHttpContext, 'getRequest');
    const mockRequest = {
      oso: undefined
    };

    mockSwitchToHttp.mockReturnValueOnce(mockHttpContext);
    mockGetRequest.mockReturnValueOnce(mockRequest);
    const returnValue = osoInstance.canActivate(executionContext);
    expect(returnValue).toBeTruthy();

    expect(mockRequest.oso).toBeDefined();
    expect(mockRequest.oso).toEqual(osoInstance);
  });

  it('should throw an UnauthorizedException on unauthorized()', () => {
    expect(() => {osoInstance.unauthorized();}).toThrow(UnauthorizedException);
  });
});