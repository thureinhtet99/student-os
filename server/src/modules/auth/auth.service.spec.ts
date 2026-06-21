import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

// Tests for AuthService are skipped until the Better Auth library's ESM output
// can be loaded by Jest (ts-jest currently can't parse `dist/index.mjs`).
describe.skip('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
