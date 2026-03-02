import {UsersController, ProfileController} from './users.controller'
import {TypeOrmModule} from '@nestjs/typeorm'
import {UsersService} from './users.service'
import {User} from './entities/user.entity'
import {Module} from '@nestjs/common'

@Module({
  controllers: [UsersController, ProfileController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}