import { Prisma } from '@prisma/client'

export class CreateUserDto
  implements
    Omit<
      Prisma.UserCreateInput,
      'updatedAt' | 'createdAt' | 'avatar' | 'role' | 'auditoria'
    >
{
  dni: string
  password: string
  lastname: string
  name: string
  phone: string
  user_active: boolean
  role: string
  auditoria: {
    id: number
    phone: string
    avatar: string
    role: string
    name: string
    lastname: string
  }
}

export class CreateUserDtoRead
  implements Prisma.UserGetPayload<{ include: { role: true } }>
{
  auditoriaId: number | null
  auditoria: {
    dni: string
    avatar: string | null
    name: string
    lastname: string
  } | null
  role: { id: number; role: string } | null
  avatar: string | null
  createdAt: Date
  dni: string
  id: number
  lastname: string
  name: string
  password: string
  phone: string
  roleId: number | null
  updatedAt: Date
  user_active: boolean
}
