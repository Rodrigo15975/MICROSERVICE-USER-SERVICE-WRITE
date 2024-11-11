import { HttpStatus } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

export class HandledRpcException {
  static rpcException(message: string, statusCode: HttpStatus) {
    throw new RpcException({
      message,
      statusCode,
    })
  }
}
