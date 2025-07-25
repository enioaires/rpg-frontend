// src/lib/mocks/characterData.js
// Mock baseado na estrutura RPGCharacterData do seu projeto

/**
 * Dados mockados para desenvolvimento da primeira página da ficha
 * Baseado na estrutura definida em src/lib/types/character.ts
 */
export const mockCharacter = {
  id: 1,
  userId: 1,
  name: "Gandalf o Cinzento",
  data: {
    basicInfo: {
      playerName: "João Silva",
      characterName: "Gandalf o Cinzento",
      characterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      class: "Mago",
      race: "Humano",
      deity: "Mystra",
      homeland: "Terra Média",
      alignment: "Leal e Bom",
      gender: "Masculino",
      age: 2000,
      weight: 70,
      height: 180,
      virtuePoints: 15,
      currentLevel: 5,
      currentXp: 2500,
      nextLevelXp: 3000
    },
    attributes: {
      race: {
        agility: 2,
        charisma: 3,
        courage: 4,
        dexterity: 2,
        dodge: 3,
        strength: 1,
        intelligence: 18,
        initiative: 3,
        intimidate: 1,
        maneuver: 2,
        reflexes: 3,
        wisdom: 20,
        vigor: 2,
        willpower: 5
      },
      class: {
        agility: 1,
        charisma: 2,
        courage: 3,
        dexterity: 1,
        dodge: 2,
        strength: 0,
        intelligence: 25,
        initiative: 2,
        intimidate: 0,
        maneuver: 1,
        reflexes: 2,
        wisdom: 15,
        vigor: 1,
        willpower: 8
      }
    },
    vitality: {
      raceBase: 200,
      classBase: 150
    },
    berkana: {
      baseValue: 120
    },
    weapons: {
      weapon1: {
        name: "Cajado de Carvalho",
        image: "https://example.com/staff.jpg",
        percentage: 75,
        damage25: 5,
        damage50: 10,
        damage75: 20,
        damage100: 30,
        damageCritical: 45,
        observations: "Cajado élfico encantado"
      },
      weapon2: {
        name: "",
        image: "",
        percentage: 0,
        damage25: 0,
        damage50: 0,
        damage75: 0,
        damage100: 0,
        damageCritical: 0,
        observations: ""
      },
      weapon3: {
        name: "",
        image: "",
        percentage: 0,
        damage25: 0,
        damage50: 0,
        damage75: 0,
        damage100: 0,
        damageCritical: 0,
        observations: ""
      }
    },
    armor: {
      description: "Túnica Cinzenta",
      image: "https://example.com/robe.jpg",
      type: "Leve",
      vitalityTotal: 100,
      vitalityCurrent: 85,
      observations: "Túnica mágica resistente"
    }
  },
  updatedAt: "2025-07-24T10:30:00Z",
  createdAt: "2025-07-20T14:20:00Z"
};

/**
 * Personagem alternativo para testes
 */
export const mockCharacterWarrior = {
  id: 2,
  userId: 1,
  name: "Aragorn Montanha",
  data: {
    basicInfo: {
      playerName: "Maria Santos",
      characterName: "Aragorn Montanha",
      characterImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
      class: "Guerreiro",
      race: "Humano",
      deity: "Tyr",
      homeland: "Gondor",
      alignment: "Leal e Neutro",
      gender: "Masculino",
      age: 35,
      weight: 85,
      height: 185,
      virtuePoints: 12,
      currentLevel: 3,
      currentXp: 1200,
      nextLevelXp: 1800
    },
    attributes: {
      race: {
        agility: 5,
        charisma: 3,
        courage: 8,
        dexterity: 4,
        dodge: 6,
        strength: 15,
        intelligence: 2,
        initiative: 5,
        intimidate: 6,
        maneuver: 7,
        reflexes: 5,
        wisdom: 4,
        vigor: 10,
        willpower: 4
      },
      class: {
        agility: 3,
        charisma: 1,
        courage: 12,
        dexterity: 2,
        dodge: 4,
        strength: 20,
        intelligence: 0,
        initiative: 3,
        intimidate: 8,
        maneuver: 10,
        reflexes: 3,
        wisdom: 2,
        vigor: 15,
        willpower: 2
      }
    },
    vitality: {
      raceBase: 180,
      classBase: 200
    },
    berkana: {
      baseValue: 50
    },
    weapons: {
      weapon1: {
        name: "Espada de Aço",
        image: "https://example.com/sword.jpg",
        percentage: 85,
        damage25: 8,
        damage50: 15,
        damage75: 25,
        damage100: 35,
        damageCritical: 50,
        observations: "Espada forjada pelos anões"
      },
      weapon2: {
        name: "Arco Longo",
        image: "https://example.com/bow.jpg",
        percentage: 70,
        damage25: 6,
        damage50: 12,
        damage75: 20,
        damage100: 28,
        damageCritical: 40,
        observations: "Arco élfico"
      },
      weapon3: {
        name: "",
        image: "",
        percentage: 0,
        damage25: 0,
        damage50: 0,
        damage75: 0,
        damage100: 0,
        damageCritical: 0,
        observations: ""
      }
    },
    armor: {
      description: "Armadura de Couro",
      image: "https://example.com/leather.jpg",
      type: "Média",
      vitalityTotal: 150,
      vitalityCurrent: 150,
      observations: "Armadura resistente e flexível"
    }
  },
  updatedAt: "2025-07-24T09:15:00Z",
  createdAt: "2025-07-22T16:45:00Z"
};

/**
 * Helper functions para cálculos (mesmo do backend)
 */
export const calculateTotalAttributes = (character: any) => {
  const { race, class: classAttribs } = character.data.attributes;

  return {
    agility: (race.agility || 0) + (classAttribs.agility || 0),
    charisma: (race.charisma || 0) + (classAttribs.charisma || 0),
    courage: (race.courage || 0) + (classAttribs.courage || 0),
    dexterity: (race.dexterity || 0) + (classAttribs.dexterity || 0),
    dodge: (race.dodge || 0) + (classAttribs.dodge || 0),
    strength: (race.strength || 0) + (classAttribs.strength || 0),
    intelligence: (race.intelligence || 0) + (classAttribs.intelligence || 0),
    initiative: (race.initiative || 0) + (classAttribs.initiative || 0),
    intimidate: (race.intimidate || 0) + (classAttribs.intimidate || 0),
    maneuver: (race.maneuver || 0) + (classAttribs.maneuver || 0),
    reflexes: (race.reflexes || 0) + (classAttribs.reflexes || 0),
    wisdom: (race.wisdom || 0) + (classAttribs.wisdom || 0),
    vigor: (race.vigor || 0) + (classAttribs.vigor || 0),
    willpower: (race.willpower || 0) + (classAttribs.willpower || 0)
  };
};

export const calculateTotalVitality = (character: any) => {
  const { raceBase, classBase } = character.data.vitality;
  return raceBase + classBase;
};

export const calculateXpProgress = (character: any) => {
  const { currentXp, nextLevelXp } = character.data.basicInfo;
  return Math.min((currentXp / nextLevelXp) * 100, 100);
};