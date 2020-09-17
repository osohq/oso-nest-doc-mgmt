jest.mock('./document.service');
import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { doc } from 'prettier';
import { OsoInstance } from '../oso/oso-instance';
import { OsoGuard } from '../oso/oso.guard';
import { OsoModule } from '../oso/oso.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CreateDocumentDto, DocumentSetDto, FindDocumentDto } from './dto/document.dto';
import { Document } from './entity/document';
import { mock } from 'jest-mock-extended';
import { User } from 'src/users/entity/user';
import { Project } from 'src/project/project.service';

describe('Document Controller', () => {
  let service: DocumentService;
  let controller: DocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OsoModule],
      controllers: [DocumentController],
      providers: [DocumentService, OsoGuard],
      exports: [OsoModule]
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
    const expectedOwner = mock<User>();
    const expectedProject = mock<Project>();
    const expectedDocument: Document = new Document(100, expectedOwner, expectedProject, 'The  document', false, false);
    // mock Oso's authorize function
    const mockAuthorize = jest.fn();

    // mock param to have the document id
    const param = {id: expectedDocument.id.toString()};

    // mock service.findOne()
    const mockFindOne = jest.spyOn(service, 'findOne');
    // set the expected return promise from  service.findOne()
    mockFindOne.mockReturnValueOnce(Promise.resolve(expectedDocument));

    // call the function under test
    const actualDocument: string = await controller.findOne(param, mockAuthorize);

    // expect service.findOne to have been called
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith(Number.parseInt(param.id));
    // ensure authorize was called
    expect(mockAuthorize).toHaveBeenCalledTimes(1);
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

  it('should find and validate access to all documents', async () => {
    const expectedProject: Project = mock<Project>();
    const expectedOwner: User = mock<User>();
    const expectedDocuments: Document[] = [
      new Document(100, expectedOwner, expectedProject, 'First document', false, false),
      new Document(100, expectedOwner, expectedProject, 'Second document', false, false)
    ];
    const authorize = jest.fn();
    const mockFindAll = jest.spyOn(service, 'findAll');
    mockFindAll.mockReturnValue(Promise.resolve(expectedDocuments));

    // call the function under test
    const actualDocuments: DocumentSetDto = await controller.findAll(authorize);

    // expect service.findAll to have been called
    expect(mockFindAll).toHaveBeenCalledTimes(1);
    // TODO: Add authorize() and test for call: https://github.com/oletizi/oso-nest-demo/issues/13
    // expect authorize() function to have been called on each document
    expect(authorize).toHaveBeenCalledTimes(expectedDocuments.length);
    expectedDocuments.map((document) => expect(authorize).toHaveBeenCalledWith(document));

    // expect the return value to equal an appropriate document set
    expect(actualDocuments).toEqual(new DocumentSetDto(expectedDocuments));
  });

  it('should find all documents and filter access to unauthorized documents', async () => {
    const expectedUser: User = mock<User>();
    const expectedProject: Project = mock<Project>();
    const allDocuments: Document[] = [
      new Document(1, expectedUser, expectedProject, 'some content', true, true),
      new Document(2, expectedUser, expectedProject, 'some other content', true, true)
    ];
    const mockFindAll = jest.spyOn(service, 'findAll');
    const mockAuthorize = jest.fn();

    mockFindAll.mockReturnValue(Promise.resolve(allDocuments));
    mockAuthorize.mockImplementation((document) => {
      if (document.id === 1) {
        throw new UnauthorizedException();
      }
    });

    // call method under test
    const actualDocuments = await controller.findAll(mockAuthorize);

    // ensure all documents were checked for authorization
    allDocuments.map((document) => expect(mockAuthorize).toHaveBeenCalledWith(document));

    // ensure the unauthorized documents were filtered
    expect(actualDocuments.documents.length).toEqual(allDocuments.length - 1);
  });

  it('should create a document', async () => {
    const expectedId = 100;
    const mockCreate = jest.spyOn(service, 'create');
    mockCreate.mockReturnValueOnce(Promise.resolve(expectedId));
    const doc = new CreateDocumentDto();
    doc.document = 'new document';
    doc.allowsDocumentComment = true;
    doc.allowsInlineComment = true;
    const request = {
      user: {id: 1}
    };
    const id: number = await controller.create(request, doc);
    // DocumentService.create() should have been called with the document DTO
    expect(mockCreate).toHaveBeenCalledWith(doc);
    // it should have populated the baseId of the document with user.id
    expect(doc.projectId).toEqual(request.user.id);
    expect(id).toEqual(expectedId);
  });
});
