import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDreamStore } from '../../store/dreamStore'

// ===== 开篇故事文本 =====
const OPENING_STORY = {
  paragraphs: [
    '人每天都会做梦。',
    '但大多数梦，醒来就忘了。',
    '那些没忘的梦，往往藏着一些东西——',
    '白天压在心上的疲惫、说不出口的话、看不清的前路。',
    '梦不问你「为什么」，也不给你列「一二三」。',
    '它只是把你心里的重量，翻译成一场可以走进去的旅程。',
    '你会在梦里遇见一个站台、一节车厢、一个信箱。',
    '那里没有标准答案，只有属于你的物件和回应。',
    '这不是心理咨询，也不是AI助手在给你建议。',
    '这是一场梦。而你，是这场梦里唯一的主角。',
  ],
}

// ===== 前序引导步骤数据 =====
const INTRO_STEPS = [
  {
    id: 'emotion',
    title: '有些话',
    subtitle: '醒着的时候说不出口',
    detail: '',
    holdDuration: 2500,
  },
  {
    id: 'dream',
    title: '梦知道',
    subtitle: '它不评判、不给建议',
    detail: '只是把那些沉重的东西，变成你可以触碰的样子。',
    holdDuration: 3000,
  },
  {
    id: 'breathe',
    title: '深呼吸',
    subtitle: '',
    detail: '',
    isBreathing: true,
    holdDuration: 4000,
  },
  {
    id: 'enter',
    title: '准备好了',
    subtitle: '写下那件事',
    detail: '',
    isFinal: true,
    holdDuration: 2000,
  },
]

// 所有步骤（开篇故事 + 引导步骤）
const ALL_STEPS = [
  { id: 'story', isStory: true },
  ...INTRO_STEPS,
]

// ===== 呼吸动画圆环组件 =====
const BreathingCircle: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div
    className="relative w-32 h-32 md:w-40 md:h-40"
    animate={
      active
        ? { scale: [1, 1.4, 1], opacity: [0.3, 0.08, 0.3] }
        : { scale: 1, opacity: 0.2 }
    }
    transition={
      active
        ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        : { duration: 0.5 }
    }
  >
    <div className="absolute inset-0 rounded-full border border-dream-amber/20" />
    <motion.div
      className="absolute inset-4 rounded-full border border-dream-amber/15"
      animate={
        active
          ? { scale: [1, 1.3, 1], opacity: [0.2, 0.06, 0.2] }
          : false
      }
      transition={active ? { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 } : {}}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.span
        className="text-dream-amber/50 text-sm font-dream tracking-[0.3em]"
        animate={active ? { opacity: [0.4, 0.8, 0.4] } : {}}
        transition={active ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        吸气...
      </motion.span>
    </div>
  </motion.div>
)

