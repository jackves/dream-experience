import { create } from 'zustand'
import { EmotionType, DreamObject } from '../engine/storylines'

// 梦境阶段类型
export type DreamPhase = 'intro' | 'entrance' | 'platform' | 'carriage' | 'letterbox' | 'awakening'

// 梦境状态接口
interface DreamState {
  // 当前阶段
  currentPhase: DreamPhase
  isTransitioning: boolean

  // 用户输入
  userInput: string
  translatedEmotion: EmotionType | null
  dreamPhrase: string

  // 收集的物件
  collectedObjects: DreamObject[]

  // 各阶段交互状态
  phase1Collected: boolean   // 站台物件已收集
  phase2Interacted: boolean  // 车厢物件已交互
  phase3Deposited: boolean   // 信箱已投递

  // Actions
  setUserInput: (input: string) => void
  setTranslation: (emotion: EmotionType, phrase: string) => void
  collectObject: (obj: DreamObject) => void
  setPhase1Complete: () => void
  setPhase2Complete: () => void
  setPhase3Complete: () => void
  nextPhase: () => void
  resetDream: () => void
  setTransitioning: (val: boolean) => void
}

// 阶段顺序
const PHASE_ORDER: DreamPhase[] = ['intro', 'entrance', 'platform', 'carriage', 'letterbox', 'awakening']

export const useDreamStore = create<DreamState>((set) => ({
  // 初始状态
  currentPhase: 'intro',
  isTransitioning: false,

  userInput: '',
  translatedEmotion: null,
  dreamPhrase: '',

  collectedObjects: [],

  phase1Collected: false,
  phase2Interacted: false,
  phase3Deposited: false,

  // Actions
  setUserInput: (input) => set({ userInput: input }),

  setTranslation: (emotion, phrase) =>
    set({
      translatedEmotion: emotion,
      dreamPhrase: phrase,
    }),

  collectObject: (obj) =>
    set((state) => ({
      collectedObjects: [...state.collectedObjects, obj],
    })),

  setPhase1Complete: () => set({ phase1Collected: true }),
  setPhase2Complete: () => set({ phase2Interacted: true }),
  setPhase3Complete: () => set({ phase3Deposited: true }),

  nextPhase: () =>
    set((state) => {
      const currentIndex = PHASE_ORDER.indexOf(state.currentPhase)
      if (currentIndex < PHASE_ORDER.length - 1) {
        return {
          currentPhase: PHASE_ORDER[currentIndex + 1],
          isTransitioning: true,
        }
      }
      return state
    }),

  resetDream: () =>
    set({
      currentPhase: 'intro',
      isTransitioning: false,
      userInput: '',
      translatedEmotion: null,
      dreamPhrase: '',
      collectedObjects: [],
      phase1Collected: false,
      phase2Interacted: false,
      phase3Deposited: false,
    }),

  setTransitioning: (val) => set({ isTransitioning: val }),
}))
