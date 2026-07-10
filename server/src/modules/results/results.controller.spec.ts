// import { Test, TestingModule } from '@nestjs/testing';
// import { ResultsController } from './results.controller';
// import { ResultsService } from './results.service';

// describe('ResultsController', () => {
//   let controller: ResultsController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ResultsController],
//       providers: [
//         {
//           provide: ResultsService,
//           useValue: {
//             create: jest.fn(),
//             findAll: jest.fn(),
//             findOne: jest.fn(),
//             update: jest.fn(),
//             remove: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<ResultsController>(ResultsController);
//   });
//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
