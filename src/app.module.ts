import { Module } from '@nestjs/common'
import { RoleModule } from './modules/role/role.module'
import { UserModule } from './modules/user/user.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [UserModule, PrismaModule, RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
