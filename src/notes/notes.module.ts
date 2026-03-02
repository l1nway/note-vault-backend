import {NotesController} from './notes.controller'
import {TypeOrmModule} from '@nestjs/typeorm'
import {NotesService} from './notes.service'
import {Module} from '@nestjs/common'
import {Note} from './note.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Note])
  ],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}