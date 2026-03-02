import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany} from 'typeorm'
import {User} from '../users/entities/user.entity'
import {Note} from '../notes/note.entity'

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => User)
  user: User

  @ManyToMany(() => Note, (note) => note.tags)
  notes: Note[]
}