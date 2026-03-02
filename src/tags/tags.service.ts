import {User} from '../users/entities/user.entity'
import {InjectRepository} from '@nestjs/typeorm'
import {Injectable} from '@nestjs/common'
import {Repository} from 'typeorm'
import {Tag} from './tag.entity'

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  create(name: string, user: User) {
    const tag = new Tag()
    tag.name = name
    tag.user = user
    return this.tagRepository.save(tag)
  }

  findAll(user: User) {
    return this.tagRepository.find({
      where: {user: {id: user.id}},
      order: {name: 'ASC'}
    })
  }

  async remove(id: number, userId: number) {
    return await this.tagRepository.delete({id, user: {id: userId}})
  }
}