import {Post, UseInterceptors, UploadedFile, BadRequestException, Delete} from '@nestjs/common'
import {FileInterceptor} from '@nestjs/platform-express'
import {diskStorage} from 'multer'
import sizeOf from 'image-size'
import {extname} from 'path'
import * as fs from 'fs'

import {Controller, Get, UseGuards, Request, Patch, Body} from '@nestjs/common'
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard'
import {UsersService} from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: any) {
    const userId = req.user.id || req.user.userId
    await this.usersService.changePassword(userId, changePasswordDto)
    return {message: 'Password changed successfully'}
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const userId = req.user.id || req.user.userId
    
    const fullUser = await this.usersService.findOneById(userId)
    
    if (!fullUser) {return {error: 'User not found'}}

    const {password, ...result} = fullUser
    return result
  }
}

@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('avatar')
  async deleteAvatar(@Request() req) {
    const userId = req.user.id || req.user.userId
    const user = await this.usersService.findOneById(userId)

    if (!user) {throw new BadRequestException('User not found')}

    if (user && user.avatar_url) {
      const filePath = `.${user.avatar_url}`

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      } catch (err) {
        console.error('Error deleting avatar file:', err)
      }

      await this.usersService.updateProfile(userId, {avatar_url: 'null'})
    }

    return {message: 'Avatar deleted successfully'}
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateProfile(@Request() req, @Body() updateData: {name?: string; language?: string}) {
    const userId = req.user.id || req.user.userId
    
    const allowedLanguages = ['ru', 'en', 'pl', 'ua']
    if (updateData.language && !allowedLanguages.includes(updateData.language)) {
      return {error: 'Invalid language code'}
    }

    const updatedUser = await this.usersService.updateProfile(userId, updateData)
    
    if (!updatedUser) return {error: 'User not found'}

    const {password, ...result} = updatedUser
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`)
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
        return cb(new BadRequestException('Only JPG/JPEG files are allowed'), false)
      }
      cb(null, true)
    },
  }))

  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required')

    try {
      const fileBuffer = fs.readFileSync(file.path)
      const dimensions = sizeOf(fileBuffer)
      
      if (!dimensions || !dimensions.width || !dimensions.height || dimensions.width > 512 || dimensions.height > 512) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
        throw new BadRequestException('Image resolution must not exceed 512x512')
      }

      const userId = req.user.id || req.user.userId
      const user = await this.usersService.findOneById(userId)

      if (user?.avatar_url) {
        const oldPath = `./${user.avatar_url}`
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
      const avatarUrl = `/uploads/avatars/${file.filename}`

      await this.usersService.updateProfile(userId, {avatar_url: avatarUrl})

      return {avatar_url: avatarUrl}
    } catch (e) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
      throw e instanceof BadRequestException ? e : new BadRequestException('Invalid image file')
    }
  }
}