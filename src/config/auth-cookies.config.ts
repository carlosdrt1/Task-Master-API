import { CookieOptions } from 'express';

export const authCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60,
};
