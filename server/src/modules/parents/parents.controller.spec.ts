import { ParentsController } from './parents.controller';

describe('ParentsController', () => {
  let controller: ParentsController;

  beforeEach(() => {
    controller = new ParentsController({} as any);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
