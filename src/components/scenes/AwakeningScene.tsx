import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDreamStore } from '../../store/dreamStore'
import { getStoryline } from '../../engine/objectMapper'

// ===== 终章收尾文字 =====
const CLOSING_REFLECTION = {
  paragraphs: [
    '刚才那场梦，其实是你自己走完的。',
    '你写下困扰，梦把它变成了物件。',
    '你触碰它，它回应你。',
    '你放下它，然后醒来。',
    '这不是魔法，也不是什么AI在替你想清楚一切。',
    '只是有时候，我们需要一个地方，把那些说不出口的东西，换一种方式看见。',
    '然后发现——原来它们没有想象中那么重。',
    '天亮了。今天的事，慢慢来就好。',
  ],
}

// 终章：晨光醒来
const AwakeningScene: React.FC = () => {
  const { translatedEmotion, resetDream } = useDreamStore()
  const [visibleTexts, setVisibleTexts] = useState<number>(0)
  const [showFinal, setShowFinal] = useState(false)
  const [visibleClosing, setVisibleClosing] = useState(0)
  const [showActions, setShowActions] = useState(false)

  const emotion = translatedEmotion || 'confusion'
  const storyline = getStoryline(emotion)
  const texts = storyline.awakening.texts

  useEffect(() => {
    // 第一阶段：逐行显示醒来文本
    let count = 0
    const interval = setInterval(() => {
      count++
      setVisibleTexts(count)
      if (count >= texts.length) {
        clearInterval(interval)
        setTimeout(() => setShowFinal(true), 1500)
        // 最终感悟显示后，开始收尾文字
        setTimeout(() => startClosingText(), 3000)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // 收尾文字逐段显现
  const startClosingText = () => {
    let count = 0
    const closingInterval = setInterval(() => {
      count++
      setVisibleClosing(count)
      if (count >= CLOSING_REFLECTION.paragraphs.length) {
        clearInterval(closingInterval)
        setTimeout(() => setShowActions(true), 2000)
      }
    }, 2200) // 每段约2.2秒，比开篇稍慢，营造沉淀感
  }

  const handleRestart = () => {
    resetDream()
  }

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0e1a 0%, #141c2e 30%, #1a2540 60%, #243048 85%, #2d3c56 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      {/* 晨光效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 85%, rgba(240,217,168,0.06) 0%, transparent 50%)' }}
        animate={{ opacity: [0.3, 0.7, 0.9] }}
        transition={{ duration: 8, ease: 'easeOut' }}
      />

      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(240,217,168,0.02) 0%, transparent 100%)' }}
        animate={{ opacity: [0, 0.5, 0.8] }}
        transition={{ duration: 6, ease: 'easeOut' }}
      />

      {/* 主内容区 - 可滚动 */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 max-w-md text-center overflow-y-auto">
        {/* ===== 第一部分：醒来文本 ===== */}
        <div className="flex flex-col gap-5 min-h-[200px]">
          {texts.map((text, index) => (
            <AnimatePresence key={index}>
              {visibleTexts > index && (
                <motion.p
                  key={index}
                  className={`font-dream ${index === texts.length - 1 ? 'text-dream-gold/70' : 'text-white/50'} text-base md:text-lg leading-relaxed tracking-wide`}
                  initial={{ opacity: 0, filter: 'blur(10px)', y: 15 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                  {text}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* ===== 第二部分：最终感悟（短句） ===== */}
        <AnimatePresence>
          {showFinal && (
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <motion.div
                className="w-16 h-px mx-auto mb-5 bg-gradient-to-r from-transparent via-dream-amber/30 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
              />
              <p className="font-dream text-dream-amber/90 text-xl md:text-2xl tracking-[0.2em] glow-text">
                {storyline.awakening.finalThought}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== 第三部分：收尾长文（解压/释然） ===== */}
        <AnimatePresence>
          {showFinal && (
            <motion.div
              className="flex flex-col gap-3 max-w-sm mt-4 pt-4 border-t border-white/[0.03]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {CLOSING_REFLECTION.paragraphs.map((text, i) => (
                <motion.p
                  key={i}
                  className={`font-dream leading-relaxed tracking-wide ${
                    i === 0 ? 'text-white/40 text-sm' :
                    i === CLOSING_REFLECTION.paragraphs.length - 1 ? 'text-white/50 text-base md:text-base' :
                    'text-white/30 text-sm'
                  }`}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={visibleClosing > i ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                  transition={{ duration: 1.2, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== 操作按钮 ===== */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              className="flex flex-col items-center gap-4 mt-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <button className="continue-btn" onClick={handleRestart}>
                再做一梦
              </button>
              <p className="text-white/12 text-xs tracking-wider mt-1">
                愿你今夜好梦
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部装饰光 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none">
        <div
          className="w-full h-full"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(240,217,168,0.04) 0%, transparent 60%)' }}
        />
      </div>
    </motion.div>
  )
}

export default AwakeningScene
