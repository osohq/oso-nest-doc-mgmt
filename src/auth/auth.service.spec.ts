import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Guest } from '../users/entity/guest';
import { User } from '../users/entity/user';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('../users/users.service');
jest.mock('../users/entity/guest');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService],
    }).compile();
    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', async () => {
    const suppliedUsername = 'suppliedUsername', suppliedPassword = 'suppliedPassword';
    const user: User = new User(100, suppliedUsername, suppliedPassword);
    const mockFindOne = jest.spyOn(userService, 'findOne');
    mockFindOne.mockReturnValue(user);

    // test valid user case
    const validatedUser = await service.validateUser(suppliedUsername, suppliedPassword);

    expect(validatedUser).toEqual(user);
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith(suppliedUsername);

    jest.resetAllMocks();

    // test invalid user case
    user.password = 'not the supplied password';
    await expect(service.validateUser(suppliedUsername, suppliedPassword)).rejects.toEqual(new UnauthorizedException());
  });
});
