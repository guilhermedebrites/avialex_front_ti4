/**
 * Tipos e DTOs para autenticação
 * Baseado no AuthController do backend
 */

// ==================== REQUEST DTOs ====================

export interface SignInRequestDTO {
  email: string;
  password: string;
}

export interface SignUpRequestDTO {
  name: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  cpf: string;
  rg: string;
  type: 'CLIENT' | 'MANAGER' | 'LAWYER' | 'MARKETING';
}

export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

// ==================== RESPONSE DTOs ====================

export interface AuthResponseDTO {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  type: 'CLIENT' | 'MANAGER' | 'LAWYER' | 'MARKETING';
}
