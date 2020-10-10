import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { BasicAuthGuard } from './basic-auth.guard';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy, BasicAuthGuard],
  exports: [AuthService, LocalStrategy, BasicAuthGuard]
})
export class AuthModule {
}
