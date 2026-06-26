import { ParentsService } from './parents.service';

describe('ParentsService', () => {
  let service: ParentsService;

  beforeEach(() => {
    service = new ParentsService({} as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
