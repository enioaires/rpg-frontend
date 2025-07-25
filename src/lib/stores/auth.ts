// ==========================================
// AUTH STORE - Estado de Autenticação
// ==========================================

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';
import { apiClient } from '../api/client';
import { logger } from '../utils/logger';
import {
  STORAGE_KEYS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  ROUTES
} from '../utils/constants';
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse
} from '../types';

// ==========================================
// STORES PRIMÁRIAS
// ==========================================

const createAuthStore = () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
  };

  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,

    // ==========================================
    // AÇÕES DE AUTENTICAÇÃO
    // ==========================================

    async login(credentials: LoginCredentials): Promise<boolean> {
      update(state => ({ ...state, isLoading: true }));

      try {
        logger.info('Tentativa de login', { identifier: credentials.identifier });

        const response = await apiClient.post<AuthResponse>('/auth/login', {
          login: credentials.identifier, // Backend espera 'login', não 'identifier'
          password: credentials.password
        });

        if (response.success && response.data?.data) {
          const { token, user } = response.data.data;

          // Salva token no client
          apiClient.setAuthToken(token);

          // Salva dados no localStorage
          if (browser) {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
          }

          // Atualiza store
          update(state => ({
            ...state,
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          }));

          logger.authSuccess('Login', {
            userId: user.id,
            username: user.username
          });

          toast.success(SUCCESS_MESSAGES.AUTH.LOGIN);

          return true;
        } else {
          throw new Error(response.error || ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
        }

      } catch (error: any) {
        logger.authError('Login', error);

        update(state => ({
          ...state,
          isLoading: false,
          isAuthenticated: false,
        }));

        toast.error(error.message || ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);

        return false;
      }
    },

    async register(data: RegisterData): Promise<boolean> {
      update(state => ({ ...state, isLoading: true }));

      try {
        logger.info('Tentativa de registro', {
          username: data.username,
          email: data.email
        });

        const response = await apiClient.post<AuthResponse>('/auth/register', data);

        if (response.success && response.data?.data) {
          const { token, user } = response.data.data;

          // Salva token no client
          apiClient.setAuthToken(token);

          // Salva dados no localStorage
          if (browser) {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
          }

          // Atualiza store
          update(state => ({
            ...state,
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          }));

          logger.authSuccess('Registro', {
            userId: user.id,
            username: user.username
          });

          toast.success(SUCCESS_MESSAGES.AUTH.REGISTER);

          return true;
        } else {
          throw new Error(response.error || ERROR_MESSAGES.UNKNOWN);
        }

      } catch (error: any) {
        logger.authError('Registro', error);

        update(state => ({
          ...state,
          isLoading: false,
          isAuthenticated: false,
        }));

        // Trata erros específicos
        let errorMessage = ERROR_MESSAGES.UNKNOWN as string;
        if (error.message?.includes('username')) {
          errorMessage = ERROR_MESSAGES.AUTH.USER_EXISTS;
        } else if (error.message?.includes('email')) {
          errorMessage = ERROR_MESSAGES.AUTH.EMAIL_EXISTS;
        }

        toast.error(errorMessage);

        return false;
      }
    },

    async logout(): Promise<void> {
      try {
        logger.info('Tentativa de logout');

        // Chama endpoint de logout (opcional - JWT é stateless)
        await apiClient.post('/auth/logout');

      } catch (error: any) {
        // Logout local mesmo se API falhar
        logger.warn('Erro no logout remoto, fazendo logout local', error);
      } finally {
        // Limpa tudo
        apiClient.clearAuth();

        if (browser) {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          localStorage.removeItem(STORAGE_KEYS.CURRENT_CHARACTER);
        }

        // Reset do store
        set(initialState);

        logger.authSuccess('Logout');
        toast.success(SUCCESS_MESSAGES.AUTH.LOGOUT);

        // Redireciona para login
        if (browser) {
          goto(ROUTES.LOGIN);
        }
      }
    },

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    async initialize(): Promise<void> {
      if (!browser) return;

      try {
        logger.info('Inicializando auth store');

        // Carrega dados do localStorage
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          const user: User = JSON.parse(userData);

          // Verifica se token ainda é válido
          apiClient.setAuthToken(token);

          if (apiClient.isAuthenticated()) {
            // Token válido - restaura sessão
            update(state => ({
              ...state,
              user,
              token,
              isAuthenticated: true,
            }));

            logger.authSuccess('Sessão restaurada', {
              userId: user.id,
              username: user.username
            });
          } else {
            // Token expirado - limpa dados
            logger.warn('Token expirado encontrado na inicialização');
            this.logout();
          }
        } else {
          logger.info('Nenhuma sessão encontrada');
        }

      } catch (error) {
        logger.error('Erro na inicialização do auth', error);

        // Em caso de erro, limpa tudo
        this.logout();
      }
    },

    // ==========================================
    // UTILITÁRIOS
    // ==========================================

    updateUser(user: Partial<User>): void {
      update(state => {
        if (!state.user) return state;

        const updatedUser = { ...state.user, ...user };

        // Atualiza localStorage
        if (browser) {
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
        }

        logger.info('Dados do usuário atualizados', user);

        return {
          ...state,
          user: updatedUser,
        };
      });
    },

    checkTokenExpiry(): boolean {
      return apiClient.isAuthenticated();
    },

    // ==========================================
    // RESET & DEBUG
    // ==========================================

    reset(): void {
      set(initialState);
      logger.info('Auth store resetado');
    },

    // Para debug em desenvolvimento
    getState(): AuthState {
      let currentState: AuthState = initialState;
      subscribe(state => currentState = state)();
      return currentState;
    },
  };
};

