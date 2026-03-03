import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {ConfigService} from '@nestjs/config'
import {Injectable} from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {

    const secret = configService.get<string>('JWT_SECRET')

    if (!secret) {throw new Error('JWT_SECRET is not defined in .env file')}

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  async validate(payload: any) {
    return {id: payload.sub, email: payload.email}
  }
}