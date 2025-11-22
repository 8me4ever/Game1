
import { ItemCategory, MergeItemDef, Task } from './types';

// --- MERGE CHAINS ---

// Chain 1: Clues (Produced by Archive)
export const CLUE_CHAIN: MergeItemDef[] = [
  { 
    id: 'clue_1', name: '积灰', level: 1, icon: 'Wind', color: 'text-slate-500', category: ItemCategory.CLUE,
    imagePrompt: 'A pixel art icon of a small pile of grey dust bunnies on a dark floor, horror game style, dark background' 
  },
  { 
    id: 'clue_2', name: '古旧钥匙', level: 2, icon: 'Key', color: 'text-amber-600', category: ItemCategory.CLUE,
    imagePrompt: 'A pixel art icon of a rusty antique brass key, sinister atmosphere, dark background' 
  },
  { 
    id: 'clue_3', name: '生锈铁钉', level: 3, icon: 'Hammer', color: 'text-orange-800', category: ItemCategory.CLUE,
    imagePrompt: 'A pixel art icon of a crooked rusty iron nail, sharp and dangerous, dark background' 
  },
  { 
    id: 'clue_4', name: '残破信件', level: 4, icon: 'FileText', color: 'text-slate-200', category: ItemCategory.CLUE,
    imagePrompt: 'A pixel art icon of a torn piece of yellowed paper with unreadable scribbles, dark background' 
  },
  { 
    id: 'clue_5', name: '血迹碎布', level: 5, icon: 'Droplet', color: 'text-red-600', category: ItemCategory.CLUE,
    imagePrompt: 'A pixel art icon of a torn white rag stained with fresh red blood, horror style, dark background' 
  },
  { 
    id: 'clue_6', name: '不知名指骨', level: 6, icon: 'Bone', color: 'text-slate-100', category: ItemCategory.CLUE,
    imagePrompt: 'A pixel art icon of a small white human finger bone, creepy, dark background' 
  },
  { 
    id: 'clue_7', name: '人类头骨', level: 7, icon: 'Skull', color: 'text-slate-300', category: ItemCategory.CLUE,
    imagePrompt: 'A pixel art icon of a cracked human skull, ominous shadows, horror game asset, dark background' 
  },
];

// Chain 2: Occult (Produced by Altar)
export const OCCULT_CHAIN: MergeItemDef[] = [
  { 
    id: 'occult_1', name: '黑蜡烛', level: 1, icon: 'Flame', color: 'text-purple-400', category: ItemCategory.OCCULT,
    imagePrompt: 'A pixel art icon of a short black candle with a purple flame, occult vibe, dark background' 
  },
  { 
    id: 'occult_2', name: '乌鸦羽毛', level: 2, icon: 'Feather', color: 'text-slate-600', category: ItemCategory.OCCULT,
    imagePrompt: 'A pixel art icon of a jet black crow feather, shiny and ominous, dark background' 
  },
  { 
    id: 'occult_3', name: '粗盐堆', level: 3, icon: 'CloudHail', color: 'text-white', category: ItemCategory.OCCULT,
    imagePrompt: 'A pixel art icon of a small pile of white coarse salt for exorcism, dark background' 
  },
  { 
    id: 'occult_4', name: '塔罗牌', level: 4, icon: 'BookOpen', color: 'text-indigo-400', category: ItemCategory.OCCULT,
    imagePrompt: 'A pixel art icon of a single mysterious tarot card with the Death arcana, dark background' 
  },
  { 
    id: 'occult_5', name: '巫毒娃娃', level: 5, icon: 'Accessibility', color: 'text-amber-900', category: ItemCategory.OCCULT,
    imagePrompt: 'A pixel art icon of a crude burlap voodoo doll with a pin in it, scary, dark background' 
  },
  { 
    id: 'occult_6', name: '通灵盒', level: 6, icon: 'Radio', color: 'text-teal-500', category: ItemCategory.OCCULT,
    imagePrompt: 'A pixel art icon of a spirit box ghost hunting radio device, glowing lights, dark background' 
  },
  { 
    id: 'occult_7', name: '死灵之书', level: 7, icon: 'Book', color: 'text-red-900', category: ItemCategory.OCCULT,
    imagePrompt: 'A pixel art icon of an ancient leather book with a face on the cover, Necronomicon style, dark background' 
  },
];

