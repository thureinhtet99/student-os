import { AttendancesController } from './attendances.controller';

describe('AttendancesController', () => {
  let controller: AttendancesController;
  let service: any;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new AttendancesController(service);
  });

  it('delegates create to the attendances service', async () => {
    const dto = {
      present: true,
      date: '2026-01-01T00:00:00.000Z',
      student_id: 'student-1',
    };
    const response = { id: 'attendance-1' };
    service.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toBe(response);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('delegates list and item operations', async () => {
    const query = { student_id: 'student-1', present: true };
    service.findAll.mockResolvedValue({ data: [], meta: {} });
    service.findOne.mockResolvedValue({ id: 'attendance-1' });
    service.update.mockResolvedValue({ id: 'attendance-1' });
    service.remove.mockResolvedValue({
      message: 'Attendance deleted successfully',
    });

    await controller.findAll(query);
    await controller.findOne('attendance-1');
    await controller.update('attendance-1', { present: false });
    await controller.remove('attendance-1');

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(service.findOne).toHaveBeenCalledWith('attendance-1');
    expect(service.update).toHaveBeenCalledWith('attendance-1', {
      present: false,
    });
    expect(service.remove).toHaveBeenCalledWith('attendance-1');
  });
});
