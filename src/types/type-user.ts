import { HttpException } from '@nestjs/common'
import {
  // CreateUserDto,
  CreateUserDtoRead,
} from 'src/modules/user/dto/create-user.dto'
import {
  UpdateUserDto,
  UpdateUserDtoRead,
} from 'src/modules/user/dto/update-user.dto'

export interface TypeUserServiceWrite {
  // create(data: CreateUserDto): Promise<void | any>
  update(id: number, data: UpdateUserDto): Promise<void | HttpException>
  remove(id: number): Promise<void | HttpException>
}

export interface TypeUserServiceRead {
  create(data: CreateUserDtoRead): void
  update(data: UpdateUserDtoRead): void
  remove(id: number): void
}
