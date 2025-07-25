// ==========================================
// CHARACTERS STORE - COMPLETO E CORRIGIDO
// ==========================================
// Arquivo: src/lib/stores/characters.ts

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
// STORE PRINCIPAL
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
    // CARREGAR LISTA
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

        logger.info('Lista carregada', { count: characters.length });

      } catch (error: any) {
        logger.error('Erro ao carregar personagens', error);

        update(state => ({
          ...state,
          characters: [],
          isLoading: false,
          error: error.message || ERROR_MESSAGES.CHARACTER.LOAD_FAILED,
        }));

        toast.error('Erro ao carregar personagens');
      }
    },

    async refresh(): Promise<void> {
      await this.loadAll();
    },

    // ==========================================
    // PERSONAGEM ATUAL
    // ==========================================

    async select(id: number): Promise<void> {
      update(state => ({ ...state, isLoadingCurrent: true, error: null }));

      try {
        logger.info('Selecionando personagem', { id });

        const character = await CharactersApi.getCalculated(id);

        update(state => ({
          ...state,
          currentCharacter: character,
          isLoadingCurrent: false,
        }));

        logger.info('Personagem selecionado', { id, name: character.name });

      } catch (error: any) {
        logger.error('Erro ao selecionar personagem', error, { id });

        update(state => ({
          ...state,
          currentCharacter: null,
          isLoadingCurrent: false,
          error: error.message || 'Personagem não encontrado',
        }));

        toast.error('Personagem não encontrado');
      }
    },

    clearCurrent(): void {
      update(state => ({
        ...state,
        currentCharacter: null,
        error: null,
      }));

      logger.info('Seleção de personagem limpa');
    },

    // ==========================================
    // CRIAR PERSONAGEM
    // ==========================================

    async create(data: CreateCharacterData): Promise<boolean> {
      update(state => ({ ...state, isSaving: true, error: null }));

      try {
        logger.info('Criando personagem', { name: data.name });

        const newCharacter = await CharactersApi.create(data);

        // Adiciona à lista local
        update(state => ({
          ...state,
          characters: [...state.characters, newCharacter],
          isSaving: false,
        }));

        // Seleciona o novo personagem
        await this.select(newCharacter.id);

        logger.info('Personagem criado', { id: newCharacter.id, name: newCharacter.name });
        toast.success('Personagem criado com sucesso!');

        return true;

      } catch (error: any) {
        logger.error('Erro ao criar personagem', error, { name: data.name });

        update(state => ({
          ...state,
          isSaving: false,
          error: error.message || 'Erro ao criar personagem',
        }));

        toast.error('Erro ao criar personagem');
        return false;
      }
    },

    // ==========================================
    // ATUALIZAR PERSONAGEM
    // ==========================================

    async updateCurrent(data: UpdateCharacterData): Promise<boolean> {
      const currentState = get({ subscribe });
      const current = currentState.currentCharacter;

      if (!current) {
        toast.error('Nenhum personagem selecionado');
        return false;
      }

      update(state => ({ ...state, isSaving: true, error: null }));

      try {
        logger.info('Atualizando personagem', { id: current.id });

        const updatedCharacter = await CharactersApi.update(current.id, data);

        // Atualiza na lista local
        update(state => ({
          ...state,
          characters: state.characters.map(char =>
            char.id === updatedCharacter.id ? updatedCharacter : char
          ),
          currentCharacter: updatedCharacter,
          isSaving: false,
        }));

        logger.info('Personagem atualizado', { id: updatedCharacter.id });
        toast.success('Personagem atualizado com sucesso!');

        return true;

      } catch (error: any) {
        logger.error('Erro ao atualizar personagem', error, { id: current.id });

        update(state => ({
          ...state,
          isSaving: false,
          error: error.message || 'Erro ao atualizar personagem',
        }));

        toast.error('Erro ao atualizar personagem');
        return false;
      }
    },

    // ==========================================
    // DELETAR PERSONAGEM
    // ==========================================

    async delete(id: number): Promise<boolean> {
      update(state => ({ ...state, isLoading: true, error: null }));

      try {
        logger.info('Deletando personagem', { id });

        await CharactersApi.delete(id);

        // Remove da lista local
        update(state => ({
          ...state,
          characters: state.characters.filter(char => char.id !== id),
          currentCharacter: state.currentCharacter?.id === id ? null : state.currentCharacter,
          isLoading: false,
        }));

        logger.info('Personagem deletado', { id });
        toast.success('Personagem removido com sucesso!');

        return true;

      } catch (error: any) {
        logger.error('Erro ao deletar personagem', error, { id });

        update(state => ({
          ...state,
          isLoading: false,
          error: error.message || 'Erro ao remover personagem',
        }));

        toast.error('Erro ao remover personagem');
        return false;
      }
    },

    // ==========================================
    // UTILITÁRIOS
    // ==========================================

    findById(id: number): Character | null {
      const state = get({ subscribe });
      return state.characters.find(char => char.id === id) || null;
    },

    createEmpty(): CreateCharacterData {
      return {
        name: 'Novo Personagem',
        data: {
          basicInfo: {
            playerName: '',
            characterName: 'Novo Personagem',
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
            currentLevel: 1,
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

    async initialize(): Promise<void> {
      const authenticated = get(isAuthenticated);

      if (authenticated) {
        logger.info('Inicializando character store');
        await this.loadAll();
      } else {
        logger.info('Usuário não autenticado, character store não inicializado');
      }
    },

    reset(): void {
      set(initialState);
      logger.info('Character store resetado');
    },

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

// Estatísticas úteis - COM FALLBACKS SEGUROS
export const charactersStats = derived(
  characters,
  $characters => {
    if (!$characters || $characters.length === 0) {
      return {
        total: 0,
        maxLevel: 0,
        uniqueClasses: 0,
        classes: [],
        races: [],
      };
    }

    const classes = [...new Set($characters.map(c => c.data?.basicInfo?.class).filter(Boolean))];
    const races = [...new Set($characters.map(c => c.data?.basicInfo?.race).filter(Boolean))];
    const levels = $characters.map(c => c.data?.basicInfo?.currentLevel || 0);

    return {
      total: $characters.length,
      maxLevel: Math.max(...levels, 0),
      uniqueClasses: classes.length,
      classes,
      races,
    };
  }
);

// ==========================================
// ACTIONS EXPORT - FUNÇÕES DIRETAS
// ==========================================

export const loadCharacters = () => charactersStore.loadAll();
export const refreshCharacters = () => charactersStore.refresh();
export const selectCharacter = (id: number) => charactersStore.select(id);
export const clearCurrentCharacter = () => charactersStore.clearCurrent();
export const createCharacter = (data: CreateCharacterData) => charactersStore.create(data);
export const updateCurrentCharacter = (data: UpdateCharacterData) => charactersStore.updateCurrent(data);
export const deleteCharacter = (id: number) => charactersStore.delete(id);
export const findCharacterById = (id: number) => charactersStore.findById(id);
export const createEmptyCharacter = () => charactersStore.createEmpty();
export const initializeCharacters = () => charactersStore.initialize();
export const resetCharacters = () => charactersStore.reset();