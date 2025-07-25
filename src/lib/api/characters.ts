// ==========================================
// CHARACTERS API - Endpoints Simples
// ==========================================

import { apiClient } from './client';
import { logger } from '../utils/logger';
import type {
  Character,
  CalculatedCharacter,
  CreateCharacterData,
  UpdateCharacterData
} from '../types';

// ==========================================
// CHARACTERS SERVICE - Apenas o que existe no backend
// ==========================================

export class CharactersApi {

  // GET /characters - Listar personagens do usuário
  static async list(): Promise<Character[]> {
    const startTime = logger.startTimer('characters.list');

    try {
      logger.info('Listando personagens');

      const response = await apiClient.get<{ characters: Character[] }>('/characters');

      if (response.success && response.data?.characters) {
        logger.characterAction('Lista carregada', undefined, {
          count: response.data.characters.length
        });

        return response.data.characters;
      }

      throw new Error(response.error || 'Falha ao listar personagens');

    } catch (error: any) {
      logger.error('Erro ao listar personagens', error);
      throw error;
    } finally {
      startTime();
    }
  }

  // POST /characters - Criar personagem
  static async create(data: CreateCharacterData): Promise<Character> {
    const startTime = logger.startTimer('characters.create');

    try {
      logger.characterAction('Criando personagem', undefined, {
        name: data.name
      });

      const response = await apiClient.post<{ character: Character }>('/characters', data);

      if (response.success && response.data?.character) {
        logger.characterAction('Personagem criado', response.data.character.id, {
          name: response.data.character.name
        });

        return response.data.character;
      }

      throw new Error(response.error || 'Falha ao criar personagem');

    } catch (error: any) {
      logger.error('Erro ao criar personagem', error, { name: data.name });
      throw error;
    } finally {
      startTime();
    }
  }

  // GET /characters/:id - Buscar personagem (dados brutos)
  static async get(id: number): Promise<Character> {
    const startTime = logger.startTimer('characters.get');

    try {
      logger.characterAction('Buscando personagem', id);

      const response = await apiClient.get<{ character: Character }>(`/characters/${id}`);

      if (response.success && response.data?.character) {
        logger.characterAction('Personagem encontrado', id, {
          name: response.data.character.name
        });

        return response.data.character;
      }

      throw new Error(response.error || 'Personagem não encontrado');

    } catch (error: any) {
      logger.error('Erro ao buscar personagem', error, { characterId: id });
      throw error;
    } finally {
      startTime();
    }
  }

  // GET /characters/:id/calculated - Buscar personagem com cálculos
  static async getCalculated(id: number): Promise<CalculatedCharacter> {
    const startTime = logger.startTimer('characters.getCalculated');

    try {
      logger.characterAction('Buscando personagem calculado', id);

      const response = await apiClient.get<{ character: CalculatedCharacter }>(`/characters/${id}/calculated`);

      if (response.success && response.data?.character) {
        logger.characterAction('Personagem calculado obtido', id, {
          name: response.data.character.name,
          level: response.data.character.data.basicInfo.currentLevel,
          totalVitality: response.data.character.calculated.totalVitality
        });

        return response.data.character;
      }

      throw new Error(response.error || 'Personagem não encontrado');

    } catch (error: any) {
      logger.error('Erro ao buscar personagem calculado', error, { characterId: id });
      throw error;
    } finally {
      startTime();
    }
  }

  // PUT /characters/:id - Atualizar personagem
  static async update(id: number, data: UpdateCharacterData): Promise<Character> {
    const startTime = logger.startTimer('characters.update');

    try {
      logger.characterAction('Atualizando personagem', id, {
        fields: Object.keys(data)
      });

      const response = await apiClient.put<{ character: Character }>(`/characters/${id}`, data);

      if (response.success && response.data?.character) {
        logger.characterAction('Personagem atualizado', id, {
          name: response.data.character.name
        });

        return response.data.character;
      }

      throw new Error(response.error || 'Falha ao atualizar personagem');

    } catch (error: any) {
      logger.error('Erro ao atualizar personagem', error, {
        characterId: id,
        fields: Object.keys(data)
      });
      throw error;
    } finally {
      startTime();
    }
  }

  // DELETE /characters/:id - Deletar personagem
  static async delete(id: number): Promise<boolean> {
    const startTime = logger.startTimer('characters.delete');

    try {
      logger.characterAction('Deletando personagem', id);

      const response = await apiClient.delete(`/characters/${id}`);

      if (response.success) {
        logger.characterAction('Personagem deletado', id);
        return true;
      }

      throw new Error(response.error || 'Falha ao deletar personagem');

    } catch (error: any) {
      logger.error('Erro ao deletar personagem', error, { characterId: id });
      throw error;
    } finally {
      startTime();
    }
  }
}

// ==========================================
// CONVENIENCE EXPORTS
// ==========================================

export const {
  list,
  create,
  get,
  getCalculated,
  update,
  delete: deleteCharacter
} = CharactersApi;