import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDreamStore } from '../../store/dreamStore'

// 粒子组件
const ParticleField: React.FC = () => {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 5,
      opacity: Math.random() * 0.4 + 0.1,
    })),
  [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-dream-amber/30"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// 入口页场景
const EntranceScene: React.FC = () => {
  const { userInput, setUserInput, setTranslation, nextPhase, translatedEmotion } = useDreamStore()
  const [isReady, setIsReady] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // 动态导入梦译引擎（避免循环依赖问题）
  const handleEnter = async () => {
    if (!userInput.trim()) return
    const { translateInput } = await import('../../engine/dreamTranslator')
    const result = translateInput(userInput)
    setTranslation(result.emotion, result.dreamPhrase)
    nextPhase()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim()) {
      handleEnter()
    }
  }

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #111827 50%, #0f172a 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1.5 }}
    >
      {/* 粒子背景 */}
      <ParticleField />

      {/* 中心渐变光晕 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[400px] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(ellipse, rgba(212,165,116,0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* 主内容区 */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-6">
        {/* 标题区域 */}
        <AnimatePresence>
          {isReady && (
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              {/* 主标题 */}
              <h1 className="font-dream text-white/90 text-2xl md:text-3xl tracking-[0.3em] text-center">
                梦境边缘
              </h1>

              {/* 副标题 */}
              <p className="text-white/30 text-sm tracking-[0.2em] font-light">
                THE EDGE OF DREAMS
              </p>

              {/* 分隔线 */}
              <motion.div
                className="w-16 h-px bg-gradient-to-r from-transparent via-dream-amber/30 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 输入区域 */}
        <AnimatePresence>
          {isReady && (
            <motion.div
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <p className="text-white/40 text-sm tracking-widest font-light">
                写下一件压在你心里的事
              </p>

              <div className={`relative transition-all duration-500 ${inputFocused ? 'transform -translate-y-1' : ''}`}>
                <input
                  type="text"
                  className="dream-input text-center"
                  placeholder=""
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={handleKeyDown}
                  maxLength={80}
                />
                {/* 下划线光效 */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-dream-amber/50"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: inputFocused ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* 提示文字 */}
              {!userInput && (
                <motion.p
                  className="text-white/15 text-xs italic font-serif"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  不用想太多，写下第一反应就好
                </motion.p>
              )}

              {/* 进入按钮 */}
              <AnimatePresence>
                {userInput.trim().length > 0 && (
                  <motion.button
                    className="continue-btn"
                    onClick={handleEnter}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    进入梦境
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-transparent to-dream-amber/20"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
      </div>
    </motion.div>
  )
}

export default EntranceScene
