import {Controller, UseGuards, Post, Body, Get, Query, Patch, Param, Delete, Request} from '@nestjs/common'
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard'
import {NotesService} from './notes.service'

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
    create(@Body() dto: any, @Request() req) {
      return this.notesService.create(dto, req.user)
    }

  @Get()
    findAll(@Query() query: any, @Request() req) {
      return this.notesService.findAll(req.user, query)
    }

  @Patch(':id')
    update(@Param('id') id: string, @Body() dto: any, @Request() req) {
      return this.notesService.update(+id, req.user.id, dto)
    }

  @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
      return this.notesService.update(+id, req.user.id, {isDeleted: true, isArchived: false})
    }
    @Patch(':id/restore')
    restore(@Param('id') id: string, @Request() req) {
      return this.notesService.update(+id, req.user.id, {isDeleted: false})
    }

  @Delete(':id/permanent')
    forceRemove(@Param('id') id: string, @Request() req) {
      return this.notesService.removePermanently(+id, req.user.id)
    }

  @Patch(':id/archive')
    archive(@Param('id') id: string, @Request() req) {
      return this.notesService.update(+id, req.user.id, {isArchived: true, isDeleted: false})
    }

  @Patch(':id/unarchive')
    unarchive(@Param('id') id: string, @Request() req) {
      return this.notesService.update(+id, req.user.id, {isArchived: false})
    }

  @Get(':id')
    async getNote(@Param('id') id: string, @Request() req) {
      return this.notesService.findOne(+id, req.user.id)
    }
}