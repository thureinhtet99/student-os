import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student-dto';

describe('StudentsController', () => {
  let controller: StudentsController;

  const mockStudentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service create method', async () => {
      const dto = new CreateStudentDto();
      await controller.create(dto);
      expect(mockStudentsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call the service findAll method', async () => {
      const query = new QueryStudentDto();
      await controller.findAll(query);
      expect(mockStudentsService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method', async () => {
      const id = 'some-id';
      await controller.findOne(id);
      expect(mockStudentsService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call the service update method', async () => {
      const id = 'some-id';
      const dto = new UpdateStudentDto();
      await controller.update(id, dto);
      expect(mockStudentsService.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call the service remove method', async () => {
      const id = 'some-id';
      await controller.remove(id);
      expect(mockStudentsService.remove).toHaveBeenCalledWith(id);
    });
  });
});
