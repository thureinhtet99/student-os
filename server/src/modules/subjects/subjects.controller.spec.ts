import { SubjectsController } from './subjects.controller';

describe('SubjectsController', () => {
  let controller: SubjectsController;
  let service: any;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new SubjectsController(service);
  });

  it('delegates create to the subjects service', async () => {
    const dto = { name: 'Mathematics', description: null, classId: null };
    const response = { id: 'subject-1' };
    service.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toBe(response);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('delegates list queries to the subjects service', async () => {
    const query = { search: 'math', page: 1, limit: 10 };
    const response = { data: [], meta: {} };
    service.findAll.mockResolvedValue(response);

    await expect(controller.findAll(query)).resolves.toBe(response);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('delegates read, update, and delete operations', async () => {
    service.findOne.mockResolvedValue({ id: 'subject-1' });
    service.update.mockResolvedValue({ id: 'subject-1', name: 'Science' });
    service.remove.mockResolvedValue({ message: 'Subject deleted successfully' });

    await controller.findOne('subject-1');
    await controller.update('subject-1', { name: 'Science' });
    await controller.remove('subject-1');

    expect(service.findOne).toHaveBeenCalledWith('subject-1');
    expect(service.update).toHaveBeenCalledWith('subject-1', {
      name: 'Science',
    });
    expect(service.remove).toHaveBeenCalledWith('subject-1');
  });
});
