import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from 'typeorm'
import {Note} from 'src/notes/note.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({unique: true})
  email: string

  @Column()
  password: string

  @Column({nullable: true, name: 'avatar_url'})
  avatar_url: string

  @Column({type: 'timestamp', nullable: true, name: 'email_verified_at'})
  email_verified_at: Date

  @CreateDateColumn({name: 'created_at'})
  created_at: Date

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[]
  
  @Column({default: 'en', length: 5})
  language: string
}