// ===== 漂浮粒子 =====
const IntroParticles: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 7,
    opacity: Math.random() * 0.2 + 0.05,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -25, 0],
            x: [0, (Math.random() - 0.5) * 15, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ===== 开篇故事段落组件 =====
const StoryParagraph: React.FC<{ text: string; index: number; visible: boolean }> = ({ text, index, visible }) => (
  <motion.p
    key={index}
    className={`font-dream text-white/50 text-sm md:text-base leading-loose tracking-wider ${index === 0 ? 'text-white/65 text-base md:text-lg' : ''} ${index === OPENING_STORY.paragraphs.length - 1 ? 'text-dream-amber/55' : ''}`}
    initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
    animate={visible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
    transition={{ duration: 1, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
  >
    {text}
  </motion.p>
)

// ===== 主场景组件 =====
const IntroScene: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [canProceed, setCanProceed] = useState(false)
  const [visibleParagraphs, setVisibleParagraphs] = useState(0)

  const step = ALL_STEPS[currentStep]
  const isStoryStep = step.isStory === true
  const introStepIndex = currentStep - 1 // 对应 INTRO_STEPS 的索引
  const introStep = introStepIndex >= 0 && introStepIndex < INTRO_STEPS.length ? INTRO_STEPS[introStepIndex] : null
  const isLastStep = currentStep === ALL_STEPS.length - 1

  // 故事模式：逐段显示
  useEffect(() => {
    if (!isStoryStep) return
    setShowContent(true)
    setCanProceed(false)
    setVisibleParagraphs(0)

    // 逐段显现
    let count = 0
    const interval = setInterval(() => {
      count++
      setVisibleParagraphs(count)
      if (count >= OPENING_STORY.paragraphs.length) {
        clearInterval(interval)
        setTimeout(() => setCanProceed(true), 1500)
      }
    }, 1800) // 每段约1.8秒

    return () => clearInterval(interval)
  }, [isStoryStep])

  // 普通引导步骤
  useEffect(() => {
    if (isStoryStep) return
    setShowContent(false)
    setCanProceed(false)

    const t1 = setTimeout(() => setShowContent(true), 400)
    const t2 = setTimeout(() => setCanProceed(true), (introStep?.holdDuration ?? 2000))

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [currentStep])

  const handleNext = () => {
    if (!canProceed && !isLastStep) return
    if (isLastStep) {
      useDreamStore.getState().nextPhase()
      return
    }
    setCurrentStep((prev) => prev + 1)
  }

  // 键盘支持
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && canProceed) {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [canProceed])

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      style={{ background: '#070b14' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 2 }}
      onClick={handleNext}
    >
      {/* 背景粒子 */}
      <IntroParticles />

      {/* 中心微光 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,165,116,0.02) 0%, transparent 60%)' }}
      />

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 max-w-lg text-center select-none">
        {/* 步骤指示器（仅在非故事步骤显示） */}
        {!isStoryStep && (
          <div className="flex gap-2 mb-2">
            {INTRO_STEPS.map((_, i) => (
              <motion.div
                key={i}
                className="w-5 h-px"
                style={{
                  backgroundColor: i <= introStepIndex ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.06)',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* 开篇故事渲染 */}
          {isStoryStep ? (
            <motion.div
              key="story"
              className="flex flex-col gap-4 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.8 }}
            >
              {OPENING_STORY.paragraphs.map((text, i) => (
                <StoryParagraph
                  key={i}
                  text={text}
                  index={i}
                  visible={visibleParagraphs > i}
                />
              ))}

              {/* 故事结束提示 */}
              {canProceed && (
                <motion.div
                  className="mt-3 pt-3 border-t border-white/[0.04]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-dream-amber/30 text-xs tracking-[0.3em]">
                    点击进入梦境
                  </span>
                  <motion.div
                    className="w-px h-4 bg-dream-amber/20 mx-auto mt-2"
                    animate={{ scaleY: [1, 0.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* 普通引导步骤渲染 */
            <motion.div
              key={introStep?.id || 'unknown'}
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              {introStep?.isBreathing ? (
                <>
                  <BreathingCircle active={showContent} />
                  <p className="font-dream text-white/45 text-base tracking-widest mt-4">{introStep.title}</p>
                  <motion.p
                    className="text-white/20 text-sm tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContent ? 1 : 0 }}
                    transition={{ delay: 1, duration: 1 }}
                  >
                    呼气...
                  </motion.p>
                </>
              ) : (
                <>
                  <h2 className={`font-dream tracking-[0.2em] ${introStep?.isFinal ? 'text-dream-gold/80 text-xl' : 'text-white/70 text-xl md:text-2xl'}`}>
                    {introStep?.title}
                  </h2>
                  {introStep?.subtitle && (
                    <p className="text-white/30 text-sm tracking-[0.15em] font-light">{introStep.subtitle}</p>
                  )}
                  {introStep?.detail && (
                    <motion.p
                      className="text-white/22 text-sm leading-loose tracking-wide max-w-md italic font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: showContent ? 1 : 0 }}
                      transition={{ delay: 0.5, duration: 1 }}
                    >
                      {introStep.detail}
                    </motion.p>
                  )}
                  {introStep?.isFinal && canProceed && (
                    <motion.div className="mt-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                      <span className="text-dream-amber/30 text-xs tracking-[0.3em]">点击继续</span>
                      <motion.div
                        className="w-px h-4 bg-dream-amber/20 mx-auto mt-2"
                        animate={{ scaleY: [1, 0.5, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 继续提示 */}
        {!isLastStep && canProceed && !isStoryStep && (
          <motion.p
            className="absolute bottom-12 text-white/10 text-xs tracking-[0.25em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            点击或按空格继续
          </motion.p>
        )}
      </div>

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        <div className="w-full h-full" style={{ background: 'linear-gradient(to top, #070b14 0%, transparent 100%)' }} />
      </div>
    </motion.div>
  )
}

export default IntroScene