// ==========================================
// STORE INSTANCE
// ==========================================

export const authStore = createAuthStore();

// ==========================================
// DERIVED STORES
// ==========================================

// Estado de carregamento
export const isAuthLoading = derived(
  authStore,
  $auth => $auth.isLoading
);

// Status de autenticação
export const isAuthenticated = derived(
  authStore,
  $auth => $auth.isAuthenticated
);

// Usuário atual
export const currentUser = derived(
  authStore,
  $auth => $auth.user
);

// Token atual
export const authToken = derived(
  authStore,
  $auth => $auth.token
);

// Permissões do usuário (futuro)
export const userPermissions = derived(
  authStore,
  $auth => {
    if (!$auth.user) return [];

    // Por enquanto, todos os usuários têm as mesmas permissões
    // Futuramente pode ser expandido baseado em roles
    return ['read:characters', 'write:characters', 'delete:characters'];
  }
);

// ==========================================
// GUARDS & UTILITIES
// ==========================================

// Guard para rotas protegidas
export const requireAuth = (callback?: () => void) => {
  return derived(isAuthenticated, $isAuthenticated => {
    if (!$isAuthenticated && browser) {
      logger.warn('Acesso negado - usuário não autenticado');
      toast.error(ERROR_MESSAGES.UNAUTHORIZED);
      goto(ROUTES.LOGIN);
      return false;
    }

    if ($isAuthenticated && callback) {
      callback();
    }

    return $isAuthenticated;
  });
};

// Guard para usuários não autenticados (login/register)
export const requireGuest = () => {
  return derived(isAuthenticated, $isAuthenticated => {
    if ($isAuthenticated && browser) {
      logger.info('Usuário já autenticado, redirecionando');
      goto(ROUTES.DASHBOARD);
      return false;
    }

    return !$isAuthenticated;
  });
};

// ==========================================
// ACTIONS EXPORT
// ==========================================

export const {
  login,
  register,
  logout,
  initialize,
  updateUser,
  checkTokenExpiry,
  reset,
  getState,
} = authStore;

// ==========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ==========================================

// Inicializa automaticamente quando o módulo é carregado
if (browser) {
  initialize();
}