import { HashingService } from './hashing.service';

export class BcryptService extends HashingService {
  async hash(password: string): Promise<string> {
    return '';
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return true;
  }
}
