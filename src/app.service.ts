import { Injectable } from '@nestjs/common';
import { Resource } from './oso/oso.guard';

@Injectable()
export class AppService {
  @Resource('hello_world')
  getHello(): string {
    return 'Hello World!';
  }
}
