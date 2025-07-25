// ==========================================
// CHARACTERS API - Corrigida para Response Format
// ==========================================
// Arquivo: src/lib/api/characters.ts

import { apiClient } from './client';
import { logger } from '../utils/logger';
import { API_ENDPOINTS } from '../utils/constants';
import type {
  Character,
  CalculatedCharacter,
  CreateCharacterData,
  UpdateCharacterData
} from '../types';

// ==========================================
// CHARACTERS API SERVICE
// ==========================================

export class CharactersApi {

  // GET /characters - Lista personagens do usuário
  static async list(): Promise<Character[]> {
    const startTime = logger.startTimer('characters.list');

    try {
      logger.info('Carregando lista de personagens');

      const response = await apiClient.get<any>(API_ENDPOINTS.CHARACTERS.LIST);

      if (response.success && response.data?.data?.characters) {
        const characters = response.data.data.characters;

        logger.info('Lista de personagens carregada', {
          count: characters.length
        });

        return characters;
      }

      // Se não veio characters, retorna array vazio
      logger.warn('Response não contém characters array', response.data?.data);
      return [];

    } catch (error: any) {
      logger.error('Erro ao carregar personagens', error);
      throw error;
    } finally {
      startTime();
    }
  }

  // GET /characters/:id - Busca personagem específico (raw)
  static async get(id: number): Promise<Character> {
    const startTime = logger.startTimer('characters.get');

    try {
      logger.info('Carregando personagem', { id });

      const response = await apiClient.get<any>(`${API_ENDPOINTS.CHARACTERS.LIST}/${id}`);

      if (response.success && response.data?.data) {
        return response.data.data;
      }

      throw new Error('Personagem não encontrado');

    } catch (error: any) {
      logger.error('Erro ao carregar personagem', error, { id });
      throw error;
    } finally {
      startTime();
    }
  }

  // GET /characters/:id/calculated - Busca personagem com cálculos
  static async getCalculated(id: number): Promise<CalculatedCharacter> {
    const startTime = logger.startTimer('characters.getCalculated');

    try {
      logger.info('Carregando personagem calculado', { id });

      const response = await apiClient.get<any>(`${API_ENDPOINTS.CHARACTERS.LIST}/${id}/calculated`);

      if (response.success && response.data?.data) {
        return response.data.data;
      }

      throw new Error('Personagem não encontrado');

    } catch (error: any) {
      logger.error('Erro ao carregar personagem calculado', error, { id });
      throw error;
    } finally {
      startTime();
    }
  }

  // POST /characters - Cria novo personagem
  static async create(data: CreateCharacterData): Promise<Character> {
    const startTime = logger.startTimer('characters.create');

    try {
      logger.info('Criando personagem', { name: data.name });

      const response = await apiClient.post<any>(API_ENDPOINTS.CHARACTERS.CREATE, data);

      if (response.success && response.data?.data) {
        const character = response.data.data;

        logger.info('Personagem criado', {
          id: character.id,
          name: character.name
        });

        return character;
      }

      throw new Error('Falha ao criar personagem');

    } catch (error: any) {
      logger.error('Erro ao criar personagem', error, { name: data.name });
      throw error;
    } finally {
      startTime();
    }
  }

  // PUT /characters/:id - Atualiza personagem
  static async update(id: number, data: UpdateCharacterData): Promise<Character> {
    const startTime = logger.startTimer('characters.update');

    try {
      logger.info('Atualizando personagem', { id });

      const response = await apiClient.put<any>(`${API_ENDPOINTS.CHARACTERS.LIST}/${id}`, data);

      if (response.success && response.data?.data) {
        const character = response.data.data;

        logger.info('Personagem atualizado', {
          id: character.id,
          name: character.name
        });

        return character;
      }

      throw new Error('Falha ao atualizar personagem');

    } catch (error: any) {
      logger.error('Erro ao atualizar personagem', error, { id });
      throw error;
    } finally {
      startTime();
    }
  }

  // DELETE /characters/:id - Remove personagem
  static async delete(id: number): Promise<void> {
    const startTime = logger.startTimer('characters.delete');

    try {
      logger.info('Removendo personagem', { id });

      const response = await apiClient.delete<any>(`${API_ENDPOINTS.CHARACTERS.LIST}/${id}`);

      if (response.success) {
        logger.info('Personagem removido', { id });
        return;
      }

      throw new Error('Falha ao remover personagem');

    } catch (error: any) {
      logger.error('Erro ao remover personagem', error, { id });
      throw error;
    } finally {
      startTime();
    }
  }
}