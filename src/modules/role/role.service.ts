import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { PrismaService } from 'src/prisma/prisma.service'
import { proxyName } from './common/proxyName/proxyName'
import { CreateRoleDto } from './dto/create-role.dto'
import { ROLE_CREATE_IN_READ } from './common/patternNameRead/patternNameRead'

@Injectable()
export class RoleService {
  constructor(
    @Inject(proxyName.name) private readonly roleClient: ClientProxy,
    private readonly prismaService: PrismaService,
  ) {}

  async create(data: CreateRoleDto) {
    try {
      const newRole = await this.prismaService.role.create({
        data: {
          role: data.role,
        },
      })
      
      this.roleClient.emit(ROLE_CREATE_IN_READ, newRole)

      return newRole
    } catch (error) {
      console.log(error)
      return new InternalServerErrorException(error)
    }
  }
}
