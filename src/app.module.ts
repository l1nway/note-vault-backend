import {CategoriesModule} from './categories/category.module'
import {Category} from './categories/category.entity'
import {User} from './users/entities/user.entity'
import {UsersModule} from './users/users.module'
import {NotesModule} from './notes/notes.module'
import {AuthModule} from './auth/auth.module'
import {TypeOrmModule} from '@nestjs/typeorm'
import {TagModule} from './tags/tag.module'
import {Note} from './notes/note.entity'
import {Tag} from './tags/tag.entity'
import {Module} from '@nestjs/common'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'notevault',
      entities: [User, Note, Category, Tag],
      synchronize: true,
    }),
    CategoriesModule,
    NotesModule,
    UsersModule,
    TagModule,
    AuthModule,
  ],
})
export class AppModule {}