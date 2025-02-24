import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PrismaModule } from 'src/prisma/prisma.module'
import { proxyName } from './common/proxyName/proxyName'
import { UserServiceRead } from './services/read/user.service'
import { UserServiceWrite } from './services/write/user.service'
import { UserController } from './user.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    PrismaModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: proxyName.name_read,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.getOrThrow('REDIS_HOST'),
            port: configService.getOrThrow('REDIS_PORT'),
            password: configService.getOrThrow('REDIS_PASSWORD'),
            tls: {
              servername: configService.getOrThrow('REDIS_HOST'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserServiceRead, UserServiceWrite],
})
export class UserModule {}
