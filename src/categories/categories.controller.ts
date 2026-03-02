import {Controller, Get, Post, Body, Param, Delete, UseGuards, Request} from '@nestjs/common'
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard'
import {CategoriesService} from './categories.service'

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post() create(
      @Body('name') name: string,
      @Body('color') color: string,
      @Request() req,
    ) {
      return this.categoriesService.create(name, req.user, color)
    }

  @Get()
  findAll(@Request() req) {
    return this.categoriesService.findAll(req.user)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.categoriesService.remove(+id, req.user.id)
  }
}