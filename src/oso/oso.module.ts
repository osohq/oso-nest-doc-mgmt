import { Module } from '@nestjs/common';
import { OsoInstance } from './oso-instance';
import { OsoGuard } from './oso.guard';

@Module({
  providers: [OsoGuard, OsoInstance],
  exports: [OsoGuard, OsoInstance]
})
export class OsoModule {
}
