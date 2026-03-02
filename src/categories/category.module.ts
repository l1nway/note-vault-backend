import {CategoriesController} from './categories.controller'
import {CategoriesService} from './categories.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Category} from './category.entity'
import {Module} from '@nestjs/common'

@Module({
  imports: [
    TypeOrmModule.forFeature([Category])
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}