// ==========================================
// CONSTANTES DA APLICAÇÃO
// ==========================================

// ==========================================
// API CONFIGURATION
// ==========================================

// DEBUG: Vamos ver o que está acontecendo
console.log('🔍 DEBUG API_CONFIG:', {
  PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL,
  BASE_URL: 'http://localhost:3001', // Hardcoded por enquanto
  allEnvVars: import.meta.env
});

export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001', // Hardcoded por enquanto
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
} as const;

// ==========================================
// AUTH CONFIGURATION
// ==========================================

export const AUTH_CONFIG = {
  TOKEN_KEY: 'rpg_auth_token',
  USER_KEY: 'rpg_user_data',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutos antes de expirar
  SESSION_TIMEOUT: 30 * 24 * 60 * 60 * 1000, // 30 dias
} as const;

// ==========================================
// LOCAL STORAGE KEYS
// ==========================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'rpg_auth_token',
  USER_DATA: 'rpg_user_data',
  CURRENT_CHARACTER: 'rpg_current_character',
  THEME: 'rpg_theme',
  LANGUAGE: 'rpg_language',
} as const;

// ==========================================
// API ENDPOINTS
// ==========================================

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    ME: 'auth/me',
    REFRESH: 'auth/refresh',
    LOGOUT: 'auth/logout',
  },

  // Characters
  CHARACTERS: {
    LIST: '/characters',
    CREATE: '/characters',
    GET: (id: number) => `/characters/${id}`,
    GET_CALCULATED: (id: number) => `/characters/${id}/calculated`,
    UPDATE: (id: number) => `/characters/${id}`,
    DELETE: (id: number) => `/characters/${id}`,
  },

  // Health
  HEALTH: {
    STATUS: '',
    HEALTH: 'health',
    TEST_DB: 'test-db',
  },
} as const;

// ==========================================
// HTTP STATUS CODES
// ==========================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ==========================================
// TOAST CONFIGURATION
// ==========================================

export const TOAST_CONFIG = {
  DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000,
  },
  POSITION: 'top-right',
  MAX_TOASTS: 3,
} as const;

// ==========================================
// VALIDATION CONSTANTS
// ==========================================

export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255,
  },
  CHARACTER: {
    NAME_MAX_LENGTH: 100,
    LEVEL_MAX: 100,
    AGE_MAX: 10000,
    WEIGHT_MAX: 1000,
    HEIGHT_MAX: 300,
    VIRTUE_POINTS_MAX: 100,
  },
} as const;

// ==========================================
// RPG GAME CONSTANTS
// ==========================================

export const RPG_CONSTANTS = {
  // Progressão de nível
  LEVEL: {
    MIN: 0,
    MAX: 100,
    ATTRIBUTE_BONUS_EVERY: 5, // +1 atributo a cada 5 níveis
  },

  // Atributos
  ATTRIBUTES: {
    MIN_VALUE: 0,
    MAX_VALUE: 100,
    STARTING_VALUE: 0,
  },

  // Vitalidade
  VITALITY: {
    MIN_VALUE: 0,
    DEFAULT_RACE_BASE: 200,
    DEFAULT_CLASS_BASE: 150,
  },

  // Berkana (Mana)
  BERKANA: {
    MIN_VALUE: 0,
    DEFAULT_BASE: 120,
  },

  // Armas
  WEAPONS: {
    SLOTS: 3,
    DAMAGE_MIN: 0,
    DAMAGE_MAX: 999,
    PERCENTAGE_MIN: 0,
    PERCENTAGE_MAX: 100,
  },

  // Armadura
  ARMOR: {
    VITALITY_MIN: 0,
    VITALITY_MAX: 9999,
  },
} as const;

// ==========================================
// UI CONSTANTS
// ==========================================

export const UI_CONFIG = {
  // Breakpoints (Tailwind)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },

  // Debounce delays
  DEBOUNCE: {
    SEARCH: 300,
    INPUT: 500,
    SAVE: 1000,
  },

  // Animation durations
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  // Loading states
  LOADING: {
    MIN_DISPLAY_TIME: 500, // Evita flicker
    SKELETON_LINES: {
      CHARACTER_CARD: 3,
      FORM: 5,
      LIST: 8,
    },
  },
} as const;

// ==========================================
// ERROR MESSAGES
// ==========================================

export const ERROR_MESSAGES = {
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para essa ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  VALIDATION: 'Dados inválidos. Verifique os campos.',
  UNKNOWN: 'Erro desconhecido. Tente novamente.',

  // Auth específicos
  AUTH: {
    INVALID_CREDENTIALS: 'Usuário ou senha inválidos.',
    USER_EXISTS: 'Usuário já existe.',
    EMAIL_EXISTS: 'Email já está em uso.',
    WEAK_PASSWORD: 'Senha muito fraca.',
  },

  // Character específicos  
  CHARACTER: {
    NOT_FOUND: 'Personagem não encontrado.',
    CREATE_FAILED: 'Erro ao criar personagem.',
    UPDATE_FAILED: 'Erro ao atualizar personagem.',
    DELETE_FAILED: 'Erro ao excluir personagem.',
    LOAD_FAILED: 'Erro ao carregar personagens.',
  },
} as const;

// ==========================================
// SUCCESS MESSAGES
// ==========================================

export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN: 'Login realizado com sucesso!',
    REGISTER: 'Conta criada com sucesso!',
    LOGOUT: 'Logout realizado com sucesso!',
  },

  CHARACTER: {
    CREATED: 'Personagem criado com sucesso!',
    UPDATED: 'Personagem atualizado com sucesso!',
    DELETED: 'Personagem excluído com sucesso!',
    LOADED: 'Personagens carregados!',
  },

  GENERAL: {
    SAVED: 'Dados salvos com sucesso!',
    COPIED: 'Copiado para a área de transferência!',
    EXPORTED: 'Dados exportados com sucesso!',
    IMPORTED: 'Dados importados com sucesso!',
  },
} as const;

// ==========================================
// ROUTES
// ==========================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CHARACTER: {
    LIST: '/characters',
    CREATE: '/characters/create',
    EDIT: (id: number) => `/characters/${id}/edit`,
    VIEW: (id: number) => `/characters/${id}`,
  },
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// ==========================================
// REGEX PATTERNS
// ==========================================

export const REGEX_PATTERNS = {
  USERNAME: /^[a-zA-Z0-9_]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^.{6,}$/, // Mínimo 6 caracteres
  URL: /^https?:\/\/.+/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
} as const;

// ==========================================
// ENVIRONMENT CHECKS
// ==========================================

export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_BROWSER = typeof window !== 'undefined';
export const IS_SERVER = typeof window === 'undefined';