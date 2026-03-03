import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import * as express from 'express'
import {join} from 'path'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  require('dotenv').config()
  app.setGlobalPrefix('api/v1')
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')))
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://notevault.pro',
    ],
    credentials: true,
  })
  const PORT = process.env.PORT || 3000
  await app.listen(PORT, '0.0.0.0')
}
bootstrap()