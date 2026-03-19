import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinTable, ManyToMany} from 'typeorm'
import {Category} from 'src/categories/category.entity'
import {User} from 'src/users/entities/user.entity'
import {Tag} from 'src/tags/tag.entity'

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({type: 'text'})
  content: string

  @Column({default: false})
  isArchived: boolean

  @Column({default: false})
  isDeleted: boolean

  @Column({default: false})
  isMarkdown: boolean

  @CreateDateColumn()
  createdAt: Date

  @Column({ 
    type: 'timestamp', 
    nullable: true, 
    default: null 
  })
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.notes)
  user: User

  @ManyToOne(() => Category, (category) => category.notes, {nullable: true})
  category: Category

  @ManyToMany(() => Tag, (tag) => tag.notes)
  @JoinTable()
  tags: Tag[]
}