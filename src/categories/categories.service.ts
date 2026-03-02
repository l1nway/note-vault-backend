import {User} from '../users/entities/user.entity'
import {InjectRepository} from '@nestjs/typeorm'
import {Category} from './category.entity'
import {Injectable} from '@nestjs/common'
import {Repository} from 'typeorm'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(name: string, user: User, color: string) {
    const category = new Category()
    category.name = name
    category.user = user
    category.color = color
    return this.categoryRepository.save(category)
  }

  findAll(user: User) {
    return this.categoryRepository.find({
      where: {user: {id: user.id}},
      order: {name: 'ASC'}
    })
  }

  async remove(id: number, userId: number) {
    return await this.categoryRepository.delete({id, user: {id: userId}})
  }
}