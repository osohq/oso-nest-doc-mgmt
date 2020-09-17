import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';

describe(ProjectService.name, () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create a new project and find it by id', () => {
    const ownerId = 1;
    const projectId = service.create(1);
    expect(projectId).toBeDefined();
    expect(projectId).toBeGreaterThan(0);

    const project = service.findOne(projectId);
    expect(project).toBeDefined();
    expect(project.id).toEqual(projectId);
    expect(project.ownerId).toEqual(ownerId);
    expect(project.getMembers()).toContain(ownerId);
  });

  it('should be able to add new members to a project', () => {
    const ownerId = 1;
    const expectedUserId = 100;
    const projectId = service.create(1);

    service.addMember(projectId, expectedUserId);
    const project = service.findOne(projectId);
    expect(project.getMembers()).toContain(ownerId);
    expect(project.getMembers()).toContain(expectedUserId);
  });

});