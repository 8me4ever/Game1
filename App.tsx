
import React, { useState, useEffect, useRef } from 'react';
import { 
  GameState, GridSlot, ItemCategory, MergeItemDef, Task, LogEntry 
} from './types';
import { 
  GRID_ROWS, GRID_COLS, CLUE_CHAIN, OCCULT_CHAIN, SURVIVAL_CHAIN, FLORA_CHAIN, ANATOMY_CHAIN, MEDIA_CHAIN, ALCHEMY_CHAIN,
  GENERATOR_ARCHIVE_DEF, GENERATOR_ALTAR_DEF, GENERATOR_TOOLBOX_DEF, GENERATOR_GREENHOUSE_DEF, GENERATOR_MORGUE_DEF, GENERATOR_DARKROOM_DEF, GENERATOR_LAB_DEF,
  INITIAL_TASKS,
} from './constants';
import { MergeTile } from './components/MergeTile';
import { RenovationView } from './components/RenovationView';
import { generateTaskCompletionText, generateNextTask, generateItemIcon } from './services/geminiService';
import { Sparkles, ScrollText, BookOpen, Ghost, Loader2, AlertTriangle } from 'lucide-react';
import * as Icons from 'lucide-react';

// Helper for initial state to ensure inventory is populated before first render
const createInitialInventory = () => {
  const inventory: Record<string, GridSlot> = {};
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const id = `${r}-${c}`;
      inventory[id] = { id, item: null, isLocked: false };
    }
  }
  // Place 7 Generators (Row 0 full, + 1 on Row 1)
  inventory['0-0'].item = { ...GENERATOR_ARCHIVE_DEF };
  inventory['0-1'].item = { ...GENERATOR_ALTAR_DEF };
  inventory['0-2'].item = { ...GENERATOR_TOOLBOX_DEF };
  inventory['0-3'].item = { ...GENERATOR_GREENHOUSE_DEF };
  inventory['0-4'].item = { ...GENERATOR_MORGUE_DEF };
  inventory['0-5'].item = { ...GENERATOR_DARKROOM_DEF };
  inventory['1-0'].item = { ...GENERATOR_LAB_DEF };
  
  return inventory;
};

