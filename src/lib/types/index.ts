// ==========================================
// TYPES COMPARTILHADOS - Frontend/Backend
// ==========================================
// Baseado nos schemas do backend + validação Zod

import { z } from 'zod';

// ==========================================
// USER & AUTH TYPES
// ==========================================

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Login pode ser username OU email
export interface LoginCredentials {
  identifier: string; // username ou email
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  name: string;
  password: string;
}

// ==========================================
// CHARACTER TYPES (do backend)
// ==========================================

// Informações Básicas do Personagem
export interface RPGBasicInfo {
  playerName: string;
  characterName: string;
  characterImage?: string;
  class: string;
  race: string;
  deity?: string;
  homeland?: string;
  alignment?: string;
  gender?: string;
  age?: number;
  weight?: number;
  height?: number;
  virtuePoints: number;
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
}

// Conjunto de Atributos (mesmo para raça e classe)
export interface AttributeSet {
  agility: number;
  charisma: number;
  courage: number;
  dexterity: number;
  dodge: number;
  strength: number;
  intelligence: number;
  initiative: number;
  intimidate: number;
  maneuver: number;
  reflexes: number;
  wisdom: number;
  vigor: number;
  willpower: number;
}

// Atributos do Personagem
export interface RPGAttributes {
  race: AttributeSet;
  class: AttributeSet;
}

// Vitalidade
export interface RPGVitality {
  raceBase: number;
  classBase: number;
}

// Berkana (Mana)
export interface RPGBerkana {
  baseValue: number;
}

// Arma Individual
export interface RPGWeapon {
  name: string;
  image?: string;
  percentage: number;
  damage25: number;
  damage50: number;
  damage75: number;
  damage100: number;
  damageCritical: number;
  observations: string;
}

// Sistema de Armas (3 slots)
export interface RPGWeapons {
  weapon1: RPGWeapon;
  weapon2: RPGWeapon;
  weapon3: RPGWeapon;
}

// Armadura
export interface RPGArmor {
  description: string;
  image?: string;
  type: string;
  vitalityTotal: number;
  vitalityCurrent: number;
  observations: string;
}

// Dados Completos da Ficha RPG
export interface RPGCharacterData {
  basicInfo: RPGBasicInfo;
  attributes: RPGAttributes;
  vitality: RPGVitality;
  berkana: RPGBerkana;
  weapons: RPGWeapons;
  armor: RPGArmor;
}

// Personagem (estrutura do banco)
export interface Character {
  id: number;
  userId: number;
  name: string;
  data: RPGCharacterData;
  updatedAt: string;
  createdAt: string;
}

// Para criar personagem
export interface CreateCharacterData {
  name: string;
  data: RPGCharacterData;
}

// Para atualizar personagem
export interface UpdateCharacterData {
  name?: string;
  data?: Partial<RPGCharacterData>;
}

// Personagem com cálculos (endpoint /calculated)
export interface CalculatedCharacter extends Character {
  calculated: {
    totalAttributes: AttributeSet;
    totalVitality: number;
    currentVitality: number;
    totalBerkana: number;
    currentBerkana: number;
    armorVitality: {
      total: number;
      current: number;
      damaged: number;
    };
  };
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

// Resposta base da API (com duplo data)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: {
    success: boolean;
    data: T;
    message?: string;
    timestamp?: number;
  };
  error?: string;
  message?: string;
}

// Wrapper simplificado para uso interno
export interface SimpleApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// ==========================================
// VALIDATION SCHEMAS (Zod)
// ==========================================

// Login
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Username ou email obrigatório'),
  password: z.string().min(1, 'Senha obrigatória')
});

// Register
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .max(50, 'Username deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username deve conter apenas letras, números e _'),
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
});

// Character Basic Info
export const basicInfoSchema = z.object({
  playerName: z.string().min(1, 'Nome do jogador obrigatório'),
  characterName: z.string().min(1, 'Nome do personagem obrigatório'),
  characterImage: z.string().url().optional().or(z.literal('')),
  class: z.string().min(1, 'Classe obrigatória'),
  race: z.string().min(1, 'Raça obrigatória'),
  deity: z.string().optional(),
  homeland: z.string().optional(),
  alignment: z.string().optional(),
  gender: z.string().optional(),
  age: z.number().min(0).max(10000).optional(),
  weight: z.number().min(0).max(1000).optional(),
  height: z.number().min(0).max(300).optional(),
  virtuePoints: z.number().min(0).max(100),
  currentLevel: z.number().min(0).max(100),
  currentXp: z.number().min(0),
  nextLevelXp: z.number().min(0)
});

// ==========================================
// FRONTEND STATE TYPES
// ==========================================

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface CharacterState {
  characters: Character[];
  currentCharacter: CalculatedCharacter | null;
  isLoading: boolean;
  isLoadingCurrent: boolean;
  isSaving: boolean;
  error: string | null;
}

// ==========================================
// FORM TYPES
// ==========================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

// ==========================================
// UTILITY TYPES
// ==========================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface FormField<T = any> {
  value: T;
  error: string | null;
  touched: boolean;
}

export type FormState<T extends Record<string, any>> = {
  [K in keyof T]: FormField<T[K]>;
} & {
  isValid: boolean;
  isSubmitting: boolean;
  hasErrors: boolean;
};

// ==========================================
// CONSTANTS
// ==========================================

export const ATTRIBUTE_NAMES = [
  'agility',
  'charisma',
  'courage',
  'dexterity',
  'dodge',
  'strength',
  'intelligence',
  'initiative',
  'intimidate',
  'maneuver',
  'reflexes',
  'wisdom',
  'vigor',
  'willpower'
] as const;

export const ATTRIBUTE_LABELS: Record<keyof AttributeSet, string> = {
  agility: 'Agilidade',
  charisma: 'Carisma',
  courage: 'Coragem',
  dexterity: 'Destreza',
  dodge: 'Esquiva',
  strength: 'Força',
  intelligence: 'Inteligência',
  initiative: 'Iniciativa',
  intimidate: 'Intimidar',
  maneuver: 'Manobra',
  reflexes: 'Reflexos',
  wisdom: 'Sabedoria',
  vigor: 'Vigor',
  willpower: 'Vontade'
} as const;

export type AttributeName = typeof ATTRIBUTE_NAMES[number];