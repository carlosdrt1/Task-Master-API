import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  async hash(text: string): Promise<string> {
    return argon2.hash(text, {
      type: argon2.argon2id,
    });
  }

  async verify(hash: string, text: string): Promise<boolean> {
    return argon2.verify(hash, text);
  }
}
