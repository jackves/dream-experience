import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDreamStore } from '../../store/dreamStore'
import { getObjectForPhase, getStoryline } from '../../engine/objectMapper'

// 第二层物件 SVG
const CarriageObjectSVG: React.FC<{ type: string; interacted?: boolean }> = ({ type, interacted }) => {
  const baseClass = `w-28 h-28 md:w-36 md:h-36 transition-all duration-1000 ${interacted ? '' : ''}`

  switch (type) {
    case 'shadow':
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none">
          <ellipse cx="50" cy="65" rx="28" ry="12" fill="rgba(20,25,40,0.6)" className="text-dream-midnight" />
          <path d="M35 60C35 55 40 30 50 30C60 30 65 55 65 60" strokeWidth="1.5" className="text-white/15" fill="rgba(255,255,255,0.03)" />
          <ellipse cx="46" cy="42" rx="3" ry="4" fill="rgba(255,255,255,0.06)" />
          <ellipse cx="54" cy="42" rx="3" ry="4" fill="rgba(255,255,255,0.06)" />
          <path d="M47 54Q50 58 53 54" strokeWidth="0.8" className="text-white/10" />
        </svg>
      )
    case 'fog':
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none">
          <rect x="10" y="15" width="80" height="70" rx="4" strokeWidth="1.5" className="text-white/15" fill="rgba(255,255,255,0.02)" />
          <ellipse cx="50" cy="35" rx="30" ry="8" fill="rgba(200,210,230,0.08)" />
          <ellipse cx="45" cy="52" rx="25" ry="7" fill="rgba(200,210,230,0.06)" />
          <ellipse cx="55" cy="68" rx="20" ry="5" fill="rgba(200,210,230,0.04)" />
          {!interacted && (
            <>
              <motion.path
                d="M30 45 L70 45"
                strokeWidth="0.5"
                className="text-dream-amber/30"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              />
            </>
          )}
          {interacted && (
            <motion.circle
              cx="75" cy="25" r="3"
              fill="rgba(240,217,168,0.3)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            />
          )}
        </svg>
      )
    case 'schedule':
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" stroke="currentColor">
          <rect x="22" y="18" width="56" height="68" rx="2" strokeWidth="1.2" className="text-white/20" fill="rgba(255,255,255,0.02)" />
          <line x1="22" y1="30" x2="78" y2="30" strokeWidth="0.8" className="text-white/10" />
          <line x1="30" y1="40" x2="55" y2="40" strokeWidth="0.6" className="text-white/15" />
          <line x1="30" y1="50" x2="65" y2="50" strokeWidth="0.6" className="text-white/10" />
          <line x1="30" y1="60" x2="48" y2="60" strokeWidth="0.6" className="text-white/8" />
          <motion.text
            x="50" y="76"
            textAnchor="middle"
            className="fill-dream-amber/50 text-[8px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.6] }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            下一站…
          </motion.text>
        </svg>
      )
    case 'seat':
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" stroke="currentColor">
          <rect x="25" y="50" width="50" height="8" rx="2" strokeWidth="1.2" className="text-white/20" fill="rgba(150,140,120,0.08)" />
          <rect x="28" y="58" width="8" height="22" rx="1" strokeWidth="1" className="text-white/15" />
          <rect x="64" y="58" width="8" height="22" rx="1" strokeWidth="1" className="text-white/15" />
          <rect x="25" y="38" width="50" height="14" rx="3" strokeWidth="1.2" className="text-white/18" fill="rgba(150,140,120,0.05)" />
          <ellipse cx="50" cy="44" rx="16" ry="4" fill="rgba(200,190,170,0.04)" />
        </svg>
      )
    case 'reflection':
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none">
          <rect x="15" y="15" width="70" height="70" rx="3" strokeWidth="1" className="text-white/15" fill="rgba(200,210,230,0.03)" />
          <ellipse cx="38" cy="45" rx="8" ry="11" fill="rgba(255,255,255,0.04)" />
          <ellipse cx="62" cy="45" rx="8" ry="11" fill="rgba(255,255,255,0.03)" />
          <motion.ellipse
            cx="62" cy="45"
            rx="8" ry="11"
            fill="rgba(255,255,255,0.04)"
            animate={{ opacity: [0.3, 0.08, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </svg>
      )
    default:
      return null
  }
}

// 吊环装饰
const HangingRing: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.div
    className="absolute top-0 w-px h-16 md:h-24"
    style={{ left: `${20 + delay * 25}%` }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.15 }}
    transition={{ delay: delay * 0.3 }}
  >
    <motion.div
      className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 mx-auto"
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
    />
  </motion.div>
)

// 第二层：无声车厢
const CarriageScene: React.FC = () => {
  const { translatedEmotion, phase2Interacted, collectedObjects, setPhase2Complete, nextPhase, setTransitioning } = useDreamStore()
  const [showContent, setShowContent] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

  const emotion = translatedEmotion || 'confusion'
  const storyline = getStoryline(emotion)
  const carriageObject = getObjectForPhase(emotion, 'carriage')
  const lastObject = collectedObjects[0]

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 1000)
    return () => clearTimeout(t1)
  }, [])

  const handleInteract = () => {
    if (interacted || phase2Interacted) return
    setInteracted(true)

    setTimeout(() => setShowResponse(true), 800)
    setTimeout(() => {
      setPhase2Complete()
    }, 3000)
  }

  const handleContinue = () => {
    setTransitioning(true)
    setTimeout(() => nextPhase(), 300)
  }

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0d1219 0%, #141e2a 40%, #162232 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1.5 }}
    >
      {/* 车厢摇晃动画容器 */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: [-0.3, 0.3, -0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* 吊环 */}
        <HangingRing delay={0} />
        <HangingRing delay={1} />
        <HangingRing delay={2} />
        <HangingRing delay={3} />

        {/* 窗户光线效果 */}
        <div
          className="absolute top-10 right-10 w-40 h-60 rounded-l-full pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(200,210,230,0.03) 0%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* 车厢底部 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(to top, rgba(13,18,25,0.98) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-lg">
        {/* 已收集的物件展示 */}
        <AnimatePresence>
          {showContent && lastObject && (
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="text-white/15 text-xs tracking-wider">带着</div>
              <div className="text-dream-amber/50 text-sm font-dream">{lastObject.name}</div>
              <div className="text-white/15 text-xs tracking-wider">坐在身侧</div>
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
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              {storyline.carriage.atmosphereText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 当前物件交互 */}
        <AnimatePresence>
          {showContent && !phase2Interacted && (
            <motion.button
              className="group relative cursor-pointer focus:outline-none"
              onClick={handleInteract}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.div
                className="absolute inset-0 -m-8 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(180,200,220,0.06) 0%, transparent 70%)',
                }}
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <CarriageObjectSVG type={carriageObject.icon} interacted={interacted} />

              {!interacted && (
                <motion.p
                  className="text-white/20 text-xs mt-3 tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  触碰{carriageObject.name}
                </motion.p>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* 回应文本 */}
        <AnimatePresence>
          {showResponse && (
            <motion.div
              className="max-w-sm text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <p className="font-dream text-white/60 text-sm leading-loose tracking-wide whitespace-pre-line">
                {storyline.carriage.object.responseText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 继续按钮 */}
        <AnimatePresence>
          {phase2Interacted && (
            <motion.button
              className="continue-btn mt-2"
              onClick={handleContinue}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              到站了
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default CarriageScene
