import {TagsController} from './tag.controller'
import {TypeOrmModule} from '@nestjs/typeorm'
import {TagsService} from './tags.service'
import {Module} from '@nestjs/common'
import {Tag} from './tag.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag])
  ],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagModule {}