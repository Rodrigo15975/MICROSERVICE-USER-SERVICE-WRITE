import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from "cookie-parser";
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
      host: 'localhost',
      port: 6379,
    },
  })
  app.enableCors({
    credentials: true,
    origin: true,
  })
  app.use(cookieParser());
  // Escuchar tanto el microservicio como la aplicación HTTP
  await app.startAllMicroservices()
  // Aplicar el filtro de excepciones RPC globalmente
  await app.listen(4002) // Cambia el puerto según sea necesario
}
bootstrap()
