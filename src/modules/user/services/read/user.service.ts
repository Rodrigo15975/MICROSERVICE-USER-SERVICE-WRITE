import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { TypeUserServiceRead } from 'src/types/type-user'
import {
  USER_CREATE_READ,
  USER_FIND_ONE_READ,
  USER_REMOVE_READ,
  USER_UPDATE_READ,
} from '../../common/patternNameRead/patterNameRead'
import { proxyName } from '../../common/proxyName/proxyName'
import { CreateUserDtoRead } from '../../dto/create-user.dto'
import { UpdateUserDto, UpdateUserDtoRead } from '../../dto/update-user.dto'

@Injectable()
export class UserServiceRead implements TypeUserServiceRead {
  constructor(
    @Inject(proxyName.name_read) private readonly clientUserRead: ClientProxy,
  ) {}

  create(data: CreateUserDtoRead): void {
    this.clientUserRead.emit<string, CreateUserDtoRead>(USER_CREATE_READ, data)
  }
  remove(id: number): void {
    this.clientUserRead.emit<string>(USER_REMOVE_READ, id)
  }
  update(data: UpdateUserDtoRead): void {
    this.clientUserRead.emit(USER_UPDATE_READ, data)
  }

  async findOne(id: number) {
    return await firstValueFrom<UpdateUserDto>(
      this.clientUserRead.send(USER_FIND_ONE_READ, id),
    )
  }
}
