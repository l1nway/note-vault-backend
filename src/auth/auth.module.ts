import {ConfigModule, ConfigService} from '@nestjs/config'
import {JwtStrategy} from './strategies/jwt.strategy'
import {UsersModule} from '../users/users.module'
import {AuthController} from './auth.controller'
import {PassportModule} from '@nestjs/passport'
import {AuthService} from './auth.service'
import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'DEV_SECRET', 
        signOptions: {expiresIn: '1d'},
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}