// Chain 3: Survival (Produced by Toolbox)
export const SURVIVAL_CHAIN: MergeItemDef[] = [
  { id: 'surv_1', name: '锈蚀螺丝', level: 1, icon: 'MoreHorizontal', color: 'text-slate-400', category: ItemCategory.SURVIVAL, imagePrompt: 'Pixel art icon, single rusty screw, dark background' },
  { id: 'surv_2', name: '螺丝刀', level: 2, icon: 'Wrench', color: 'text-yellow-600', category: ItemCategory.SURVIVAL, imagePrompt: 'Pixel art icon, old yellow handle screwdriver, dark background' },
  { id: 'surv_3', name: '老虎钳', level: 3, icon: 'Scissors', color: 'text-slate-500', category: ItemCategory.SURVIVAL, imagePrompt: 'Pixel art icon, heavy duty pliers, metallic, dark background' },
  { id: 'surv_4', name: '铁锤', level: 4, icon: 'Hammer', color: 'text-slate-300', category: ItemCategory.SURVIVAL, imagePrompt: 'Pixel art icon, heavy sledgehammer with bloodstain, dark background' },
  { id: 'surv_5', name: '撬棍', level: 5, icon: 'Slash', color: 'text-red-500', category: ItemCategory.SURVIVAL, imagePrompt: 'Pixel art icon, red painted crowbar, half life style, dark background' },
  { id: 'surv_6', name: '手电筒', level: 6, icon: 'Flashlight', color: 'text-yellow-200', category: ItemCategory.SURVIVAL, imagePrompt: 'Pixel art icon, heavy duty flashlight beam on, dark background' },
  { id: 'surv_7', name: '信号枪', level: 7, icon: 'Crosshair', color: 'text-orange-500', category: ItemCategory.SURVIVAL, imagePrompt: 'Pixel art icon, orange emergency flare gun, dangerous, dark background' },
];

// Chain 4: Flora (Produced by Greenhouse)
export const FLORA_CHAIN: MergeItemDef[] = [
  { id: 'flora_1', name: '枯萎种子', level: 1, icon: 'Circle', color: 'text-amber-800', category: ItemCategory.FLORA, imagePrompt: 'Pixel art icon, dried up black plant seed, dark background' },
  { id: 'flora_2', name: '干枯树枝', level: 2, icon: 'MoveDiagonal', color: 'text-amber-900', category: ItemCategory.FLORA, imagePrompt: 'Pixel art icon, snappy dead twig, dark background' },
  { id: 'flora_3', name: '腐烂叶子', level: 3, icon: 'Leaf', color: 'text-green-900', category: ItemCategory.FLORA, imagePrompt: 'Pixel art icon, slimy brown rotting leaf, dark background' },
  { id: 'flora_4', name: '毒蘑菇', level: 4, icon: 'Umbrella', color: 'text-purple-800', category: ItemCategory.FLORA, imagePrompt: 'Pixel art icon, spotted purple poisonous mushroom, glowing, dark background' },
  { id: 'flora_5', name: '食人花蕾', level: 5, icon: 'Flower', color: 'text-red-700', category: ItemCategory.FLORA, imagePrompt: 'Pixel art icon, carnivorous plant bud with teeth, dark background' },
  { id: 'flora_6', name: '曼德拉草', level: 6, icon: 'User', color: 'text-amber-600', category: ItemCategory.FLORA, imagePrompt: 'Pixel art icon, screaming mandrake root, human shape, dark background' },
  { id: 'flora_7', name: '恶魔之花', level: 7, icon: 'Sun', color: 'text-red-500', category: ItemCategory.FLORA, imagePrompt: 'Pixel art icon, blooming giant rafflesia flower, blood red, dark background' },
];

