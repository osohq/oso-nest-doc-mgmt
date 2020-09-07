import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DocumentModule } from '../src/document/document.module';

describe('DocumentController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DocumentModule],

    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/document (GET)', () => {
    return request(app.getHttpServer())
      .get('/document')
      .expect(200);
  });
});