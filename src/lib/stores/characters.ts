import { writable, derived, get } from 'svelte/store';
import { toast } from 'svelte-sonner';
import { logger } from '$lib/config';
import {
  listCharacters,
  getCalculatedCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  createEmptyCharacter
} from '$lib/api/characters';
import type {
  Character,
  CalculatedCharacter,
  CreateCharacterData,
  UpdateCharacterData
} from '$lib/types/character';

// ==========================================
// STORES PRINCIPAIS
// ==========================================

// Lista de todos os personagens do usuário
export const characters = writable<Character[]>([]);

// Personagem atualmente selecionado/sendo editado
export const currentCharacter = writable<CalculatedCharacter | null>(null);

// Estados de loading
export const isLoadingList = writable<boolean>(false);
export const isLoadingCurrent = writable<boolean>(false);
export const isSaving = writable<boolean>(false);

// Controles de UI
export const showCreateModal = writable<boolean>(false);
export const showEditModal = writable<boolean>(false);

// ==========================================
// STORES DERIVADOS (COMPUTADOS)
// ==========================================

// Personagem atual apenas com dados básicos
export const currentCharacterBasic = derived(
  currentCharacter,
  ($currentCharacter) => $currentCharacter ? {
    id: $currentCharacter.id,
    name: $currentCharacter.name,
    data: $currentCharacter.data
  } : null
);

// Estatísticas da lista
export const charactersStats = derived(
  characters,
  ($characters) => ({
    total: $characters.length,
    maxLevel: Math.max(...$characters.map(c => c.data.basicInfo.currentLevel), 0),
    classes: [...new Set($characters.map(c => c.data.basicInfo.class))].filter(Boolean),
    races: [...new Set($characters.map(c => c.data.basicInfo.race))].filter(Boolean)
  })
);

// ==========================================
// AÇÕES DA LISTA
// ==========================================

// Carrega todos os personagens do usuário
export const loadCharacters = async (): Promise<void> => {
  isLoadingList.set(true);

  try {
    logger.info('Carregando lista de personagens');

    const charactersList = await listCharacters();
    characters.set(charactersList);

    logger.info('Lista de personagens carregada', { count: charactersList.length });

  } catch (error) {
    logger.error('Erro ao carregar personagens', error);
    toast.error('Erro ao carregar personagens');
  } finally {
    isLoadingList.set(false);
  }
};

// Recarrega a lista (útil após criar/deletar)
export const refreshCharacters = async (): Promise<void> => {
  await loadCharacters();
};

// ==========================================
// AÇÕES DO PERSONAGEM ATUAL
// ==========================================

// Seleciona e carrega um personagem com dados calculados
export const selectCharacter = async (id: number): Promise<void> => {
  isLoadingCurrent.set(true);

  try {
    logger.info('Selecionando personagem', { characterId: id });

    const character = await getCalculatedCharacter(id);
    currentCharacter.set(character);

    if (character) {
      logger.info('Personagem selecionado', {
        characterId: id,
        name: character.name
      });
    }

  } catch (error) {
    logger.error('Erro ao selecionar personagem', error);
    currentCharacter.set(null);
  } finally {
    isLoadingCurrent.set(false);
  }
};

// Limpa a seleção atual
export const clearCurrentCharacter = (): void => {
  currentCharacter.set(null);
  logger.info('Seleção de personagem limpa');
};

// ==========================================
// AÇÕES DE CRUD
// ==========================================

// Cria um novo personagem
export const createNewCharacter = async (characterData: CreateCharacterData): Promise<boolean> => {
  isSaving.set(true);

  try {
    logger.info('Criando novo personagem', { name: characterData.name });

    const newCharacter = await createCharacter(characterData);

    if (newCharacter) {
      // Adiciona à lista local
      const currentList = get(characters);
      characters.set([...currentList, newCharacter]);

      // Seleciona o novo personagem
      await selectCharacter(newCharacter.id);

      // Fecha modal
      showCreateModal.set(false);

      logger.info('Personagem criado com sucesso', {
        characterId: newCharacter.id,
        name: newCharacter.name
      });

      return true;
    }

    return false;

  } catch (error) {
    logger.error('Erro ao criar personagem', error);
    return false;
  } finally {
    isSaving.set(false);
  }
};

// Atualiza o personagem atual
export const updateCurrentCharacter = async (updateData: UpdateCharacterData): Promise<boolean> => {
  const current = get(currentCharacter);
  if (!current) {
    toast.error('Nenhum personagem selecionado');
    return false;
  }

  isSaving.set(true);

  try {
    logger.info('Atualizando personagem atual', {
      characterId: current.id,
      fields: Object.keys(updateData)
    });

    const updatedCharacter = await updateCharacter(current.id, updateData);

    if (updatedCharacter) {
      // Atualiza na lista local
      const currentList = get(characters);
      const updatedList = currentList.map(char =>
        char.id === updatedCharacter.id ? updatedCharacter : char
      );
      characters.set(updatedList);

      // Recarrega o personagem atual com dados calculados
      await selectCharacter(updatedCharacter.id);

      // Fecha modal se estiver aberto
      showEditModal.set(false);

      logger.info('Personagem atualizado com sucesso', {
        characterId: updatedCharacter.id
      });

      return true;
    }

    return false;

  } catch (error) {
    logger.error('Erro ao atualizar personagem', error);
    return false;
  } finally {
    isSaving.set(false);
  }
};

// Deleta um personagem
export const deleteCharacterById = async (id: number): Promise<boolean> => {
  const currentList = get(characters);
  const character = currentList.find(c => c.id === id);

  if (!character) {
    toast.error('Personagem não encontrado');
    return false;
  }

  try {
    logger.info('Deletando personagem', { characterId: id, name: character.name });

    const success = await deleteCharacter(id, character.name);

    if (success) {
      // Remove da lista local
      const updatedList = currentList.filter(c => c.id !== id);
      characters.set(updatedList);

      // Se era o personagem atual, limpa a seleção
      const current = get(currentCharacter);
      if (current && current.id === id) {
        clearCurrentCharacter();
      }

      logger.info('Personagem deletado com sucesso', { characterId: id });
      return true;
    }

    return false;

  } catch (error) {
    logger.error('Erro ao deletar personagem', error);
    return false;
  }
};

// ==========================================
// HELPERS E UTILITÁRIOS
// ==========================================

// Cria dados vazios para novo personagem
export const getEmptyCharacterData = (): CreateCharacterData => {
  return createEmptyCharacter();
};

// Busca personagem por ID na lista local
export const findCharacterById = (id: number): Character | undefined => {
  const currentList = get(characters);
  return currentList.find(c => c.id === id);
};

// Controles de modal
export const openCreateModal = (): void => {
  showCreateModal.set(true);
  logger.info('Modal de criação aberto');
};

export const closeCreateModal = (): void => {
  showCreateModal.set(false);
  logger.info('Modal de criação fechado');
};

export const openEditModal = (): void => {
  const current = get(currentCharacter);
  if (current) {
    showEditModal.set(true);
    logger.info('Modal de edição aberto', { characterId: current.id });
  } else {
    toast.error('Nenhum personagem selecionado para editar');
  }
};

export const closeEditModal = (): void => {
  showEditModal.set(false);
  logger.info('Modal de edição fechado');
};

// Função para inicializar (carrega lista inicial)
export const initCharacterStore = async (): Promise<void> => {
  logger.info('Inicializando store de personagens');
  await loadCharacters();
};