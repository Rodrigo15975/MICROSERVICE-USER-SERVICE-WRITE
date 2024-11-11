export class AuthData {
  phone: string
  password: string
}
export class AuthDataPaciente extends AuthData {}
export class User {
  id: string
  role: RolesKey
}

const enum Roles {
  USUARIO = 'USUARIO',
  PACIENTE = 'PACIENTE',
  MEDICO = 'MEDICO',
}

export type RolesKey = keyof typeof Roles
