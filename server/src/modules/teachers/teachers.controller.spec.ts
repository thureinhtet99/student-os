import { TeachersController } from './teachers.controller';

describe('TeachersController', () => {
  let controller: TeachersController;
  let service: any;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new TeachersController(service);
  });

  it('delegates create to the teachers service', async () => {
    const dto = {
      name: 'Daw Mya',
      email: 'mya@example.com',
      password: 'secret123',
      phone: null,
      address: null,
      dateOfBirth: null,
      gender: 'FEMALE' as const,
      image: null,
    };
    const response = { id: 'teacher-1' };
    service.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toBe(response);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('delegates list and item operations', async () => {
    const query = { search: 'mya', page: 1, limit: 10 };
    service.findAll.mockResolvedValue({ data: [], meta: {} });
    service.findOne.mockResolvedValue({ id: 'teacher-1' });
    service.update.mockResolvedValue({ id: 'teacher-1' });
    service.remove.mockResolvedValue({ message: 'Teacher deleted successfully' });

    await controller.findAll(query);
    await controller.findOne('teacher-1');
    await controller.update('teacher-1', { name: 'Daw Mya Updated' });
    await controller.remove('teacher-1');

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(service.findOne).toHaveBeenCalledWith('teacher-1');
    expect(service.update).toHaveBeenCalledWith('teacher-1', {
      name: 'Daw Mya Updated',
    });
    expect(service.remove).toHaveBeenCalledWith('teacher-1');
  });
});
