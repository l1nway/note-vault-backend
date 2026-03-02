import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm'
import {User} from '../users/entities/user.entity'
import {Note} from '../notes/note.entity'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  color: string

  @ManyToOne(() => User)
  user: User

  @OneToMany(() => Note, (note) => note.category)
  notes: Note[]
}