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
  data?: RPGCharacterData;
}

// Dados calculados (do endpoint /calculated)
export interface CalculatedVitality {
  total: number;
  base: number;
  multiplier: number;
  levels: {
    notable: number;
    injured: number;
    severelyInjured: number;
    condemned: number;
    incapacitated: number;
    coma: number;
  };
}

export interface CalculatedBerkana {
  total: number;
  base: number;
  levelBonus: number;
}

export interface CalculatedAttributes {
  totals: Record<string, number>;
  levelBonus: number;
  nextBonusAtLevel: number;
}

export interface CalculatedWeapon extends RPGWeapon {
  calculatedPercentage: number;
}

export interface CalculatedWeapons {
  weapon1: CalculatedWeapon;
  weapon2: CalculatedWeapon;
  weapon3: CalculatedWeapon;
}

export interface CalculatedArmor extends RPGArmor {
  durabilityPercentage: number;
  status: 'good' | 'damaged' | 'broken';
}

export interface CalculatedProgression {
  currentLevel: number;
  nextLevel: number;
  xpCurrent: number;
  xpForNext: number;
  xpProgress: number;
}

export interface CalculatedCharacterData {
  vitality: CalculatedVitality;
  berkana: CalculatedBerkana;
  attributes: CalculatedAttributes;
  weapons: CalculatedWeapons;
  armor: CalculatedArmor;
  progression: CalculatedProgression;
}

// Personagem com dados calculados
export interface CalculatedCharacter extends Character {
  calculated: CalculatedCharacterData;
}

// Respostas da API
export interface CharactersListResponse {
  success: true;
  data: {
    characters: Character[];
  };
}

export interface CharacterResponse {
  success: true;
  data: {
    character: Character;
  };
}

export interface CalculatedCharacterResponse {
  success: true;
  data: {
    character: CalculatedCharacter;
  };
  message?: string;
}