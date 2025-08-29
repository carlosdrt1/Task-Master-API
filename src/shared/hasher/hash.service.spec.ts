import { HashService } from './hash.service';

describe('HashService', () => {
  let hashService: HashService;

  beforeEach(() => {
    hashService = new HashService();
  });

  describe('hash', () => {
    it('Should hash the password successfully', async () => {
      const password = 'test-password';

      const hashed = await hashService.hash(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
    });
  });

  describe('verify', () => {
    it('Should verify the password successfully', async () => {
      const password = 'test-password';
      const hashed = await hashService.hash(password);

      const isValid = await hashService.verify(hashed, password);

      expect(isValid).toBe(true);
    });

    it('Should fail if the password is incorrect', async () => {
      const password = 'test-password';
      const hashed = await hashService.hash(password);

      const isValid = await hashService.verify(hashed, 'wrong-password');

      expect(isValid).toBe(false);
    });
  });
});
