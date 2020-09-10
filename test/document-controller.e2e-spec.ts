import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getLogger } from 'log4js';
import * as request from 'supertest';
import { DocumentModule } from '../src/document/document.module';
import { configApp } from '../src/main';

getLogger().level = 'info';
const logger = getLogger('DocumentController e2e');

describe('DocumentController (e2e)', () => {
  let app: INestApplication;
  let server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DocumentModule],

    }).compile();

    app = moduleFixture.createNestApplication();
    configApp(app);
    await app.init();
    server = app.getHttpServer();
  });

  it('/document (GET) as guest', () => {
    return request(server).get('/document')
      .expect(200)
      .then(res => {
        const documents = res.body.documents;
        expect(documents).toBeDefined();
        expect(documents.length).toBeGreaterThan(0);
      });
  });

  it('/document/:id GET as guest', () => {
    return request(server).get('/document/1')
      .send({username: 'john', password: 'changeme'})
      .expect(200)
      .then(res => {
        const document = res.body.document;
        expect(document).toBeDefined();
      });
  });
});