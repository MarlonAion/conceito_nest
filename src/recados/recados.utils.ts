import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadoUtils {
  invertString(str: string) {
    return str.split('').reverse().join('');
  }
}

@Injectable()
export class RecadoUtilsMock {
  invertString() {
    return 'mock';
  }
}
