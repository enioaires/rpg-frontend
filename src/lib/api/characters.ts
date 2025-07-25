import ky from 'ky';
import { get } from 'svelte/store';
import { toast } from 'svelte-sonner';
import { config, logger } from '$lib/config';
import { token } from '$lib/stores/auth';
import type {
  Character,
  CreateCharacterData,
  UpdateCharacterData,
  CalculatedCharacter,
  CharactersListResponse,
  CharacterResponse,
  CalculatedCharacterResponse
} from '$lib/types/character';

// Cliente HTTP configurado para personagens
const createCharacterApi = () => {
  const currentToken = get(token);

  return ky.create({
    prefixUrl: `${config.api.baseUrl}/characters`,
    headers: {
      'Content-Type': 'application/json',
      ...(currentToken && { 'Authorization': `Bearer ${currentToken}` })
    },
    timeout: 15000, // 15 segundos (personagens podem ser dados grandes)
    retry: {
      limit: 2,
      methods: ['get', 'post', 'put']
    },
    hooks: {
      beforeError: [
        async (error) => {
          const { response } = error;
          if (response && response.body) {
            try {
              const errorBody = await response.json() as { error?: string };
              error.name = 'CharacterAPIError';
              error.message = errorBody.error || `HTTP ${response.status}`;
            } catch {
              // Se não conseguir fazer parse do JSON, mantém mensagem original
            }
          }
          return error;
        }
      ]
    }
  });
};

// Função helper para tratar erros
const handleError = (error: unknown, operation: string): string => {
  let errorMessage = `Erro desconhecido em ${operation}`;

  if (error instanceof Error) {
    errorMessage = error.message;
  }

  logger.error(`Erro em ${operation}`, { error: errorMessage });
  toast.error(errorMessage);

  return errorMessage;
};

// ==========================================
// FUNÇÕES DA API DE PERSONAGENS
// ==========================================

// Listar todos os personagens do usuário
export const listCharacters = async (): Promise<Character[]> => {
  try {
    logger.info('Buscando lista de personagens');

    const api = createCharacterApi();
    const response = await api.get('').json<CharactersListResponse>();

    logger.info('Lista de personagens carregada', {
      count: response.data.characters.length
    });

    return response.data.characters;

  } catch (error) {
    handleError(error, 'listagem de personagens');
    return [];
  }
};

// Buscar personagem específico (dados brutos)
export const getCharacter = async (id: number): Promise<Character | null> => {
  try {
    logger.info('Buscando personagem', { characterId: id });

    const api = createCharacterApi();
    const response = await api.get(`${id}`).json<CharacterResponse>();

    logger.info('Personagem carregado', {
      characterId: id,
      name: response.data.character.name
    });

    return response.data.character;

  } catch (error) {
    handleError(error, `busca do personagem ${id}`);
    return null;
  }
};

// Buscar personagem com dados calculados
export const getCalculatedCharacter = async (id: number): Promise<CalculatedCharacter | null> => {
  try {
    logger.info('Buscando personagem calculado', { characterId: id });

    const api = createCharacterApi();
    const response = await api.get(`${id}/calculated`).json<CalculatedCharacterResponse>();

    logger.info('Personagem calculado carregado', {
      characterId: id,
      name: response.data.character.name,
      level: response.data.character.calculated.progression.currentLevel
    });

    return response.data.character;

  } catch (error) {
    handleError(error, `busca calculada do personagem ${id}`);
    return null;
  }
};

// Criar novo personagem
export const createCharacter = async (characterData: CreateCharacterData): Promise<Character | null> => {
  try {
    logger.info('Criando personagem', { name: characterData.name });

    const api = createCharacterApi();
    const response = await api.post('', {
      json: characterData
    }).json<CharacterResponse>();

    logger.info('Personagem criado com sucesso', {
      characterId: response.data.character.id,
      name: response.data.character.name
    });

    toast.success(`Personagem "${response.data.character.name}" criado com sucesso!`);

    return response.data.character;

  } catch (error) {
    handleError(error, 'criação de personagem');
    return null;
  }
};

// Atualizar personagem existente
export const updateCharacter = async (
  id: number,
  updateData: UpdateCharacterData
): Promise<Character | null> => {
  try {
    logger.info('Atualizando personagem', {
      characterId: id,
      fields: Object.keys(updateData)
    });

    const api = createCharacterApi();
    const response = await api.put(`${id}`, {
      json: updateData
    }).json<CharacterResponse>();

    logger.info('Personagem atualizado com sucesso', {
      characterId: id,
      name: response.data.character.name
    });

    toast.success(`Personagem "${response.data.character.name}" atualizado!`);

    return response.data.character;

  } catch (error) {
    handleError(error, `atualização do personagem ${id}`);
    return null;
  }
};

// Deletar personagem
export const deleteCharacter = async (id: number, name: string): Promise<boolean> => {
  try {
    logger.info('Deletando personagem', { characterId: id, name });

    const api = createCharacterApi();
    await api.delete(`${id}`);

    logger.info('Personagem deletado com sucesso', { characterId: id, name });

    toast.success(`Personagem "${name}" deletado com sucesso`);

    return true;

  } catch (error) {
    handleError(error, `exclusão do personagem ${name}`);
    return false;
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Cria um personagem vazio (para formulários)
export const createEmptyCharacter = (): CreateCharacterData => ({
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
      nextLevelXp: 100
    },
    attributes: {
      race: {
        agility: 0, charisma: 0, courage: 0, dexterity: 0,
        dodge: 0, strength: 0, intelligence: 0, initiative: 0,
        intimidate: 0, maneuver: 0, reflexes: 0, wisdom: 0,
        vigor: 0, willpower: 0
      },
      class: {
        agility: 0, charisma: 0, courage: 0, dexterity: 0,
        dodge: 0, strength: 0, intelligence: 0, initiative: 0,
        intimidate: 0, maneuver: 0, reflexes: 0, wisdom: 0,
        vigor: 0, willpower: 0
      }
    },
    vitality: {
      raceBase: 0,
      classBase: 0
    },
    berkana: {
      baseValue: 100
    },
    weapons: {
      weapon1: {
        name: '', image: '', percentage: 0,
        damage25: 0, damage50: 0, damage75: 0,
        damage100: 0, damageCritical: 0, observations: ''
      },
      weapon2: {
        name: '', image: '', percentage: 0,
        damage25: 0, damage50: 0, damage75: 0,
        damage100: 0, damageCritical: 0, observations: ''
      },
      weapon3: {
        name: '', image: '', percentage: 0,
        damage25: 0, damage50: 0, damage75: 0,
        damage100: 0, damageCritical: 0, observations: ''
      }
    },
    armor: {
      description: '',
      image: '',
      type: '',
      vitalityTotal: 0,
      vitalityCurrent: 0,
      observations: ''
    }
  }
});