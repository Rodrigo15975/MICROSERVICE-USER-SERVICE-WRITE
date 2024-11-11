import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateUserDto, CreateUserDtoRead } from './create-user.dto'

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['role']),
) {
  id: number
  role: {
    role: string
  }
}
export class UpdateUserDtoRead extends PartialType(
  OmitType(CreateUserDtoRead, ['role']),
) {
  id: number
}
