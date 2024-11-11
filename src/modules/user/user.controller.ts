import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { ApiTags } from '@nestjs/swagger'
import {
  USER_CREATE,
  USER_REMOVE,
  USER_UPDATE,
} from './common/patternNameWrite/patternNameWrite'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserServiceWrite } from './services/write/user.service'

@ApiTags('MICROSERVICE-WRITE-USER')
@Controller()
export class UserController {
  constructor(private readonly userService: UserServiceWrite) {}

  @MessagePattern(USER_CREATE)
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @MessagePattern(USER_UPDATE)
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.id, updateUserDto)
  }

  @MessagePattern(USER_REMOVE)
  remove(@Payload() id: number) {
    return this.userService.remove(id)
  }
}
