import { Injectable } from '@nestjs/common';
import { Resource } from './oso/oso.guard';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!\n';
  }
}
