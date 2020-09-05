jest.mock('./document.service');
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './entity/document';

describe('Document Controller', () => {
  let service: DocumentService;
  let controller: DocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [DocumentService]
    }).compile();
    service = module.get<DocumentService>(DocumentService);
    controller = module.get<DocumentController>(DocumentController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find a document by id', async () => {
    // prepare the return promise from DocumentService.findOne()
    const expectedDocument: Document = new Document(100, 100, 'The  document');
    const expectedPromise = Promise.resolve(expectedDocument);

    // mock Oso's authorize function
    const authorize = jest.fn();

    // mock param to have the document id
    const param = {id: expectedDocument.id.toString()};

    // mock service.findOne()
    const mockFindOne = jest.spyOn(service, 'findOne');
    // set the expected return promise from  service.findOne()
    mockFindOne.mockReturnValueOnce(expectedPromise);

    // call the function under test
    const actualPromise = controller.findOne(param, authorize);

    // wait for the promise to resolve
    const actualDocument = await actualPromise;

    // expect service.findOne to have been called
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith(Number.parseInt(param.id));
    // ensure authorize was called
    expect(authorize).toHaveBeenCalledTimes(1);
    expect(actualPromise).toEqual(expectedPromise);
    expect(actualDocument).toEqual(expectedDocument.document);
  });
});
