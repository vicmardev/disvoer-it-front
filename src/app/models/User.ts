import { Role } from "./role";

export interface User {
  id: string,
  email: string,
  password: string,
  role: Role,
  firstName: string,
  lastName: string,
  jwtToken?: string,
  isDeleting?: boolean,
  avatarImagePath?: string,
  statusLogin?:string,
  contrato:string,
}