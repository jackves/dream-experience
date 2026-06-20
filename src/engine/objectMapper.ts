import { EmotionType, DreamObject, StorylineConfig } from './storylines'
import { STORYLINES } from './storylines'

/**
 * 物件映射器
 * 根据当前情绪类型和场景阶段，返回对应的物件配置
 */
export function getObjectForPhase(
  emotion: EmotionType,
  phase: 'platform' | 'carriage'
): DreamObject {
  const storyline = STORYLINES[emotion]

  switch (phase) {
    case 'platform':
      return storyline.platform.object
    case 'carriage':
      return storyline.carriage.object
    default:
      return storyline.platform.object
  }
}

/**
 * 获取完整故事线配置
 */
export function getStoryline(emotion: EmotionType): StorylineConfig {
  return STORYLINES[emotion]
}

/**
 * 获取物件回应文本
 */
export function getObjectResponse(
  emotion: EmotionType,
  phase: 'platform' | 'carriage'
): string {
  const storyline = STORYLINES[emotion]
  switch (phase) {
    case 'platform':
      return storyline.platform.object.responseText
    case 'carriage':
      return storyline.carriage.object.responseText
    default:
      return ''
  }
}
