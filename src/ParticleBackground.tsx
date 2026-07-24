import { useEffect, useRef } from 'react'

type Dot = {
  x: number
  y: number
}

const BACKGROUND_COLOR = '#130F13'
const DOT_COLOR = '#FFFFFF'
const DOT_GAP = 34
const DOT_SIZE = 2
const DOT_IDLE_ALPHA = 0.18
const DOT_ACTIVE_ALPHA = 0.78
const CURSOR_RADIUS = 170
const CURSOR_PUSH = 34

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let dots: Dot[] = []
    let animationFrame = 0
    let width = 0
    let height = 0
    const pointer = {
      x: -10_000,
      y: -10_000,
      active: false,
    }

    const createDots = () => {
      const columns = Math.ceil(width / DOT_GAP) + 2
      const rows = Math.ceil(height / DOT_GAP) + 2
      const offsetX = (width - (columns - 1) * DOT_GAP) / 2
      const offsetY = (height - (rows - 1) * DOT_GAP) / 2

      dots = Array.from({ length: columns * rows }, (_, index) => ({
        x: offsetX + (index % columns) * DOT_GAP,
        y: offsetY + Math.floor(index / columns) * DOT_GAP,
      }))
    }

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      pointer.x = -10_000
      pointer.y = -10_000
      pointer.active = false
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      createDots()
      if (reducedMotion.matches) draw()
    }

    const drawBackground = () => {
      context.fillStyle = BACKGROUND_COLOR
      context.fillRect(0, 0, width, height)
    }

    const drawDots = () => {
      for (const dot of dots) {
        const dx = dot.x - pointer.x
        const dy = dot.y - pointer.y
        const distance = pointer.active ? Math.hypot(dx, dy) : Number.POSITIVE_INFINITY
        const influence = Math.max(0, 1 - distance / CURSOR_RADIUS)
        const directionX = distance > 0 ? dx / distance : 0
        const directionY = distance > 0 ? dy / distance : 0
        const push = influence * influence * CURSOR_PUSH
        const x = dot.x + directionX * push
        const y = dot.y + directionY * push
        const alpha = DOT_IDLE_ALPHA + (DOT_ACTIVE_ALPHA - DOT_IDLE_ALPHA) * influence

        context.beginPath()
        context.arc(x, y, DOT_SIZE, 0, Math.PI * 2)
        context.globalAlpha = alpha
        context.fillStyle = DOT_COLOR
        context.fill()
      }
      context.globalAlpha = 1
    }

    const draw = () => {
      drawBackground()
      drawDots()
    }

    const animate = () => {
      draw()
      animationFrame = window.requestAnimationFrame(animate)
    }

    const restart = () => {
      window.cancelAnimationFrame(animationFrame)
      resize()
      if (!reducedMotion.matches) animate()
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }

    const handlePointerLeave = () => {
      pointer.x = -10_000
      pointer.y = -10_000
      pointer.active = false
    }

    restart()
    window.addEventListener('resize', restart)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    reducedMotion.addEventListener('change', restart)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', restart)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      reducedMotion.removeEventListener('change', restart)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-background" aria-hidden="true" />
}
