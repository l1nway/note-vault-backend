import {CategoriesModule} from './categories/category.module'
import {ConfigModule, ConfigService} from '@nestjs/config'
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
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Note, Category, Tag],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        ssl: {rejectUnauthorized: false},
      }),
    }),
    CategoriesModule,
    NotesModule,
    UsersModule,
    TagModule,
    AuthModule,
  ],
})
export class AppModule {}