const App: React.FC = () => {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>({
    stars: 0,
    level: 1,
    exp: 0,
    inventory: createInitialInventory(),
    tasks: INITIAL_TASKS,
    storyChapter: 1
  });

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([{ id: 'init', text: "这间屋子充满了死气。你需要利用一切手段活下去...", type: "system" }]);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); 

  // --- ASSET GENERATION STATE ---
  // Cache for generated images: itemId -> base64Url
  const [itemImages, setItemImages] = useState<Record<string, string>>({});
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  const generationQueueRef = useRef<MergeItemDef[]>([]);
  const retryDelayRef = useRef(3000); // Start with 3s delay

  // --- ASSET MANAGER ---
  // On mount, queue up all item definitions for image generation if they don't exist
  useEffect(() => {
    const allItems = [
      GENERATOR_ARCHIVE_DEF, GENERATOR_ALTAR_DEF, GENERATOR_TOOLBOX_DEF, GENERATOR_GREENHOUSE_DEF, 
      GENERATOR_MORGUE_DEF, GENERATOR_DARKROOM_DEF, GENERATOR_LAB_DEF,
      ...CLUE_CHAIN, ...OCCULT_CHAIN, ...SURVIVAL_CHAIN, ...FLORA_CHAIN, ...ANATOMY_CHAIN, ...MEDIA_CHAIN, ...ALCHEMY_CHAIN
    ];
    
    // Only queue items we haven't generated yet
    const needed = allItems.filter(item => !itemImages[item.id]);
    
    if (needed.length > 0 && generationQueueRef.current.length === 0) {
      generationQueueRef.current = needed;
      processGenerationQueue();
    }
  }, []); // Run once on mount

  const processGenerationQueue = async () => {
    if (isGeneratingAssets || generationQueueRef.current.length === 0) return;

    setIsGeneratingAssets(true);
    // Peek at the first item, don't remove yet in case of error
    const itemToGen = generationQueueRef.current[0];

    try {
      const imageUrl = await generateItemIcon(itemToGen.imagePrompt);
      
      if (imageUrl) {
        setItemImages(prev => ({ ...prev, [itemToGen.id]: imageUrl }));
      }

      // Success! Remove from queue and reset delay
      generationQueueRef.current.shift();
      retryDelayRef.current = 3000; 
      setIsRateLimited(false);

      setIsGeneratingAssets(false);

      // Continue queue with standard delay
      if (generationQueueRef.current.length > 0) {
        setTimeout(() => processGenerationQueue(), retryDelayRef.current);
      }
    } catch (error: any) {
      // Handle Rate Limits (429)
      console.warn(`Rate limit hit (or error). Backing off for ${retryDelayRef.current}ms...`);
      setIsRateLimited(true);
      setIsGeneratingAssets(false);
      
      // Exponential Backoff: double delay, cap at 60s
      const nextDelay = Math.min(retryDelayRef.current * 2, 60000);
      retryDelayRef.current = nextDelay;

      // Retry the SAME item after delay
      setTimeout(() => processGenerationQueue(), nextDelay);
    }
  };


  // --- HELPERS ---
  const addLog = (text: string, type: 'story' | 'system' = 'system') => {
    setLogs(prev => [{ id: Date.now().toString(), text, type }, ...prev].slice(0, 5));
  };

  const getSlot = (id: string) => gameState.inventory[id];
  
  const findEmptySlot = (): string | null => {
    const ids = Object.keys(gameState.inventory);
    for (const id of ids) {
      if (!gameState.inventory[id].item) return id;
    }
    return null;
  };

  const getMergeChain = (category: ItemCategory): MergeItemDef[] | null => {
    switch(category) {
      case ItemCategory.CLUE: return CLUE_CHAIN;
      case ItemCategory.OCCULT: return OCCULT_CHAIN;
      case ItemCategory.SURVIVAL: return SURVIVAL_CHAIN;
      case ItemCategory.FLORA: return FLORA_CHAIN;
      case ItemCategory.ANATOMY: return ANATOMY_CHAIN;
      case ItemCategory.MEDIA: return MEDIA_CHAIN;
      case ItemCategory.ALCHEMY: return ALCHEMY_CHAIN;
      default: return null;
    }
  };

  // --- CORE MECHANICS ---

  const handleSlotClick = (id: string) => {
    const slot = getSlot(id);
    if (!slot) return;

    if (selectedSlotId) {
      if (selectedSlotId === id) {
        setSelectedSlotId(null);
      } else {
        handleMoveOrMerge(selectedSlotId, id);
        setSelectedSlotId(null);
      }
      return;
    }

    if (slot.item) {
      // Check if item is a generator
      if (slot.item.id.startsWith('gen_')) {
        handleGeneratorClick(slot.item);
      } else {
        setSelectedSlotId(id);
      }
    }
  };

  const handleGeneratorClick = (generator: MergeItemDef) => {
    const emptySlotId = findEmptySlot();
    if (!emptySlotId) {
      addLog("面板已满。合成物品以腾出空间。", "system");
      return;
    }

    let spawnedItem: MergeItemDef | undefined;

    switch(generator.category) {
      case ItemCategory.GENERATOR_ARCHIVE: spawnedItem = { ...CLUE_CHAIN[0] }; break;
      case ItemCategory.GENERATOR_ALTAR: spawnedItem = { ...OCCULT_CHAIN[0] }; break;
      case ItemCategory.GENERATOR_TOOLBOX: spawnedItem = { ...SURVIVAL_CHAIN[0] }; break;
      case ItemCategory.GENERATOR_GREENHOUSE: spawnedItem = { ...FLORA_CHAIN[0] }; break;
      case ItemCategory.GENERATOR_MORGUE: spawnedItem = { ...ANATOMY_CHAIN[0] }; break;
      case ItemCategory.GENERATOR_DARKROOM: spawnedItem = { ...MEDIA_CHAIN[0] }; break;
      case ItemCategory.GENERATOR_LAB: spawnedItem = { ...ALCHEMY_CHAIN[0] }; break;
    }

    if (!spawnedItem) return;

    spawnedItem = { ...spawnedItem, id: `${spawnedItem.id}_${Date.now()}` };

    setGameState(prev => {
      const newInventory = { ...prev.inventory };
      newInventory[emptySlotId] = { ...newInventory[emptySlotId], item: spawnedItem! };
      return {
        ...prev,
        inventory: newInventory
      };
    });
  };

  const handleMoveOrMerge = (sourceId: string, targetId: string) => {
    const sourceSlot = getSlot(sourceId);
    const targetSlot = getSlot(targetId);

    if (!sourceSlot?.item) return;

    // Move
    if (!targetSlot.item) {
      setGameState(prev => {
        const inv = { ...prev.inventory };
        inv[targetId] = { ...inv[targetId], item: sourceSlot.item };
        inv[sourceId] = { ...inv[sourceId], item: null };
        return { ...prev, inventory: inv };
      });
      return;
    }

    // Merge
    const sourceItem = sourceSlot.item;
    const targetItem = targetSlot.item;

    const isSameCategory = sourceItem.category === targetItem.category;
    const isSameLevel = sourceItem.level === targetItem.level;
    // Generators don't merge in this version
    const isGenerator = sourceItem.id.startsWith('gen_');
    
    if (isGenerator) {
       // Swap if target is also item/generator
       setGameState(prev => {
        const inv = { ...prev.inventory };
        inv[targetId] = { ...inv[targetId], item: sourceItem };
        inv[sourceId] = { ...inv[sourceId], item: targetItem };
        return { ...prev, inventory: inv };
      });
      return;
    }

    const chain = getMergeChain(sourceItem.category);
    const isMaxLevel = chain ? sourceItem.level >= chain.length : true;

    if (isSameCategory && isSameLevel && !isMaxLevel) {
      if (!chain) return;

      const nextLevelItemDef = chain.find(i => i.level === sourceItem.level + 1);
      if (nextLevelItemDef) {
        const newItem = { ...nextLevelItemDef, id: `${nextLevelItemDef.id}_${Date.now()}` };
        
        setGameState(prev => {
          const inv = { ...prev.inventory };
          inv[targetId] = { ...inv[targetId], item: newItem };
          inv[sourceId] = { ...inv[sourceId], item: null };
          return { ...prev, inventory: inv, exp: prev.exp + 5 };
        });
      }
    } else {
      // Swap
      setGameState(prev => {
        const inv = { ...prev.inventory };
        inv[targetId] = { ...inv[targetId], item: sourceItem };
        inv[sourceId] = { ...inv[sourceId], item: targetItem };
        return { ...prev, inventory: inv };
      });
    }
  };

  // --- TASK LOGIC ---

  const checkTaskCompletion = async (task: Task) => {
    const invIds = Object.keys(gameState.inventory);
    let foundSlotId: string | null = null;

    for (const id of invIds) {
      const item = gameState.inventory[id].item;
      if (item && item.category === task.requiredCategory && item.level === task.requiredLevel) {
        foundSlotId = id;
        break;
      }
    }

    if (foundSlotId) {
      setIsProcessing(true);
      
      setGameState(prev => {
        const inv = { ...prev.inventory };
        inv[foundSlotId!] = { ...inv[foundSlotId!], item: null };
        return {
          ...prev,
          stars: prev.stars + task.rewardStars,
          exp: prev.exp + task.rewardExp,
          inventory: inv,
          tasks: prev.tasks.filter(t => t.id !== task.id)
        };
      });

      setCompletedTasksCount(c => c + 1);

      const flavorText = await generateTaskCompletionText(task);
      addLog(flavorText, "story");

      if (gameState.tasks.length <= 3) {
        const newDesc = await generateNextTask(gameState.level);
        if (newDesc && newDesc.description) {
           // Randomly select one of the 7 categories
           const categories = [
             ItemCategory.CLUE, ItemCategory.OCCULT, ItemCategory.SURVIVAL, 
             ItemCategory.FLORA, ItemCategory.ANATOMY, ItemCategory.MEDIA, ItemCategory.ALCHEMY
           ];
           const randomCat = categories[Math.floor(Math.random() * categories.length)];
           const chain = getMergeChain(randomCat);
           const level = Math.floor(Math.random() * 4) + 1;
           
           const newTask: Task = {
             id: `gen_task_${Date.now()}`,
             description: newDesc.description || "未知的恐惧",
             requiredCategory: randomCat,
             requiredLevel: level, 
             requiredItemName: "物品",
             rewardStars: 1,
             rewardExp: 15,
             storyContext: newDesc.storyContext || "阴影在蠕动。"
           };
           
           const targetItem = chain?.find(i => i.level === newTask.requiredLevel);
           if (targetItem) newTask.requiredItemName = targetItem.name;

           setGameState(prev => ({
             ...prev,
             tasks: [...prev.tasks, newTask]
           }));
        }
      }
      setIsProcessing(false);
    } else {
      addLog(`缺少: 等级 ${task.requiredLevel} ${task.requiredItemName}`, "system");
    }
  };


  // --- RENDER ---

  const gridElements = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const id = `${r}-${c}`;
      const slot = gameState.inventory[id];
      const isSelected = selectedSlotId === id;
      
      // Resolve image if exists
      let imageUrl = undefined;
      if (slot?.item) {
        let chain: MergeItemDef[] | undefined;
        if (slot.item.category === ItemCategory.CLUE) chain = CLUE_CHAIN;
        else if (slot.item.category === ItemCategory.OCCULT) chain = OCCULT_CHAIN;
        else if (slot.item.category === ItemCategory.SURVIVAL) chain = SURVIVAL_CHAIN;
        else if (slot.item.category === ItemCategory.FLORA) chain = FLORA_CHAIN;
        else if (slot.item.category === ItemCategory.ANATOMY) chain = ANATOMY_CHAIN;
        else if (slot.item.category === ItemCategory.MEDIA) chain = MEDIA_CHAIN;
        else if (slot.item.category === ItemCategory.ALCHEMY) chain = ALCHEMY_CHAIN;
        else if (slot.item.category === ItemCategory.GENERATOR_ARCHIVE) chain = [GENERATOR_ARCHIVE_DEF];
        else if (slot.item.category === ItemCategory.GENERATOR_ALTAR) chain = [GENERATOR_ALTAR_DEF];
        else if (slot.item.category === ItemCategory.GENERATOR_TOOLBOX) chain = [GENERATOR_TOOLBOX_DEF];
        else if (slot.item.category === ItemCategory.GENERATOR_GREENHOUSE) chain = [GENERATOR_GREENHOUSE_DEF];
        else if (slot.item.category === ItemCategory.GENERATOR_MORGUE) chain = [GENERATOR_MORGUE_DEF];
        else if (slot.item.category === ItemCategory.GENERATOR_DARKROOM) chain = [GENERATOR_DARKROOM_DEF];
        else if (slot.item.category === ItemCategory.GENERATOR_LAB) chain = [GENERATOR_LAB_DEF];
        
        const def = chain?.find(i => i.level === slot.item!.level);
        if (def && itemImages[def.id]) {
            imageUrl = itemImages[def.id];
        }
      }

      gridElements.push(
        <div key={id} className="aspect-square p-1">
          <div className={`w-full h-full rounded-lg bg-slate-900 border ${isSelected ? 'border-red-500' : 'border-slate-800'} shadow-inner`}>
            {slot && slot.item && (
              <MergeTile 
                item={slot.item} 
                isSelected={isSelected}
                onClick={() => handleSlotClick(id)}
                imageUrl={imageUrl}
              />
            )}
            {(!slot || !slot.item) && (
              <div 
                onClick={() => handleSlotClick(id)}
                className="w-full h-full cursor-pointer hover:bg-slate-800/30 transition-colors rounded-lg"
              />
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 max-w-md mx-auto shadow-2xl overflow-hidden relative font-serif">
      
      {/* HEADER: STORY VIEW */}
      <RenovationView stars={gameState.stars} completedTaskCount={completedTasksCount} />

      {/* SUB-HEADER: LOGS ONLY (Energy Removed) */}
      <div className="flex-none p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10 shadow-md">
        <div className="flex-1 text-center h-8 overflow-hidden flex flex-col justify-center">
             {logs[0] && (
               <span className={`animate-fade-in text-sm ${logs[0].type === 'story' ? 'text-red-400 italic font-serif' : 'text-slate-500'}`}>
                 "{logs[0].text}"
               </span>
             )}
        </div>
        {/* Loading Indicator for Asset Gen */}
        {(generationQueueRef.current.length > 0 || isGeneratingAssets) && (
            <div className="absolute right-2 top-2" title={isRateLimited ? "API 限制，等待中..." : "正在生成资源..."}>
                {isRateLimited ? (
                    <AlertTriangle size={12} className="text-orange-500 animate-pulse" />
                ) : (
                    <Loader2 size={12} className="animate-spin text-slate-600"/>
                )}
            </div>
        )}
      </div>

      {/* MAIN CONTENT AREA: TASKS + GRID */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-black">
        
        {/* TASKS SCROLL */}
        <div className="flex-none h-36 bg-slate-900/90 border-b border-slate-800 p-2 flex space-x-3 overflow-x-auto hide-scrollbar items-center backdrop-blur-md">
            {gameState.tasks.length === 0 && (
               <div className="w-full text-center text-slate-600 text-sm font-creep tracking-widest">死寂...</div>
            )}
            {gameState.tasks.map(task => {
               const canComplete = Object.values(gameState.inventory).some(
                 (s: GridSlot) => s.item?.category === task.requiredCategory && s.item?.level === task.requiredLevel
               );

               return (
                 <div key={task.id} className="flex-none w-60 h-full bg-slate-800 rounded-sm border border-slate-700 p-3 flex flex-col justify-between relative group shadow-lg">
                    <div className="flex justify-between items-start">
                       <h3 className="text-sm font-bold text-slate-300 leading-tight font-serif">{task.description}</h3>
                       <div className="bg-slate-950 text-red-400 text-xs px-2 py-1 border border-red-900/30 flex items-center">
                          <span className="font-bold font-creep tracking-wider text-sm">+{task.rewardStars}</span> <Sparkles size={10} className="ml-1"/>
                       </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2 border-t border-slate-700/50 pt-2">
                        <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center">
                           <div className="text-[10px] text-slate-500 text-center leading-none">
                             {task.requiredCategory === ItemCategory.CLUE && "线索"}
                             {task.requiredCategory === ItemCategory.OCCULT && "玄学"}
                             {task.requiredCategory === ItemCategory.SURVIVAL && "生存"}
                             {task.requiredCategory === ItemCategory.FLORA && "植物"}
                             {task.requiredCategory === ItemCategory.ANATOMY && "肢体"}
                             {task.requiredCategory === ItemCategory.MEDIA && "媒介"}
                             {task.requiredCategory === ItemCategory.ALCHEMY && "炼金"}
                           </div>
                        </div>
                        <div className="text-xs text-slate-500">
                           需要: <span className="font-semibold text-slate-300">{task.requiredItemName} (Lv {task.requiredLevel})</span>
                        </div>
                    </div>

                    <button 
                      onClick={() => checkTaskCompletion(task)}
                      disabled={!canComplete || isProcessing}
                      className={`
                        w-full mt-2 py-1 text-xs font-bold flex items-center justify-center space-x-1 transition-all border uppercase tracking-wider
                        ${canComplete 
                          ? 'bg-red-900/80 border-red-700 text-red-100 shadow-[0_0_10px_rgba(153,27,27,0.4)] hover:bg-red-800' 
                          : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'}
                      `}
                    >
                      {isProcessing ? '...' : (canComplete ? '驱魔' : '搜寻中...')}
                    </button>
                 </div>
               );
            })}
        </div>

        {/* GRID CONTAINER */}
        <div className="flex-1 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black p-2 overflow-y-auto">
           <div 
             className="grid grid-cols-6 gap-1 mx-auto"
             style={{ maxWidth: '100%', aspectRatio: '6/7' }}
           >
              {gridElements}
           </div>
           
           <div className="text-center mt-4 text-xs text-slate-600 font-creep tracking-wider opacity-50">
              秘密藏在 7 个诅咒源头之中...
           </div>
        </div>

      </div>
      
      {/* Bottom Nav */}
      <div className="h-12 bg-slate-900 border-t border-slate-800 flex items-center justify-around text-slate-600 relative">
         <div className="flex flex-col items-center cursor-pointer text-red-900 hover:text-red-700">
            <ScrollText size={20} />
            <span className="text-[10px] uppercase tracking-widest">日记</span>
         </div>
         <div className="flex flex-col items-center cursor-pointer hover:text-slate-400">
            <BookOpen size={20} />
            <span className="text-[10px] uppercase tracking-widest">魔导书</span>
         </div>
      </div>

    </div>
  );
};

export default App;
