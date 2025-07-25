// ==========================================
// CHARACTERS STORE - Atualizado para Nova API
// ==========================================

import { writable, derived, get } from 'svelte/store';
import { toast } from 'svelte-sonner';
import { logger } from '../utils/logger';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';
import { CharactersApi } from '../api/characters';
import { isAuthenticated } from './auth';
import type {
  Character,
  CalculatedCharacter,
  CreateCharacterData,
  UpdateCharacterData,
  CharacterState
} from '../types';

// ==========================================
// STORES PRINCIPAIS
// ==========================================

const createCharacterStore = () => {
  const initialState: CharacterState = {
    characters: [],
    currentCharacter: null,
    isLoading: false,
    isLoadingCurrent: false,
    isSaving: false,
    error: null,
  };

  const { subscribe, set, update } = writable<CharacterState>(initialState);

  return {
    subscribe,

    // ==========================================
    // AÇÕES DA LISTA
    // ==========================================

    async loadAll(): Promise<void> {
      update(state => ({ ...state, isLoading: true, error: null }));

      try {
        logger.info('Carregando lista de personagens');

        const characters = await CharactersApi.list();

        update(state => ({
          ...state,
          characters,
          isLoading: false,
        }));

        logger.characterAction('Lista carregada', undefined, {
          count: characters.length
        });

      } catch (error: any) {
        logger.error('Erro ao carregar personagens', error);

        update(state => ({
          ...state,
          characters: [],
          isLoading: false,
          error: error.message || ERROR_MESSAGES.CHARACTER.LOAD_FAILED,
        }));

        toast.error(ERROR_MESSAGES.CHARACTER.LOAD_FAILED);
      }
    },

    async refresh(): Promise<void> {
      await this.loadAll();
    },

    // ==========================================
    // AÇÕES DO PERSONAGEM ATUAL
    // ==========================================

    async select(id: number): Promise<void> {
      update(state => ({ ...state, isLoadingCurrent: true, error: null }));

      try {
        logger.characterAction('Selecionando personagem', id);

        const character = await CharactersApi.getCalculated(id);

        update(state => ({
          ...state,
          currentCharacter: character,
          isLoadingCurrent: false,
        }));

        logger.characterAction('Personagem selecionado', id, {
          name: character.name
        });

      } catch (error: any) {
        logger.error('Erro ao selecionar personagem', error, { characterId: id });

        update(state => ({
          ...state,
          currentCharacter: null,
          isLoadingCurrent: false,
          error: error.message || ERROR_MESSAGES.CHARACTER.NOT_FOUND,
        }));

        toast.error(ERROR_MESSAGES.CHARACTER.NOT_FOUND);
      }
    },

    clearCurrent(): void {
      update(state => ({
        ...state,
        currentCharacter: null,
        error: null,
      }));

      logger.characterAction('Seleção limpa');
    },

    // ==========================================
    // AÇÕES DE CRUD
    // ==========================================

    async create(data: CreateCharacterData): Promise<boolean> {
      update(state => ({ ...state, isSaving: true, error: null }));

      try {
        logger.characterAction('Criando personagem', undefined, {
          name: data.name
        });

        const newCharacter = await CharactersApi.create(data);

        // Adiciona à lista local
        update(state => ({
          ...state,
          characters: [...state.characters, newCharacter],
          isSaving: false,
        }));

        // Seleciona o novo personagem
        await this.select(newCharacter.id);

        logger.characterAction('Personagem criado', newCharacter.id, {
          name: newCharacter.name
        });

        toast.success(SUCCESS_MESSAGES.CHARACTER.CREATED);

        return true;

      } catch (error: any) {
        logger.error('Erro ao criar personagem', error, { name: data.name });

        update(state => ({
          ...state,
          isSaving: false,
          error: error.message || ERROR_MESSAGES.CHARACTER.CREATE_FAILED,
        }));

        toast.error(ERROR_MESSAGES.CHARACTER.CREATE_FAILED);

        return false;
      }
    },

    async updateCurrent(data: UpdateCharacterData): Promise<boolean> {
      const currentState = get({ subscribe });
      const current = currentState.currentCharacter;

      if (!current) {
        toast.error('Nenhum personagem selecionado');
        return false;
      }

      update(state => ({ ...state, isSaving: true, error: null }));

      try {
        logger.characterAction('Atualizando personagem', current.id, {
          fields: Object.keys(data)
        });

        const updatedCharacter = await CharactersApi.update(current.id, data);

        // Atualiza na lista local
        update(state => ({
          ...state,
          characters: state.characters.map(char =>
            char.id === updatedCharacter.id ? updatedCharacter : char
          ),
          isSaving: false,
        }));

        // Recarrega com dados calculados
        await this.select(updatedCharacter.id);

        logger.characterAction('Personagem atualizado', current.id, {
          name: updatedCharacter.name
        });

        toast.success(SUCCESS_MESSAGES.CHARACTER.UPDATED);

        return true;

      } catch (error: any) {
        logger.error('Erro ao atualizar personagem', error, {
          characterId: current.id,
          fields: Object.keys(data)
        });

        update(state => ({
          ...state,
          isSaving: false,
          error: error.message || ERROR_MESSAGES.CHARACTER.UPDATE_FAILED,
        }));

        toast.error(ERROR_MESSAGES.CHARACTER.UPDATE_FAILED);

        return false;
      }
    },

    async delete(id: number): Promise<boolean> {
      const currentState = get({ subscribe });
      const character = currentState.characters.find(c => c.id === id);

      if (!character) {
        toast.error(ERROR_MESSAGES.CHARACTER.NOT_FOUND);
        return false;
      }

      try {
        logger.characterAction('Deletando personagem', id, {
          name: character.name
        });

        await CharactersApi.delete(id);

        // Remove da lista local
        update(state => ({
          ...state,
          characters: state.characters.filter(c => c.id !== id),
          // Limpa seleção se era o personagem atual
          currentCharacter: state.currentCharacter?.id === id ? null : state.currentCharacter,
          error: null,
        }));

        logger.characterAction('Personagem deletado', id, {
          name: character.name
        });

        toast.success(SUCCESS_MESSAGES.CHARACTER.DELETED);

        return true;

      } catch (error: any) {
        logger.error('Erro ao deletar personagem', error, {
          characterId: id,
          name: character.name
        });

        toast.error(ERROR_MESSAGES.CHARACTER.DELETE_FAILED);

        return false;
      }
    },

    // ==========================================
    // UTILITÁRIOS
    // ==========================================

    findById(id: number): Character | undefined {
      const currentState = get({ subscribe });
      return currentState.characters.find(c => c.id === id);
    },

    // Cria dados vazios para novo personagem
    createEmpty(): CreateCharacterData {
      return {
        name: '',
        data: {
          basicInfo: {
            playerName: '',
            characterName: '',
            characterImage: '',
            class: '',
            race: '',
            deity: '',
            homeland: '',
            alignment: '',
            gender: '',
            age: 0,
            weight: 0,
            height: 0,
            virtuePoints: 0,
            currentLevel: 0,
            currentXp: 0,
            nextLevelXp: 1000,
          },
          attributes: {
            race: {
              agility: 0, charisma: 0, courage: 0, dexterity: 0, dodge: 0,
              strength: 0, intelligence: 0, initiative: 0, intimidate: 0,
              maneuver: 0, reflexes: 0, wisdom: 0, vigor: 0, willpower: 0,
            },
            class: {
              agility: 0, charisma: 0, courage: 0, dexterity: 0, dodge: 0,
              strength: 0, intelligence: 0, initiative: 0, intimidate: 0,
              maneuver: 0, reflexes: 0, wisdom: 0, vigor: 0, willpower: 0,
            },
          },
          vitality: {
            raceBase: 200,
            classBase: 150,
          },
          berkana: {
            baseValue: 120,
          },
          weapons: {
            weapon1: {
              name: '', image: '', percentage: 0, damage25: 0, damage50: 0,
              damage75: 0, damage100: 0, damageCritical: 0, observations: '',
            },
            weapon2: {
              name: '', image: '', percentage: 0, damage25: 0, damage50: 0,
              damage75: 0, damage100: 0, damageCritical: 0, observations: '',
            },
            weapon3: {
              name: '', image: '', percentage: 0, damage25: 0, damage50: 0,
              damage75: 0, damage100: 0, damageCritical: 0, observations: '',
            },
          },
          armor: {
            description: '',
            image: '',
            type: '',
            vitalityTotal: 0,
            vitalityCurrent: 0,
            observations: '',
          },
        },
      };
    },

    // Inicialização (carrega lista se autenticado)
    async initialize(): Promise<void> {
      const authenticated = get(isAuthenticated);

      if (authenticated) {
        logger.info('Inicializando character store');
        await this.loadAll();
      } else {
        logger.info('Usuário não autenticado, character store não inicializado');
      }
    },

    // Reset do store
    reset(): void {
      set(initialState);
      logger.info('Character store resetado');
    },

    // Debug
    getState(): CharacterState {
      return get({ subscribe });
    },
  };
};

