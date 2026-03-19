import {Injectable, NotFoundException} from '@nestjs/common'
import {User} from 'src/users/entities/user.entity'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {Note} from './note.entity'

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async findOne(id: number, userId: number) {
    const note = await this.notesRepository.findOne({
      where: {id, user: {id: userId}},
      relations: ['category', 'tags'],
    })

    if (!note) throw new NotFoundException('Note not found')
    return note
  }

  async create(dto: any, user: User) {
    const {name, title, content, markdown, isMarkdown, categoryId, tagIds} = dto
    
    const note = this.notesRepository.create({
      title: name || title,
      content: content,
      isMarkdown: markdown ?? isMarkdown ?? false,
      user,
      category: categoryId ? {id: Number(categoryId)} : undefined,
      tags: Array.isArray(tagIds) ? tagIds.map(id => ({id})) : []
    })
    
    const savedNote = await this.notesRepository.save(note)
    return this.findOne(savedNote.id, user.id)
  }

  async update(id: number, userId: number, dto: any) {
    const note = await this.findOne(id, userId)

    if (dto.name !== undefined || dto.title !== undefined) {
      note.title = dto.name ?? dto.title
    }
    if (dto.content !== undefined) note.content = dto.content
    if (dto.markdown !== undefined || dto.isMarkdown !== undefined) {
      note.isMarkdown = dto.markdown ?? dto.isMarkdown
    }

    if (dto.isArchived !== undefined) {
      note.isArchived = dto.isArchived
    }

    if (dto.isDeleted !== undefined) {
      note.isDeleted = dto.isDeleted
    }

    if (dto.categoryId !== undefined) {
      note.category = dto.categoryId ? {id: Number(dto.categoryId)} as any : null
    }
    note.updatedAt = new Date()
    await this.notesRepository.save(note)

    if (dto.tagIds !== undefined) {
      await this.notesRepository
        .createQueryBuilder()
        .relation(Note, 'tags')
        .of(note)
        .addAndRemove(
          dto.tagIds.map(id => ({id})),
          note.tags ?? []
        )
    }

    return this.findOne(id, userId)
  }

  async findAll(user: User, query: any) {
    const {category_id, tag_id, q, page = 1, isDeleted, isArchived} = query
    const limit = 20
    const skip = (page - 1) * limit

    const queryBuilder = this.notesRepository.createQueryBuilder('note')
      .leftJoinAndSelect('note.category', 'category')
      .leftJoinAndSelect('note.tags', 'tags')
      .where('note.userId = :userId', {userId: user.id})

    if (isDeleted !== undefined) {
      const deletedVal = String(isDeleted) === 'true'
      queryBuilder.andWhere('note.isDeleted = :isDeleted', {isDeleted: deletedVal})
    } else {
      queryBuilder.andWhere('note.isDeleted = :isDeleted', {isDeleted: false})
    }

    if (isArchived !== undefined) {
      const archivedVal = String(isArchived) === 'true';
      queryBuilder.andWhere('note.isArchived = :isArchived', {isArchived: archivedVal})
    } else {
      queryBuilder.andWhere('note.isArchived = :isArchived', {isArchived: false})
    }

    if (q) {
      queryBuilder.andWhere('(note.title LIKE :q OR note.content LIKE :q)', {q: `%${q}%`})
    }

    if (category_id) {
      queryBuilder.andWhere('category.id = :category_id', {category_id})
    }

    if (tag_id) {
      queryBuilder.andWhere('tags.id = :tag_id', {tag_id})
    }

    const [data, total] = await queryBuilder
      .orderBy('note.createdAt', 'DESC')
      .take(limit)
      .skip(skip)
      .getManyAndCount()

    return {data, total, last_page: Math.ceil(total / limit)}
  }

  async removePermanently(id: number, userId: number) {
    return await this.notesRepository.delete({id, user: {id: userId}})
  }
}