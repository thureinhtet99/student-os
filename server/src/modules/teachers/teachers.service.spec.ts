import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { TeachersService } from './teachers.service.js';

describe('TeachersService', () => {
  let service: TeachersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: CloudinaryService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TeachersService>(TeachersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