// ==========================================
// STORE INSTANCE
// ==========================================

export const charactersStore = createCharacterStore();

// ==========================================
// DERIVED STORES
// ==========================================

// Lista de personagens
export const characters = derived(
  charactersStore,
  $store => $store.characters
);

// Personagem atual
export const currentCharacter = derived(
  charactersStore,
  $store => $store.currentCharacter
);

// Estados de loading
export const isLoadingCharacters = derived(
  charactersStore,
  $store => $store.isLoading
);

export const isLoadingCurrent = derived(
  charactersStore,
  $store => $store.isLoadingCurrent
);

export const isSavingCharacter = derived(
  charactersStore,
  $store => $store.isSaving
);

// Error state
export const charactersError = derived(
  charactersStore,
  $store => $store.error
);

// Estatísticas úteis
export const charactersStats = derived(
  characters,
  $characters => ({
    total: $characters.length,
    maxLevel: Math.max(...$characters.map(c => c.data.basicInfo.currentLevel), 0),
    classes: [...new Set($characters.map(c => c.data.basicInfo.class))].filter(Boolean),
    races: [...new Set($characters.map(c => c.data.basicInfo.race))].filter(Boolean),
  })
);

// Personagem atual só dados básicos (sem calculated)
export const currentCharacterBasic = derived(
  currentCharacter,
  $current => $current ? {
    id: $current.id,
    userId: $current.userId,
    name: $current.name,
    data: $current.data,
    updatedAt: $current.updatedAt,
    createdAt: $current.createdAt,
  } : null
);

// ==========================================
// ACTIONS EXPORT
// ==========================================

export const {
  loadAll: loadCharacters,
  refresh: refreshCharacters,
  select: selectCharacter,
  clearCurrent: clearCurrentCharacter,
  create: createCharacter,
  updateCurrent: updateCurrentCharacter,
  delete: deleteCharacter,
  findById: findCharacterById,
  createEmpty: createEmptyCharacter,
  initialize: initializeCharacters,
  reset: resetCharacters,
  getState: getCharactersState,
} = charactersStore;

// ==========================================
// AUTO-INITIALIZATION
// ==========================================

// Inicializa automaticamente quando auth muda
isAuthenticated.subscribe(authenticated => {
  if (authenticated) {
    initializeCharacters();
  } else {
    resetCharacters();
  }
});