import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDreamStore } from '../../store/dreamStore'
import { getStoryline } from '../../engine/objectMapper'

// 信箱 SVG
const LetterboxSVG: React.FC<{ deposited: boolean }> = ({ deposited }) => (
  <svg viewBox="0 0 100 120" className="w-28 h-36 md:w-36 md:h-44 transition-all duration-700" fill="none" stroke="currentColor">
    {/* 信箱主体 */}
    <rect x="20" y="25" width="60" height="80" rx="3" strokeWidth="1.5" className="text-white/15" fill="rgba(212,180,140,0.03)" />
    {/* 投递口 */}
    <rect x="30" y="40" width="40" height="6" rx="1" strokeWidth="1" className={`transition-colors duration-500 ${deposited ? 'text-dream-amber/50' : 'text-white/10'}`} fill={deposited ? 'rgba(212,165,116,0.08)' : 'rgba(255,255,255,0.02)'} />
    {/* 顶盖 */}
    <path d="M17 25L50 12L83 25" strokeWidth="1.2" className="text-white/12" />
    {/* 装饰线 */}
    <line x1="27" y1="58" x2="73" y2="58" strokeWidth="0.5" className="text-white/8" />
    <line x1="27" y1="70" x2="73" y2="70" strokeWidth="0.5" className="text-white/6" />
    <line x1="27" y1="82" x2="73" y2="82" strokeWidth="0.5" className="text-white/4" />
    {/* 支架 */}
    <line x1="28" y1="105" x2="24" y2="115" strokeWidth="1.2" className="text-white/12" />
    <line x1="72" y1="105" x2="76" y2="115" strokeWidth="1.2" className="text-white/12" />

    {/* 投递后的光效 */}
    {deposited && (
      <motion.rect
        x="30"
        y="40"
        width="40"
        height="6"
        rx="1"
        fill="rgba(212,165,116,0.15)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    )}
  </svg>
)

// 已收集物件的小图标
const CollectedItem: React.FC<{ name: string; icon: string; index: number }> = ({ name, icon, index }) => {
  const size = 32

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.3 + 0.5 }}
    >
      <div
        className="rounded border border-dream-amber/15 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-dream-amber/35 text-xs">{name.charAt(0)}</span>
      </div>
      <span className="text-white/20 text-[10px] tracking-wider">{name}</span>
    </motion.div>
  )
}

// 第三层：失物信箱
const LetterboxScene: React.FC = () => {
  const { translatedEmotion, phase3Deposited, collectedObjects, setPhase3Complete, nextPhase, setTransitioning } = useDreamStore()
  const [showContent, setShowContent] = useState(false)
  const [deposited, setDeposited] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

  const emotion = translatedEmotion || 'confusion'
  const storyline = getStoryline(emotion)

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 1000)
    return () => clearTimeout(t1)
  }, [])

  const handleDeposit = () => {
    if (deposited || phase3Deposited) return
    setDeposited(true)

    setTimeout(() => setShowResponse(true), 1200)
    setTimeout(() => {
      setPhase3Complete()
    }, 3500)
  }

  const handleContinue = () => {
    setTransitioning(true)
    setTimeout(() => nextPhase(), 300)
  }

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1a1510 0%, #1f1a14 40%, #251e16 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1.5 }}
    >
      {/* 暖色光晕背景 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, rgba(212,165,116,0.04) 0%, transparent 55%)',
        }}
      />

      {/* 玻璃反光效果 */}
      <motion.div
        className="absolute top-8 left-8 w-48 h-64 rounded-lg pointer-events-none opacity-[0.02]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,250,240,0.1) 0%, transparent 60%)',
          transform: 'rotate(-5deg)',
        }}
        animate={{ opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-lg">
        {/* 氛围文字 */}
        <AnimatePresence>
          {showContent && (
            <motion.p
              className="text-white/30 text-sm text-center leading-loose tracking-wider italic font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              {storyline.letterbox.atmosphereText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 已收集物件展示架 */}
        <AnimatePresence>
          {showContent && collectedObjects.length > 0 && (
            <motion.div
              className="flex gap-6 md:gap-10"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {collectedObjects.map((obj, i) => (
                <CollectedItem key={obj.id} name={obj.name} icon={obj.icon} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 信箱交互 */}
        <AnimatePresence>
          {showContent && !phase3Deposited && (
            <motion.button
              className="group relative cursor-pointer focus:outline-none"
              onClick={handleDeposit}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              {/* 光晕 */}
              <motion.div
                className="absolute inset-0 -m-8 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 65%)',
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <LetterboxSVG deposited={deposited} />

              {!deposited && (
                <motion.p
                  className="text-white/20 text-xs mt-3 tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  {storyline.letterbox.depositAction}
                </motion.p>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* 投递回应 */}
        <AnimatePresence>
          {showResponse && (
            <motion.div
              className="max-w-sm text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <p className="font-dream text-dream-amber/70 text-sm leading-loose tracking-wide whitespace-pre-line">
                {storyline.letterbox.depositResponse}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 继续按钮 */}
        <AnimatePresence>
          {phase3Deposited && (
            <motion.button
              className="continue-btn mt-2"
              onClick={handleContinue}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              该醒了
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 底部暖光渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(to top, rgba(26,21,16,0.95) 0%, transparent 100%)',
          }}
        />
      </div>
    </motion.div>
  )
}

export default LetterboxScene
