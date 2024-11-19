import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
dotenv.config()

async function bootstrap() {
  // Crear la aplicación HTTP
  const app = await NestFactory.create(AppModule)

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Documentación de Microservicio User Write')
    .setDescription(
      'API del microservicio User Write para gestionar funcionalidades específicas',
    )
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('microservice-write-user', app, document) // Ruta para acceder a la documentación

  app.useGlobalPipes(new ValidationPipe())

  // Crear el microservicio
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  })
  app.enableCors({
    credentials: true,
    origin: true,
  })
  // Escuchar tanto el microservicio como la aplicación HTTP
  await app.startAllMicroservices()

  const PORT = Number(process.env.PORT) || 4002

  await app.listen(PORT, () => {
    console.log('LISTENING IN ', PORT)
  }) // Cambia el puerto según sea necesario
}
bootstrap()
