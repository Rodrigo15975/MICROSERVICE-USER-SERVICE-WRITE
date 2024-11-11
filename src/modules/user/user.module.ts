import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PrismaModule } from 'src/prisma/prisma.module'
import { proxyName } from './common/proxyName/proxyName'
import { UserServiceRead } from './services/read/user.service'
import { UserServiceWrite } from './services/write/user.service'
import { UserController } from './user.controller'
// import { AuthJwt } from '../auth/jwt/auth-jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ClientsModule.register([
      {
        name: proxyName.name_read,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('AUTH_KEY'),
        global: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserServiceRead, UserServiceWrite],
})
export class UserModule {}
