jest.mock('./document.service');
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/document.dto';
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
    // mock Oso's authorize function
    const authorize = jest.fn();

    // mock param to have the document id
    const param = {id: expectedDocument.id.toString()};

    // mock service.findOne()
    const mockFindOne = jest.spyOn(service, 'findOne');
    // set the expected return promise from  service.findOne()
    mockFindOne.mockReturnValueOnce(Promise.resolve(expectedDocument));

    // call the function under test
    const actualDocument: string = await controller.findOne(param, authorize);

    // expect service.findOne to have been called
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith(Number.parseInt(param.id));
    // ensure authorize was called
    expect(authorize).toHaveBeenCalledTimes(1);
    expect(actualDocument).toEqual(expectedDocument.document);
  });

  it('should return undefined when findOne does not find a document', async () => {
    const mockFindOne = jest.spyOn(service, 'findOne');
    const empty: Document = undefined;
    mockFindOne.mockReturnValueOnce(Promise.resolve(empty));

    const authorize = jest.fn();
    const param = {id: '100'};
    const expectedReturnValue = await controller.findOne(param, authorize);
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith(Number.parseInt(param.id));
    expect(authorize).toHaveBeenCalledTimes(1);
    expect(authorize).toHaveBeenCalledWith(empty);
    expect(expectedReturnValue).toEqual(empty);
  });

  it('should find all documents', async () => {
    const expectedDocuments: Document[] = [
      new Document(100, 100, 'First document'),
      new Document(100, 100, 'Second document')
    ];
    const mockFindAll = jest.spyOn(service, 'findAll');
    mockFindAll.mockReturnValueOnce(Promise.resolve(expectedDocuments));

    // call the function under test
    const actualDocuments: string[] = await controller.findAll();

    // expect service.findAll to have been called
    expect(mockFindAll).toHaveBeenCalledTimes(1);
    // TODO: Add authorize() and test for call: https://github.com/oletizi/oso-nest-demo/issues/13

    expect(actualDocuments).toEqual(expectedDocuments.map((document) => document.document));
  });

  it('should create a document', async () => {
    const expectedId = 100;
    const mockCreate = jest.spyOn(service, 'create');
    mockCreate.mockReturnValueOnce(Promise.resolve(expectedId));
    const doc = new CreateDocumentDto(100, 'new document');
    const id: number = await controller.create(doc);
    // DocumentService.create() should have been called with the document base id and document fields
    expect(mockCreate).toHaveBeenCalledWith(doc.baseId, doc.document);
    expect(id).toEqual(expectedId);
  });
});
