import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useDreamStore, DreamPhase } from './store/dreamStore'

// 场景组件
import IntroScene from './components/scenes/IntroScene'
import EntranceScene from './components/scenes/EntranceScene'
import PlatformScene from './components/scenes/PlatformScene'
import CarriageScene from './components/scenes/CarriageScene'
import LetterboxScene from './components/scenes/LetterboxScene'
import AwakeningScene from './components/scenes/AwakeningScene'

const App: React.FC = () => {
  const currentPhase = useDreamStore((state) => state.currentPhase)
  const isTransitioning = useDreamStore((state) => state.isTransitioning)
  const setTransitioning = useDreamStore((state) => state.setTransitioning)

  // URL 参数调试模式：?phase=entrance|platform|carriage|letterbox|awakening
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const phaseParam = params.get('phase')
    if (phaseParam && ['intro', 'entrance', 'platform', 'carriage', 'letterbox', 'awakening'].includes(phaseParam)) {
      const store = useDreamStore.getState()
      const p = phaseParam as DreamPhase
      // 先设置输入和翻译（后续场景需要）
      store.setUserInput('我很累，快撑不住了')
      store.setTranslation('exhaustion' as any, '背包太重了')
      // 设置前置完成状态
      if (['platform', 'carriage', 'letterbox', 'awakening'].includes(p)) {
        store.setPhase1Complete()
        store.collectObject({ id: 'umbrella', name: '旧伞', icon: '☂' } as any)
      }
      if (['carriage', 'letterbox', 'awakening'].includes(p)) store.setPhase2Complete()
      if (['letterbox', 'awakening'].includes(p)) store.setPhase3Complete()
      // 最后跳转阶段
      useDreamStore.setState({ currentPhase: p })
    }
  }, [])

  // 转场动画结束后重置状态
  const handleAnimationComplete = () => {
    if (isTransitioning) {
      setTransitioning(false)
    }
  }

  // 根据当前阶段渲染对应场景
  const renderScene = () => {
    switch (currentPhase) {
      case 'intro':
        return <IntroScene key="intro" />
      case 'entrance':
        return <EntranceScene key="entrance" />
      case 'platform':
        return <PlatformScene key="platform" />
      case 'carriage':
        return <CarriageScene key="carriage" />
      case 'letterbox':
        return <LetterboxScene key="letterbox" />
      case 'awakening':
        return <AwakeningScene key="awakening" />
      default:
        return <IntroScene key="default" />
    }
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-dream-deep">
      {/* 场景切换容器 */}
      <AnimatePresence mode="wait" onExitComplete={handleAnimationComplete}>
        <motion.div
          key={currentPhase}
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: 'blur(15px)',
            scale: 1.02,
          }}
          transition={{
            duration: 1.5,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
