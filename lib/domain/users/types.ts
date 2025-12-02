/**
 * Tipos e DTOs para usuários
 * Baseado no UserController do backend
 */

import { UserType } from '../../networking/session';

// ==================== ENTITIES ====================

export interface User {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  type: UserType;
}

// ==================== REQUEST DTOs ====================

export interface CreateUserDTO {
  name: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  cpf: string;
  rg: string;
  type: UserType;
}

export interface UpdateUserDTO {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  password?: string;
  cpf?: string;
  rg?: string;
  type?: UserType;
}

export interface SearchUsersParams {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  rg?: string;
  type?: UserType;
}

export interface ListUsersParams {
  name?: string;
  cpf?: string;
  email?: string;
  type?: UserType;
}
