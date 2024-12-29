import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { hashPassword } from 'src/common/argonHash'
import { HandledRpcException } from 'src/common/handle-errorst'
import { PrismaService } from 'src/prisma/prisma.service'
import { TypeUserServiceWrite } from 'src/types/type-user'
import { CreateUserDto } from '../../dto/create-user.dto'
import { UpdateUserDto } from '../../dto/update-user.dto'
import { UserServiceRead } from '../read/user.service'

@Injectable()
export class UserServiceWrite implements TypeUserServiceWrite {
  constructor(
    private readonly userServiceRead: UserServiceRead,
    private readonly prismaService: PrismaService,
  ) {}

  async create(data: CreateUserDto) {
    const {
      dni,
      phone,
      lastname,
      name,
      password,
      user_active,
      role,
      auditoria,
    } = data
    const [dniExisting, phoneExisting] = await Promise.all([
      this.checkIfFieldExists('dni', dni),
      this.checkIfFieldExists('phone', phone),
    ])

    if (dniExisting)
      return HandledRpcException.rpcException(
        `Dni: ${dni} already`,
        HttpStatus.CONFLICT,
      )
    if (phoneExisting)
      return HandledRpcException.rpcException(
        `Phone: ${phone} already`,
        HttpStatus.CONFLICT,
      )

    const passwordHash = await hashPassword(password)
    const userCreated = await this.prismaService.user.create({
      data: {
        dni,
        lastname,
        name,
        password: passwordHash,
        user_active,
        phone,
        role: {
          connect: {
            role,
          },
        },
        ...(auditoria?.id && {
          auditoria: {
            connect: {
              id: auditoria.id,
            },
          },
        }),
      },
      include: {
        role: true,
      },
    })
    const userAuditoria = await this.createInAuditoriaUser(userCreated.id)
    this.userServiceRead.create({
      ...userCreated,
      auditoria: userAuditoria.User,
    })
    return new HttpException('Created successfully', HttpStatus.CREATED)
  }

  private async checkIfFieldExists(field: 'dni' | 'phone', value: string) {
    const user = await this.prismaService.user.findUnique({
      where: field === 'dni' ? { dni: value } : { phone: value },
    })
    return !!user
  }

  private async createInAuditoriaUser(id: number) {
    try {
      return await this.prismaService.auditoria.create({
        data: {
          User: {
            connect: {
              id,
            },
          },
        },
        include: {
          User: {
            select: {
              name: true,
              dni: true,
              lastname: true,
              avatar: true,
            },
          },
        },
      })
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }

  private async findOne(id: number) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    })
  }

  private async field(field: 'dni' | 'phone', value: string) {
    return await this.prismaService.user.findUnique({
      where: field === 'dni' ? { dni: value } : { phone: value },
    })
  }

  private async verifyDynamicField(id: number, dni: string, phone: string) {
    const findUser = await this.findOne(id)

    await Promise.all([
      this.validateField('phone', phone, findUser?.phone ?? ''),
      this.validateField('dni', dni, findUser?.dni ?? ''),
    ])
  }

  private async validateField(
    field: 'dni' | 'phone',
    newValue: string,
    existingValue: string | null,
  ) {
    if (existingValue !== newValue)
      await this.throwIfFieldExists(field, newValue)
  }

  private async throwIfFieldExists(field: 'dni' | 'phone', value: string) {
    const existingRecord = await this.field(field, value)
    if (existingRecord)
      throw HandledRpcException.rpcException(
        `Existing ${field} ${value}`,
        HttpStatus.CONFLICT,
      )
  }
  async update(id: number, data: UpdateUserDto): Promise<void | HttpException> {
    const { role, dni, phone, lastname, name, user_active } = data

    await this.verifyDynamicField(id, dni ?? '', phone ?? '')

    const updatedUser = await this.prismaService.user.update({
      data: {
        dni,
        phone,
        lastname,
        name,
        user_active,
        role: {
          connect: {
            role: role.role,
          },
        },
      },
      include: {
        role: true,
      },
      where: {
        id,
      },
    })
    this.userServiceRead.update(updatedUser)
    return new HttpException('Updated Successfully', HttpStatus.OK)
  }

  async remove(id: number): Promise<void | HttpException> {
    try {
      await this.prismaService.user.delete({
        where: {
          id,
        },
        include: {
          role: true,
        },
      })
      this.userServiceRead.remove(id)
      return new HttpException('Deleted successfully', HttpStatus.ACCEPTED)
    } catch (error) {
      console.log(error)

      return new InternalServerErrorException(error)
    }
  }
}
