import { ClassesController } from './classes.controller';

describe('ClassesController', () => {
  let controller: ClassesController;

  beforeEach(() => {
    controller = new ClassesController({} as any);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
