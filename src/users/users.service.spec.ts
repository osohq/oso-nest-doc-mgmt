import { Set } from 'immutable';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entity/user';
import { UsersService } from './users.service';

describe(UsersService.name, () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by username', async () => {
    const username = 'john';
    const user = await service.findOne(username);
    expect(user).toBeDefined();
    expect(user.username).toEqual(username);
  });

  it('should find all users', () => {
    const users: Set<User> = service.findAll();
    expect(users).toBeDefined();
    expect(users.size).toBeGreaterThan(0);
  });
});
