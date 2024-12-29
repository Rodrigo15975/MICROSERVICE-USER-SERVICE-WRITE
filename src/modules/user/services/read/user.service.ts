import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { TypeUserServiceRead } from 'src/types/type-user'
import {
  USER_CREATE_READ,
  USER_REMOVE_READ,
  USER_UPDATE_READ,
} from '../../common/patternNameRead/patterNameRead'
import { proxyName } from '../../common/proxyName/proxyName'
import { CreateUserDtoRead } from '../../dto/create-user.dto'
import { UpdateUserDtoRead } from '../../dto/update-user.dto'

@Injectable()
export class UserServiceRead implements TypeUserServiceRead {
  private readonly logger: Logger = new Logger(UserServiceRead.name)
  constructor(
    @Inject(proxyName.name_read) private readonly clientUserRead: ClientProxy,
  ) {}

  create(data: CreateUserDtoRead): void {
    try {
      this.logger.log('Send data for create in DB-USER-READ ')
      this.clientUserRead.emit<string, CreateUserDtoRead>(
        USER_CREATE_READ,
        data,
      )
    } catch (error) {
      this.logger.error(error, 'Error, send data for create in DB-USER-READ')
      throw new InternalServerErrorException(error)
    }
  }
  remove(id: number): void {
    try {
      this.logger.log('Send data for remove in DB-USER-READ ')
      this.clientUserRead.emit<string>(USER_REMOVE_READ, id)
    } catch (error) {
      this.logger.error(error, 'Error, send data for remove in DB-USER-READ')
      throw new InternalServerErrorException(error)
    }
  }
  update(data: UpdateUserDtoRead): void {
    try {
      this.logger.log('Send data for update in DB-USER-READ ')
      this.clientUserRead.emit(USER_UPDATE_READ, data)
    } catch (error) {
      this.logger.error(error, 'Error, send data for update in DB-USER-READ')
      throw new InternalServerErrorException(error)
    }
  }
}
