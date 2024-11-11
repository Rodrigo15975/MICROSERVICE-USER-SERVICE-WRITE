import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RpcException } from '@nestjs/microservices'
import { ROLES } from 'src/common/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(ROLES, context.getHandler())
    const userRoles = context
      .switchToRpc()
      .getData<{ auditoria: { role: string } }>()
    return RolesGuard.includeRoles(roles, userRoles.auditoria.role)
  }

  private static includeRoles(roles: string[], verifyRole: string) {
    const roleVerify = roles.some((role) => role === verifyRole)

    if (!roleVerify)
      throw new RpcException({
        message: 'Insufficient permissions',
        statusCode: HttpStatus.FORBIDDEN,
      })
    return true
  }
}
