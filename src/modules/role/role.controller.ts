import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ROLE_CREATE } from './common/patternNameWrite/patternNameWrite'
import { CreateRoleDto } from './dto/create-role.dto'
import { RoleService } from './role.service'

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern(ROLE_CREATE)
  create(@Payload() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }
}
