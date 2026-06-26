import { ResultsController } from './results.controller';

describe('ResultsController', () => {
  let controller: ResultsController;
  let service: any;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new ResultsController(service);
  });

  it('delegates create to the results service', async () => {
    const dto = {
      score: 92,
      comment: null,
      exam_id: 'exam-1',
      assignment_id: 'assignment-1',
      student_id: 'student-1',
    };
    const response = { id: 'result-1' };
    service.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toBe(response);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('delegates list and item operations', async () => {
    const query = { student_id: 'student-1', page: 1, limit: 10 };
    service.findAll.mockResolvedValue({ data: [], meta: {} });
    service.findOne.mockResolvedValue({ id: 'result-1' });
    service.update.mockResolvedValue({ id: 'result-1' });
    service.remove.mockResolvedValue({ message: 'Result deleted successfully' });

    await controller.findAll(query);
    await controller.findOne('result-1');
    await controller.update('result-1', { score: 95 });
    await controller.remove('result-1');

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(service.findOne).toHaveBeenCalledWith('result-1');
    expect(service.update).toHaveBeenCalledWith('result-1', { score: 95 });
    expect(service.remove).toHaveBeenCalledWith('result-1');
  });
});