// Chain 5: Anatomy (Produced by Morgue)
export const ANATOMY_CHAIN: MergeItemDef[] = [
  { id: 'anat_1', name: '带血臼齿', level: 1, icon: 'Circle', color: 'text-white', category: ItemCategory.ANATOMY, imagePrompt: 'Pixel art icon, bloody molar tooth, dark background' },
  { id: 'anat_2', name: '浑浊眼球', level: 2, icon: 'Eye', color: 'text-blue-200', category: ItemCategory.ANATOMY, imagePrompt: 'Pixel art icon, severed eyeball with optic nerve, blue iris, dark background' },
  { id: 'anat_3', name: '断指', level: 3, icon: 'Hand', color: 'text-rose-300', category: ItemCategory.ANATOMY, imagePrompt: 'Pixel art icon, severed human finger, pale skin, dark background' },
  { id: 'anat_4', name: '人耳', level: 4, icon: 'Ear', color: 'text-rose-300', category: ItemCategory.ANATOMY, imagePrompt: 'Pixel art icon, severed human ear, grotesque, dark background' },
  { id: 'anat_5', name: '心脏', level: 5, icon: 'Heart', color: 'text-red-800', category: ItemCategory.ANATOMY, imagePrompt: 'Pixel art icon, realistic human heart organ, beating, dark background' },
  { id: 'anat_6', name: '大脑', level: 6, icon: 'Brain', color: 'text-pink-300', category: ItemCategory.ANATOMY, imagePrompt: 'Pixel art icon, human brain, pink and grey, dark background' },
  { id: 'anat_7', name: '缝合怪', level: 7, icon: 'Ghost', color: 'text-green-800', category: ItemCategory.ANATOMY, imagePrompt: 'Pixel art icon, frankenstein style flesh golem face, stitched, dark background' },
];

// Chain 6: Media (Produced by Darkroom)
export const MEDIA_CHAIN: MergeItemDef[] = [
  { id: 'media_1', name: '曝光胶卷', level: 1, icon: 'Film', color: 'text-slate-800', category: ItemCategory.MEDIA, imagePrompt: 'Pixel art icon, unrolled film canister, dark background' },
  { id: 'media_2', name: '模糊底片', level: 2, icon: 'Image', color: 'text-slate-600', category: ItemCategory.MEDIA, imagePrompt: 'Pixel art icon, photographic negative strip, ghostly faces, dark background' },
  { id: 'media_3', name: '显影液', level: 3, icon: 'Droplet', color: 'text-yellow-100', category: ItemCategory.MEDIA, imagePrompt: 'Pixel art icon, chemical bottle with skull label, toxic, dark background' },
  { id: 'media_4', name: '诡异照片', level: 4, icon: 'Image', color: 'text-white', category: ItemCategory.MEDIA, imagePrompt: 'Pixel art icon, black and white photo of a ghost in hallway, dark background' },
  { id: 'media_5', name: '灵异录像', level: 5, icon: 'Video', color: 'text-slate-900', category: ItemCategory.MEDIA, imagePrompt: 'Pixel art icon, vhs cassette tape, cursed label, dark background' },
  { id: 'media_6', name: '录音机', level: 6, icon: 'Mic', color: 'text-slate-400', category: ItemCategory.MEDIA, imagePrompt: 'Pixel art icon, old tape recorder, evp session, dark background' },
  { id: 'media_7', name: '电视雪花', level: 7, icon: 'Tv', color: 'text-slate-200', category: ItemCategory.MEDIA, imagePrompt: 'Pixel art icon, old tv set displaying static noise, poltergeist, dark background' },
];

// Chain 7: Alchemy (Produced by Lab)
export const ALCHEMY_CHAIN: MergeItemDef[] = [
  { id: 'alch_1', name: '空试管', level: 1, icon: 'TestTube', color: 'text-white', category: ItemCategory.ALCHEMY, imagePrompt: 'Pixel art icon, empty glass test tube, dark background' },
  { id: 'alch_2', name: '水银', level: 2, icon: 'Disc', color: 'text-slate-300', category: ItemCategory.ALCHEMY, imagePrompt: 'Pixel art icon, puddle of liquid metal mercury, shiny, dark background' },
  { id: 'alch_3', name: '硫磺', level: 3, icon: 'Cloud', color: 'text-yellow-400', category: ItemCategory.ALCHEMY, imagePrompt: 'Pixel art icon, pile of yellow sulfur powder, alchemy, dark background' },
  { id: 'alch_4', name: '绿色粘液', level: 4, icon: 'Droplet', color: 'text-green-500', category: ItemCategory.ALCHEMY, imagePrompt: 'Pixel art icon, oozing green slime blob, radioactive, dark background' },
  { id: 'alch_5', name: '沸腾烧瓶', level: 5, icon: 'FlaskConical', color: 'text-purple-500', category: ItemCategory.ALCHEMY, imagePrompt: 'Pixel art icon, conical flask with bubbling purple liquid, dark background' },
  { id: 'alch_6', name: '贤者碎片', level: 6, icon: 'Gem', color: 'text-red-600', category: ItemCategory.ALCHEMY, imagePrompt: 'Pixel art icon, fragment of the philosophers stone, glowing red, dark background' },
  { id: 'alch_7', name: '永生药剂', level: 7, icon: 'Wine', color: 'text-yellow-500', category: ItemCategory.ALCHEMY, imagePrompt: 'Pixel art icon, ornate bottle with golden glowing liquid, elixir of life, dark background' },
];

