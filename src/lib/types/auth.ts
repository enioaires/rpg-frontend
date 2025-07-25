// Tipos para User (baseados na resposta da sua API)
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  createdAt: string;
}

// Dados para login
export interface LoginData {
  login: string; // username OU email
  password: string;
}

// Dados para registro
export interface RegisterData {
  username: string;
  email: string;
  name: string;
  password: string;
}

// Tipos para respostas da API de autenticação
export interface AuthSuccessResponse {
  success: true;
  data: {
    user: User;
    token: string;
  };
  message?: string;
  timestamp: number;
}

export interface AuthErrorResponse {
  success: false;
  error: string;
  details?: any;
  timestamp: string;
}

// Resultado das funções de autenticação
export interface AuthResult {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

// Resposta do endpoint /auth/me
export interface MeResponse {
  success: true;
  data: {
    user: User;
  };
}