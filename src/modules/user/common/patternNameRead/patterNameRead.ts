const enum PATTERNAME {
  USER_CREATE_READ = 'user.create.read',
  USER_UPDATE_READ = 'user.update.read',
  USER_REMOVE_READ = 'user.remove.read',
  USER_FIND_ONE_READ = 'user.find.one.read',
}

type MessagePattern = {
  [K in keyof typeof PATTERNAME]: (typeof PATTERNAME)[K]
}

const patternNameRead: MessagePattern = {
  USER_CREATE_READ: PATTERNAME.USER_CREATE_READ,
  USER_UPDATE_READ: PATTERNAME.USER_UPDATE_READ,
  USER_REMOVE_READ: PATTERNAME.USER_REMOVE_READ,
  USER_FIND_ONE_READ: PATTERNAME.USER_FIND_ONE_READ,
}

export const {
  USER_CREATE_READ,
  USER_UPDATE_READ,
  USER_REMOVE_READ,
  USER_FIND_ONE_READ,
} = patternNameRead
