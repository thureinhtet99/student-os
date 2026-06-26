import { StudentsController } from './students.controller';

describe('StudentsController', () => {
  let controller: StudentsController;

  beforeEach(() => {
    controller = new StudentsController({} as any);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
