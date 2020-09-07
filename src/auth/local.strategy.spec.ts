import { mock } from 'jest-mock-extended';
import { Actor } from '../users/entity/actor';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe(LocalStrategy.name, () => {
  let mockAuthService: AuthService;
  let strategy: LocalStrategy;
  let mockValidateUser;

  beforeEach(() => {
    mockAuthService = mock<AuthService>();
    mockValidateUser = jest.spyOn(mockAuthService, 'validateUser');
    strategy = new LocalStrategy(mockAuthService);
  });

  afterEach(jest.resetAllMocks);

  it('should be defined', () => {
    expect(strategy).toBeDefined();
    expect(strategy.validate).toBeDefined();
  });

  it('should validate via AuthService.validate', async () => {
    const expectedActor = mock<Actor>();
    mockValidateUser.mockReturnValueOnce(Promise.resolve(expectedActor));
    const actualActor = await strategy.validate('foo', 'bar');
    expect(mockValidateUser).toHaveBeenCalledTimes(1);
    expect(actualActor).toEqual(expectedActor);
  });
});