import { GoogleOauthGuard } from '../guards/google-oauth.guard';

describe('SomeGuard', () => {
  it('should be defined', () => {
    expect(new GoogleOauthGuard()).toBeDefined();
  });
});
