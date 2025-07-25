import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import ky from 'ky';
import { toast } from 'svelte-sonner';
import { config, logger } from '$lib/config';
import type {
  User,
  LoginData,
  RegisterData,
  AuthResult,
  AuthSuccessResponse,
  MeResponse
} from '$lib/types/auth';

// Cliente HTTP configurado para autenticação
const authApi = ky.create({
  prefixUrl: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 segundos
  retry: {
    limit: 2,
    methods: ['post']
  }
});

// Estados da autenticação (stores reativos)
export const user = writable<User | null>(null);
export const token = writable<string | null>(null);
export const isLoading = writable<boolean>(false);
export const isAuthenticated = writable<boolean>(false);

// Carrega dados salvos no localStorage (apenas no browser)
if (browser) {
  const savedToken = localStorage.getItem('rpg_token');
  const savedUser = localStorage.getItem('rpg_user');

  if (savedToken && savedUser) {
    try {
      token.set(savedToken);
      user.set(JSON.parse(savedUser) as User);
      isAuthenticated.set(true);
      logger.info('Dados de autenticação restaurados do localStorage');
    } catch (error) {
      logger.error('Erro ao carregar dados salvos do localStorage', error);
      // Limpa dados corrompidos
      localStorage.removeItem('rpg_token');
      localStorage.removeItem('rpg_user');
      toast.error('Erro ao restaurar sessão. Faça login novamente.');
    }
  }
}

// Função para fazer login
export const login = async (loginData: LoginData): Promise<AuthResult> => {
  isLoading.set(true);

  try {
    logger.info('Tentativa de login', { login: loginData.login });

    const response = await authApi.post('auth/login', {
      json: loginData
    }).json<AuthSuccessResponse>();

    // Salva no estado global
    user.set(response.data.user);
    token.set(response.data.token);
    isAuthenticated.set(true);

    // Persiste no localStorage
    if (browser) {
      localStorage.setItem('rpg_token', response.data.token);
      localStorage.setItem('rpg_user', JSON.stringify(response.data.user));
    }

    logger.info('Login realizado com sucesso', {
      userId: response.data.user.id,
      username: response.data.user.username
    });

    toast.success(`Bem-vindo, ${response.data.user.name}!`);

    return { success: true, data: response.data };

  } catch (error) {
    let errorMessage = 'Erro desconhecido no login';

    if (error instanceof Error) {
      // Trata erros do ky
      try {
        const errorResponse = await (error as any).response?.json();
        errorMessage = errorResponse?.error || error.message;
      } catch {
        errorMessage = error.message;
      }
    }

    logger.error('Erro no login', { error: errorMessage, login: loginData.login });
    toast.error(errorMessage);

    return { success: false, error: errorMessage };
  } finally {
    isLoading.set(false);
  }
};

// Função para registrar
export const register = async (registerData: RegisterData): Promise<AuthResult> => {
  isLoading.set(true);

  try {
    logger.info('Tentativa de registro', {
      username: registerData.username,
      email: registerData.email
    });

    const response = await authApi.post('auth/register', {
      json: registerData
    }).json<AuthSuccessResponse>();

    // Salva no estado global
    user.set(response.data.user);
    token.set(response.data.token);
    isAuthenticated.set(true);

    // Persiste no localStorage
    if (browser) {
      localStorage.setItem('rpg_token', response.data.token);
      localStorage.setItem('rpg_user', JSON.stringify(response.data.user));
    }

    logger.info('Usuário registrado com sucesso', {
      userId: response.data.user.id,
      username: response.data.user.username
    });

    toast.success(`Conta criada com sucesso! Bem-vindo, ${response.data.user.name}!`);

    return { success: true, data: response.data };

  } catch (error) {
    let errorMessage = 'Erro desconhecido no registro';

    if (error instanceof Error) {
      try {
        const errorResponse = await (error as any).response?.json();
        errorMessage = errorResponse?.error || error.message;
      } catch {
        errorMessage = error.message;
      }
    }

    logger.error('Erro no registro', { error: errorMessage });
    toast.error(errorMessage);

    return { success: false, error: errorMessage };
  } finally {
    isLoading.set(false);
  }
};

// Função para logout
export const logout = (): void => {
  logger.info('Logout realizado');

  // Limpa estado global
  user.set(null);
  token.set(null);
  isAuthenticated.set(false);

  // Limpa localStorage
  if (browser) {
    localStorage.removeItem('rpg_token');
    localStorage.removeItem('rpg_user');
  }

  toast.success('Logout realizado com sucesso');
};

// Função para validar token
export const validateToken = async (): Promise<boolean> => {
  if (!browser) return false;

  const currentToken = localStorage.getItem('rpg_token');

  if (!currentToken) {
    logout();
    return false;
  }

  try {
    const response = await authApi.get('auth/me', {
      headers: {
        'Authorization': `Bearer ${currentToken}`
      }
    }).json<MeResponse>();

    user.set(response.data.user);
    logger.info('Token validado com sucesso');
    return true;

  } catch (error) {
    logger.warn('Token inválido, fazendo logout automático');
    logout();
    return false;
  }
};