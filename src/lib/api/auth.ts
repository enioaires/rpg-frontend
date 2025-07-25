// ==========================================
// AUTH API - Endpoints Simples
// ==========================================

import { apiClient } from './client';
import { logger } from '../utils/logger';
import { API_ENDPOINTS, API_CONFIG } from '../utils/constants';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User
} from '../types';

// ==========================================
// AUTH SERVICE - Apenas o que existe no backend
// ==========================================

export class AuthApi {

  // POST /auth/login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const startTime = logger.startTimer('auth.login');

    try {
      logger.info('Tentativa de login', { identifier: credentials.identifier });

      // Backend espera { login, password }
      const loginData = {
        login: credentials.identifier, // username OU email
        password: credentials.password
      };

      const url = `${API_CONFIG.BASE_URL}/${API_ENDPOINTS.AUTH.LOGIN}`;
      console.log('🔍 DEBUG: URL construída:', url);
      console.log('🔍 DEBUG: API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
      console.log('🔍 DEBUG: API_ENDPOINTS.AUTH.LOGIN:', API_ENDPOINTS.AUTH.LOGIN);

      // Usar fetch direto por enquanto
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      console.log('🔍 DEBUG: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('🔍 DEBUG: Response data:', data);

      if (data.success && data.data) {
        logger.authSuccess('Login bem-sucedido', {
          userId: data.data.user.id,
          username: data.data.user.username,
        });

        return data.data;
      }

      throw new Error(data.error || 'Falha no login');

    } catch (error: any) {
      logger.authError('Login falhou', error);
      throw error;
    } finally {
      startTime();
    }
  }

  // POST /auth/register  
  static async register(data: RegisterData): Promise<AuthResponse> {
    const startTime = logger.startTimer('auth.register');

    try {
      logger.info('Tentativa de registro', {
        username: data.username,
        email: data.email
      });

      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );

      if (response.success && response.data) {
        logger.authSuccess('Registro bem-sucedido', {
          userId: response.data.user.id,
          username: response.data.user.username,
        });

        return response.data;
      }

      throw new Error(response.error || 'Falha no registro');

    } catch (error: any) {
      logger.authError('Registro falhou', error);
      throw error;
    } finally {
      startTime();
    }
  }

  // GET /auth/me
  static async getMe(): Promise<User> {
    const startTime = logger.startTimer('auth.getMe');

    try {
      logger.info('Buscando dados do usuário');

      const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);

      if (response.success && response.data?.user) {
        logger.info('Dados do usuário obtidos', {
          userId: response.data.user.id,
          username: response.data.user.username,
        });

        return response.data.user;
      }

      throw new Error(response.error || 'Falha ao buscar dados');

    } catch (error: any) {
      logger.error('Erro ao buscar dados do usuário', error);
      throw error;
    } finally {
      startTime();
    }
  }
}

// ==========================================
// CONVENIENCE EXPORTS
// ==========================================

export const { login, register, getMe } = AuthApi;