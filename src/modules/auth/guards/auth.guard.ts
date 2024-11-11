import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RpcException } from '@nestjs/microservices'
import { env } from 'process'

@Injectable()
export class AuthUserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToRpc().getData<{ cookie: string }>()

    if (!ctx.cookie)
      throw new RpcException({
        message: 'Required Cookies',
        statusCode: HttpStatus.BAD_REQUEST,
      })

    const [_, token] = ctx.cookie.split('=')

    if (!token)
      throw new RpcException({
        message: 'Bad request',
        statusCode: HttpStatus.BAD_REQUEST,
      })

    try {
      await this.jwtService.verify(token, {
        secret: env.AUTH_KEY,
      })
    } catch (err) {
      console.error({ err })

      throw new RpcException({
        message: 'Bad request',
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }
    return true
  }
}