// Generators
export const GENERATOR_ARCHIVE_DEF: MergeItemDef = {
  id: 'gen_archive', name: '尘封档案馆', level: 1, icon: 'Archive', color: 'text-amber-700', category: ItemCategory.GENERATOR_ARCHIVE,
  imagePrompt: 'A pixel art icon of a dusty old filing cabinet overflowing with papers, cobwebs, mysterious, dark background'
};

export const GENERATOR_ALTAR_DEF: MergeItemDef = {
  id: 'gen_altar', name: '诅咒祭坛', level: 1, icon: 'Ghost', color: 'text-purple-600', category: ItemCategory.GENERATOR_ALTAR,
  imagePrompt: 'A pixel art icon of a small stone altar with runic carvings and blood stains, occult horror, dark background'
};

export const GENERATOR_TOOLBOX_DEF: MergeItemDef = {
  id: 'gen_toolbox', name: '破旧工具箱', level: 1, icon: 'Briefcase', color: 'text-slate-600', category: ItemCategory.GENERATOR_TOOLBOX,
  imagePrompt: 'Pixel art icon, rusty metal toolbox, open, tools spilling out, horror atmosphere'
};

export const GENERATOR_GREENHOUSE_DEF: MergeItemDef = {
  id: 'gen_greenhouse', name: '腐烂温室', level: 1, icon: 'Sprout', color: 'text-green-900', category: ItemCategory.GENERATOR_GREENHOUSE,
  imagePrompt: 'Pixel art icon, small glass terrarium with dead plants and fog inside, horror atmosphere'
};

export const GENERATOR_MORGUE_DEF: MergeItemDef = {
  id: 'gen_morgue', name: '停尸房冷柜', level: 1, icon: 'Refrigerator', color: 'text-cyan-800', category: ItemCategory.GENERATOR_MORGUE,
  imagePrompt: 'Pixel art icon, metal morgue drawer door, slightly open, cold mist escaping, horror'
};

export const GENERATOR_DARKROOM_DEF: MergeItemDef = {
  id: 'gen_darkroom', name: '幽灵暗房', level: 1, icon: 'Camera', color: 'text-red-900', category: ItemCategory.GENERATOR_DARKROOM,
  imagePrompt: 'Pixel art icon, red safety light bulb for photography darkroom, hanging wire, horror'
};

export const GENERATOR_LAB_DEF: MergeItemDef = {
  id: 'gen_lab', name: '炼金实验台', level: 1, icon: 'FlaskRound', color: 'text-blue-900', category: ItemCategory.GENERATOR_LAB,
  imagePrompt: 'Pixel art icon, wooden chemistry table with retorts and burners, frankenstein lab style'
};


// --- INITIAL TASKS ---

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    description: '搜索尘埃',
    requiredItemName: '积灰',
    requiredLevel: 1,
    requiredCategory: ItemCategory.CLUE,
    rewardStars: 1,
    rewardExp: 10,
    storyContext: '你在黑暗的走廊中醒来。角落里似乎有什么东西在动。',
  },
  {
    id: 't2',
    description: '寻找光源',
    requiredItemName: '黑蜡烛',
    requiredLevel: 1,
    requiredCategory: ItemCategory.OCCULT,
    rewardStars: 1,
    rewardExp: 15,
    storyContext: '太黑了，什么都看不见。你需要点燃蜡烛，哪怕是一根被诅咒的蜡烛。',
  },
  {
    id: 't3',
    description: '装备防身',
    requiredItemName: '锈蚀螺丝',
    requiredLevel: 1,
    requiredCategory: ItemCategory.SURVIVAL,
    rewardStars: 1,
    rewardExp: 15,
    storyContext: '这房子里不仅有鬼，也许还有更糟的。找点工具防身。',
  },
];

export const GRID_ROWS = 7;
export const GRID_COLS = 6;
