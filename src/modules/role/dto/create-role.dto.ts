import { Prisma } from '@prisma/client'

export class CreateRoleDto implements Prisma.RoleCreateWithoutUserInput {
  role: string
}
