import { Controller, Get} from '@nestjs/common';
import { AppService } from './app.service';
import { UseGuards } from '@nestjs/common';
import { OsoGuard, Action, Resource } from './oso/oso.guard';

@Controller()
@UseGuards(OsoGuard)
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
