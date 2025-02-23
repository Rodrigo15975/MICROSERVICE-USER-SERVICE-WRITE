import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Documentación de Microservicio User Write')
    .setDescription(
      'API del microservicio User Write para gestionar funcionalidades específicas',
    )
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('microservice-write-user', app, document)

  app.useGlobalPipes(new ValidationPipe())

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      tls: {
        servername: process.env.REDIS_HOST,
      },
    },
  })
  app.enableCors({
    credentials: true,
    origin: true,
  })
  await app.startAllMicroservices()

  const PORT = Number(process.env.PORT) || 4002

  await app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development') {
      return console.log(
        `Servidor escuchando en el puerto ${PORT} en modo ${process.env.NODE_ENV}`,
      )
    }
    console.log(
      `Servidor escuchando en el puerto ${PORT} en modo ${process.env.NODE_ENV}`,
    )
  })
}
bootstrap()
