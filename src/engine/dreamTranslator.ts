import { EmotionType } from './storylines'

// 关键词映射规则
const KEYWORD_RULES: Record<EmotionType, string[]> = {
  exhaustion: [
    '累', '疲惫', ' tired ', '撑不住', '压力大', 'burnout', '精疲力尽', '力不从心',
    '喘不过气', '超负荷', '加班', '熬夜', '休息不够', '身体被掏空', '不想动',
    '能量耗尽', '扛不动', '太重了', '负荷', '透支',
  ],
  anxiety: [
    '焦虑', '担心', '怕', '恐惧', '紧张', '不安', '慌', '焦虑症',
    '做不好', '怕失败', '失望', '评判', '表现', '够好', '不确定',
    '心跳', '失眠', '胡思乱想', ' worst ', '最坏', '后果',
  ],
  confusion: [
    '迷茫', '不知道', '方向', '选择', '怎么办', '未来', '前途',
    '困惑', '纠结', '犹豫', '十字路口', '下一步', '目标',
    '不知道做什么', '找不到方向', '失去方向', '何去何从', '意义',
  ],
  loneliness: [
    '孤独', '孤单', '一个人', '没人理解', '说不出', '无人倾诉',
    '寂寞', '不合群', '疏远', '隔阂', '距离', '没人听',
    '心里话', '难以启齿', '无法表达', '沉默', '封闭',
  ],
  relationship: [
    '关系', '吵架', '分手', '冷战', '矛盾', '沟通', '误解',
    '感情', '伴侣', '朋友', '家人', '亲密', '信任',
    '渐行渐远', '裂痕', '伤害', '和好', '修复', '隔膜',
  ],
}

// 梦译结果接口
export interface TranslationResult {
  emotion: EmotionType
  confidence: number
  dreamPhrase: string // 梦译后的短语
}

// 预设的梦译短语映射
const DREAM_PHRASES: Record<EmotionType, string> = {
  exhaustion: '我快撑不住了',
  anxiety: '前面看不清路',
  confusion: '我不知道该往哪走',
  loneliness: '有句话没有送出去',
  relationship: '我们之间隔着什么',
}

/**
 * 梦译引擎核心函数
 * 输入用户的原始文本，输出情绪分类和梦译结果
 */
export function translateInput(input: string): TranslationResult {
  const text = input.toLowerCase().trim()

  if (!text || text.length < 2) {
    // 默认返回迷茫（最通用的情绪）
    return {
      emotion: 'confusion',
      confidence: 0.3,
      dreamPhrase: DREAM_PHRASES.confusion,
    }
  }

  // 计算每种情绪的匹配分数
  const scores: Record<string, number> = {}

  for (const [emotion, keywords] of Object.entries(KEYWORD_RULES)) {
    let score = 0
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += keyword.length > 4 ? 2 : 1 // 长关键词权重更高
      }
    }
    scores[emotion] = score
  }

  // 找出最高分的情绪
  let bestEmotion: EmotionType = 'confusion'
  let bestScore = 0
  let totalScore = 0

  for (const [emotion, score] of Object.entries(scores)) {
    totalScore += score
    if (score > bestScore) {
      bestScore = score
      bestEmotion = emotion as EmotionType
    }
  }

  // 计算置信度
  const confidence = totalScore > 0 ? bestScore / totalScore : 0.3

  return {
    emotion: bestEmotion,
    confidence: Math.min(confidence, 1),
    dreamPhrase: DREAM_PHRASES[bestEmotion],
  }
}
