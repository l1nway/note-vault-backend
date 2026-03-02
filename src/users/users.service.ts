import {InjectRepository} from '@nestjs/typeorm'
import {User} from './entities/user.entity'
import {BadRequestException, Injectable} from '@nestjs/common'
import {Repository} from 'typeorm'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  [x: string]: any
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData)
    const savedUser = await this.usersRepository.save(user)
    return savedUser
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({where: {email}})
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({where: {id}})
  }

  async updateName(id: number, newName: string) {
    await this.usersRepository.update(id, {name: newName})
    return this.findOneById(id)
  }

  async updateProfile(id: number, updateData: Partial<User>): Promise<User | null> {
    await this.usersRepository.update(id, updateData)
    return this.findOneById(id)
  }

  async changePassword(userId: number, changePasswordDto: any): Promise<boolean> {
    const {current_password, password, password_confirmation} = changePasswordDto

    if (password !== password_confirmation) {
      throw new BadRequestException('Passwords do not match')
    }

    const user = await this.findOneById(userId)
    if (!user) throw new BadRequestException('User not found')

    const isMatch = await bcrypt.compare(current_password, user.password)
    if (!isMatch) {
      throw new BadRequestException('Invalid current password')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await this.usersRepository.update(userId, {password: hashedPassword})
    
    return true
  }
}