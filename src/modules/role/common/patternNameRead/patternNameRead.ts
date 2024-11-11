const enum PATTERNAME {
  ROLE_CREATE_IN_READ = 'role.create-read',  
}

type MessagePattern = {
  [K in keyof typeof PATTERNAME]: (typeof PATTERNAME)[K]
}

const patternNameRead: MessagePattern = {
  ROLE_CREATE_IN_READ: PATTERNAME.ROLE_CREATE_IN_READ,
}

export const { ROLE_CREATE_IN_READ } = patternNameRead
