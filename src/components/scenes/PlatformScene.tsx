import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDreamStore } from '../../store/dreamStore'
import { getObjectForPhase, getStoryline } from '../../engine/objectMapper'

// 雨丝效果组件
const RainEffect: React.FC = () => {
  const drops = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 0.8 + 0.6,
    opacity: Math.random() * 0.15 + 0.05,
    length: Math.random() * 15 + 10,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
          style={{
            left: `${drop.left}%`,
            height: drop.length,
            top: -drop.length,
          }}
          animate={{
            y: [window.innerHeight + drop.length],
          }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// 物件 SVG 组件
const ObjectSVG: React.FC<{ type: string; collected?: boolean }> = ({ type, collected }) => {
  const baseClass = `w-24 h-24 md:w-32 md:h-32 transition-all duration-700 ${collected ? 'opacity-30 scale-90' : ''}`

  switch (type) {
    case 'umbrella':
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" stroke="currentColor">
          <path d="M50 85V45" strokeWidth="2" className="text-dream-amber/60" />
          <path d="M50 45C25 45 10 25 10 25C10 25 25 20 50 20C75 20 90 25 90 25C90 25 75 45 50 45Z" strokeWidth="1.5" className="text-dream-amber/70" fill="rgba(212,165,116,0.08)" />
          <path d="M22 32L28 42M38 26L41 39M50 23V40M62 26L59 39M78 32L72 42" strokeWidth="1" className="text-dream-amber/40" />
          <path d="M35 82C35 86 42 89 50 89C58 89 65 86 65 82" strokeWidth="1.5" className="text-dream-amber/50" />
        </svg>
      )
    case 'lantern':
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" stroke="currentColor">
          <line x1="50" y1="5" x2="50" y2="20" strokeWidth="2" className="text-dream-amber/40" />
          <path d="M35 20H65C68 20 70 22 70 25V65C70 73 61 80 50 80C39 80 30 73 30 65V25C30 22 32 20 35 20Z" strokeWidth="1.5" className="text-dream-amber/60" fill="rgba(212,165,116,0.06)" />
          <line x1="42" y1="80" x2="38" y2="92" strokeWidth="1.5" className="text-dream-amber/40" />
          <line x1="58" y1="80" x2="62" y2="92" strokeWidth="1.5" className="text-dream-amber/40" />
          <path d="M38 35H62M36 48H64M38 61H62" strokeWidth="0.8" className="text-dream-amber/25" />
        </svg>
      )
    case 'ticket':
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" stroke="currentColor">
          <rect x="18" y="25" width="64" height="50" rx="3" strokeWidth="1.5" className="text-dream-amber/60" fill="rgba(212,165,116,0.05)" />
          <path d="M18 40H10V60H18M82 40H90V60H82" strokeWidth="1.5" className="text-dream-amber/50" />
          <line x1="28" y1="38" x2="72" y2="38" strokeWidth="0.8" className="text-dream-amber/30" />
          <line x1="28" y1="48" x2="58" y2="48" strokeWidth="0.8" className="text-dream-amber/20" />
          <line x1="28" y1="58" x2="48" y2="58" strokeWidth="0.8" className="text-dream-amber/20" />
          <line x1="28" y1="66" x2="38" y2="66" strokeWidth="0.5" className="text-dream-amber/15" />
        </svg>
      )
    case 'envelope':
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" stroke="currentColor">
          <rect x="15" y="30" width="70" height="44" rx="2" strokeWidth="1.5" className="text-dream-amber/60" fill="rgba(212,165,116,0.05)" />
          <path d="M15 33L50 57L85 33" strokeWidth="1.2" className="text-dream-amber/40" />
          <path d="M20 74L42 56M80 74L58 56" strokeWidth="0.8" className="text-dream-amber/25" />
        </svg>
      )
    case 'mirror':
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" stroke="currentColor">
          <ellipse cx="50" cy="48" rx="30" ry="36" strokeWidth="1.5" className="text-dream-amber/55" fill="rgba(212,165,116,0.04)" />
          <path d="M27 35L34 28M43 24L50 20M57 24L66 29M73 37L78 44" strokeWidth="0.8" className="text-dream-amber/25" />
          <line x1="50" y1="84" x2="50" y2="94" strokeWidth="1.5" className="text-dream-amber/45" />
          <line x1="42" y1="90" x2="58" y2="90" strokeWidth="1" className="text-dream-amber/35" />
        </svg>
      )
    default:
      return null
  }
}

// 第一层：雨中站台
const PlatformScene: React.FC = () => {
  const { translatedEmotion, phase1Collected, collectObject, setPhase1Complete, nextPhase, setTransitioning } = useDreamStore()
  const [showContent, setShowContent] = useState(false)
  const [objectClicked, setObjectClicked] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

  const emotion = translatedEmotion || 'confusion'
  const storyline = getStoryline(emotion)
  const platformObject = getObjectForPhase(emotion, 'platform')

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 800)
    return () => clearTimeout(t1)
  }, [])

  const handleObjectClick = () => {
    if (objectClicked || phase1Collected) return
    setObjectClicked(true)
    collectObject(platformObject)

    setTimeout(() => setShowResponse(true), 600)
    setTimeout(() => {
      setPhase1Complete()
    }, 2000)
  }

  const handleContinue = () => {
    setTransitioning(true)
    setTimeout(() => nextPhase(), 300)
  }

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0c1220 0%, #151d30 40%, #1a2440 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1.5 }}
    >
      {/* 雨丝效果 */}
      <RainEffect />

      {/* 站台地面剪影 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(to top, rgba(10,14,26,0.95) 0%, transparent 100%)',
          }}
        />
        <div className="absolute bottom-8 left-0 right-0 h-px bg-white/[0.03]" />
      </div>

      {/* 背景雾气 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 80%, rgba(100,120,160,0.05) 0%, transparent 60%)',
        }}
      />

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-lg">
        {/* 广播文字 */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <p className="text-white/20 text-xs tracking-[0.3em] mb-3">站内广播</p>
              <p className="font-dream text-white/50 text-sm leading-relaxed tracking-wide">
                {storyline.platform.broadcast}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 氛围文字 */}
        <AnimatePresence>
          {showContent && (
            <motion.p
              className="text-white/30 text-sm text-center leading-loose tracking-wider italic font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
            >
              {storyline.platform.atmosphereText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 核心物件 */}
        <AnimatePresence>
          {showContent && !phase1Collected && (
            <motion.button
              className="group relative cursor-pointer focus:outline-none"
              onClick={handleObjectClick}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 光晕 */}
              <motion.div
                className="absolute inset-0 -m-6 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(212,165,116,0.1) 0%, transparent 70%)',
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <ObjectSVG type={platformObject.icon} />

              {/* 提示文字 */}
              <motion.p
                className="text-white/25 text-xs mt-4 tracking-wider text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: objectClicked ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              >
                点击 {platformObject.name}
              </motion.p>
            </motion.button>
          )}
        </AnimatePresence>

        {/* 物件回应 */}
        <AnimatePresence>
          {showResponse && (
            <motion.div
              className="max-w-sm text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <p className="font-dream text-dream-amber/80 text-base leading-loose tracking-wide whitespace-pre-line">
                {platformObject.responseText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 继续按钮 */}
        <AnimatePresence>
          {phase1Collected && (
            <motion.button
              className="continue-btn mt-4"
              onClick={handleContinue}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              带着{platformObject.name}上车
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default PlatformScene
