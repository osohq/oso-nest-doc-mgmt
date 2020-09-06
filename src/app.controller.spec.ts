import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OsoInstance } from './oso/oso.guard';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, OsoInstance]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should return a user from login', async () => {
      const expectedUser = {username: 'some username'};
      const req = {
        user: expectedUser
      };
      const actualValue = await appController.login(req);
      expect(actualValue).toEqual(expectedUser);
    });
  });
});
