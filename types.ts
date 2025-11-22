
export enum ItemCategory {
  CLUE = 'CLUE', // Evidence found in the house
  OCCULT = 'OCCULT', // Ritual items
  SURVIVAL = 'SURVIVAL', // Tools and weapons
  FLORA = 'FLORA', // Cursed plants
  ANATOMY = 'ANATOMY', // Body parts
  MEDIA = 'MEDIA', // Photos, tapes
  ALCHEMY = 'ALCHEMY', // Potions

  GENERATOR_ARCHIVE = 'GENERATOR_ARCHIVE', // Generates Clues
  GENERATOR_ALTAR = 'GENERATOR_ALTAR', // Generates Occult items
  GENERATOR_TOOLBOX = 'GENERATOR_TOOLBOX', // Generates Survival items
  GENERATOR_GREENHOUSE = 'GENERATOR_GREENHOUSE', // Generates Flora
  GENERATOR_MORGUE = 'GENERATOR_MORGUE', // Generates Anatomy
  GENERATOR_DARKROOM = 'GENERATOR_DARKROOM', // Generates Media
  GENERATOR_LAB = 'GENERATOR_LAB', // Generates Alchemy
}

export interface MergeItemDef {
  id: string;
  name: string;
  level: number;
  icon: string; // Lucide icon name (Fallback)
  color: string;
  category: ItemCategory;
  imagePrompt: string; // Description for Gemini Image Gen
}

export interface GridSlot {
  id: string; // "row-col"
  item: MergeItemDef | null;
  isLocked: boolean; 
}

export interface Task {
  id: string;
  description: string;
  requiredItemName: string; 
  requiredLevel: number;
  requiredCategory: ItemCategory;
  rewardStars: number;
  rewardExp: number;
  storyContext: string; // Context for Gemini to generate flavor text
}

export interface GameState {
  stars: number;
  level: number;
  exp: number;
  inventory: Record<string, GridSlot>; // Keyed by slot ID
  tasks: Task[];
  storyChapter: number;
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'story' | 'system';
}
