import { ExamsController } from './exams.controller';

describe('ExamsController', () => {
  let controller: ExamsController;
  let service: any;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new ExamsController(service);
  });

  it('delegates create to the exams service', async () => {
    const dto = {
      name: 'Midterm',
      description: null,
      startTime: '2026-01-01T09:00:00.000Z',
      endTime: '2026-01-01T11:00:00.000Z',
      subject_id: 'subject-1',
    };
    const response = { id: 'exam-1' };
    service.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toBe(response);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('delegates list and item operations', async () => {
    const query = { search: 'mid', page: 1, limit: 10 };
    service.findAll.mockResolvedValue({ data: [], meta: {} });
    service.findOne.mockResolvedValue({ id: 'exam-1' });
    service.update.mockResolvedValue({ id: 'exam-1' });
    service.remove.mockResolvedValue({ message: 'Exam deleted successfully' });

    await controller.findAll(query);
    await controller.findOne('exam-1');
    await controller.update('exam-1', { name: 'Final' });
    await controller.remove('exam-1');

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(service.findOne).toHaveBeenCalledWith('exam-1');
    expect(service.update).toHaveBeenCalledWith('exam-1', { name: 'Final' });
    expect(service.remove).toHaveBeenCalledWith('exam-1');
  });
});
