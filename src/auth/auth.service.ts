import {Injectable, BadRequestException} from '@nestjs/common'
import {UsersService} from '../users/users.service'
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email)
    
    if (user && await bcrypt.compare(pass, user.password)) {
      const {password, ...result} = user
      return result
    }
    return null
  }

  async register(dto: any) {
    if (dto.password !== dto.password_confirmation) {
      throw new BadRequestException(`Passwords don't match`)
    }

    const candidate = await this.usersService.findOneByEmail(dto.email)
    if (candidate) {
      throw new BadRequestException('User with this email already exists.')
    }

    const salt = await bcrypt.genSalt()
    console.log(salt)
    console.log(dto)
    const hashedPassword = await bcrypt.hash(dto.password, salt)

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    })

    return this.login(user)
  }

  async login(user: any) {
    const payload = {email: user.email, sub: user.id}
    return {
      token: this.jwtService.sign(payload),
      user: {
        name: user.name,
        email: user.email,
        email_verified_at: user.email_verified_at || null,
        created_at: user.created_at,
        avatar_url: user.avatar_url || null,
      },
    }
  }
}