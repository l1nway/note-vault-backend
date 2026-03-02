import {Controller, Get, Post, Body, Param, Delete, UseGuards, Request} from '@nestjs/common'
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard'
import {TagsService} from './tags.service'

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body('name') name: string, @Request() req) {
    return this.tagsService.create(name, req.user)
  }

  @Get()
  findAll(@Request() req) {
    return this.tagsService.findAll(req.user)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tagsService.remove(+id, req.user.id)
  }
}