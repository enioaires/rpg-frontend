// ==========================================
// HTTP CLIENT - Simplificado com Fetch
// ==========================================

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';
import { logger } from '../utils/logger';
import {
  API_CONFIG,
  AUTH_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
  STORAGE_KEYS
} from '../utils/constants';
import type { ApiResponse, SimpleApiResponse, ApiError } from '../types';

// ==========================================
// TOKEN MANAGEMENT
// ==========================================

class TokenManager {
  private token: string | null = null;

  constructor() {
    if (browser) {
      this.loadFromStorage();
    }
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string | null): void {
    this.token = token;

    if (browser) {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
    }
  }

  clearTokens(): void {
    this.token = null;

    if (browser) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const now = Date.now();

      return expiry > (now + AUTH_CONFIG.TOKEN_EXPIRY_BUFFER);
    } catch (error) {
      logger.warn('Token inválido detectado', { error });
      return false;
    }
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      this.token = token;
    }
  }
}

// ==========================================
// SIMPLE HTTP CLIENT
// ==========================================

class ApiClient {
  private tokenManager: TokenManager;

  constructor() {
    this.tokenManager = new TokenManager();
  }

  // ==========================================
  // HTTP METHODS
  // ==========================================

  async get<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' });
  }

  // ==========================================
  // CORE REQUEST METHOD
  // ==========================================

  private async request<T>(url: string, options: RequestInit): Promise<SimpleApiResponse<T>> {
    const startTime = performance.now();

    try {
      // Constrói URL absoluta se não for já absoluta
      const absoluteUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;

      // Headers padrão
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Adiciona token se disponível
      const token = this.tokenManager.getToken();
      if (token && this.tokenManager.isTokenValid()) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Log da request
      logger.apiRequest(options.method || 'GET', absoluteUrl);
      console.log('🔍 DEBUG REQUEST:', {
        originalUrl: url,
        absoluteUrl,
        method: options.method,
        headers
      });

      // Faz a request
      const response = await fetch(absoluteUrl, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const duration = Math.round(performance.now() - startTime);

      // Log da response
      logger.apiResponse(options.method || 'GET', absoluteUrl, response.status, duration);

      if (!response.ok) {
        return this.handleError(response);
      }

      const apiResponse = await response.json();

      return {
        success: true,
        data: apiResponse,
      };

    } catch (error: any) {
      logger.error(`Request failed: ${options.method} ${url}`, error);

      return {
        success: false,
        error: error.message || ERROR_MESSAGES.NETWORK,
        message: error.message || ERROR_MESSAGES.NETWORK,
      };
    }
  }

  // ==========================================
  // ERROR HANDLING
  // ==========================================

  private async handleError(response: Response): Promise<SimpleApiResponse> {
    let message = ERROR_MESSAGES.UNKNOWN;

    try {
      const errorData = await response.json();
      message = errorData.error || errorData.message || message;
    } catch {
      // Se não conseguir fazer parse, usa mensagem padrão
    }

    // Tratamento específico por status
    switch (response.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        message = ERROR_MESSAGES.UNAUTHORIZED;
        this.handleUnauthorized();
        break;
      case HTTP_STATUS.FORBIDDEN:
        message = ERROR_MESSAGES.FORBIDDEN;
        break;
      case HTTP_STATUS.NOT_FOUND:
        message = ERROR_MESSAGES.NOT_FOUND;
        break;
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        message = ERROR_MESSAGES.VALIDATION;
        break;
      default:
        if (response.status >= 500) {
          message = ERROR_MESSAGES.SERVER_ERROR;
        }
    }

    return {
      success: false,
      error: message,
      message,
    };
  }

  private handleUnauthorized(): void {
    logger.authError('Token expirado', 'Sessão inválida');

    this.clearAuth();
    toast.error(ERROR_MESSAGES.UNAUTHORIZED);

    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      goto('/login');
    }
  }

  // ==========================================
  // AUTH MANAGEMENT
  // ==========================================

  setAuthToken(token: string | null): void {
    this.tokenManager.setToken(token);
    logger.authSuccess('Token definido');
  }

  clearAuth(): void {
    this.tokenManager.clearTokens();
    logger.authSuccess('Auth limpo');
  }

  isAuthenticated(): boolean {
    return this.tokenManager.isTokenValid();
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  async ping(): Promise<boolean> {
    try {
      const response = await this.get(`${API_CONFIG.BASE_URL}/health`);
      return response.success;
    } catch {
      return false;
    }
  }
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

export const apiClient = new ApiClient();

// ==========================================
// CONVENIENCE EXPORTS
// ==========================================

export const {
  get,
  post,
  put,
  delete: del,
  ping,
  setAuthToken,
  clearAuth,
  isAuthenticated,
} = apiClient;