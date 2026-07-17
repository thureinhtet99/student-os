import { Test, TestingModule } from '@nestjs/testing';
import { TeachersController } from './teachers.controller.js';
import { TeachersService } from './teachers.service.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import { QueryTeacherDto } from './dto/query-teacher-dto.js';

describe('TeachersController', () => {
  let controller: TeachersController;

  const mockTeachersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersController],
      providers: [
        {
          provide: TeachersService,
          useValue: mockTeachersService,
        },
      ],
    }).compile();

    controller = module.get<TeachersController>(TeachersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service create method', async () => {
      const dto = new CreateTeacherDto();
      await controller.create(dto);
      expect(mockTeachersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call the service findAll method', async () => {
      const query = new QueryTeacherDto();
      await controller.findAll(query);
      expect(mockTeachersService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method', async () => {
      const id = 'some-id';
      await controller.findOne(id);
      expect(mockTeachersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call the service update method', async () => {
      const id = 'some-id';
      const dto = new UpdateTeacherDto();
      await controller.update(id, dto);
      expect(mockTeachersService.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call the service remove method', async () => {
      const id = 'some-id';
      await controller.remove(id);
      expect(mockTeachersService.remove).toHaveBeenCalledWith(id);
    });
  });
});
