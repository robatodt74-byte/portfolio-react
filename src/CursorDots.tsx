import { useEffect, useRef } from 'react'

type Dot = { x: number; y: number }

const DOT_GAP = 30
const HOVER_RADIUS = 150

export default function CursorDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const dotColor = getComputedStyle(document.documentElement).getPropertyValue('--yellow').trim()
    let animationFrame = 0
    let width = 0
    let height = 0
    let dots: Dot[] = []
    const pointer = { x: -1000, y: -1000, active: false }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const columns = Math.ceil(width / DOT_GAP) + 1
      const rows = Math.ceil(height / DOT_GAP) + 1
      const offsetX = (width - (columns - 1) * DOT_GAP) / 2
      const offsetY = (height - (rows - 1) * DOT_GAP) / 2
      dots = Array.from({ length: columns * rows }, (_, index) => ({
        x: offsetX + (index % columns) * DOT_GAP,
        y: offsetY + Math.floor(index / columns) * DOT_GAP,
      }))
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      for (const dot of dots) {
        const distance = Math.hypot(dot.x - pointer.x, dot.y - pointer.y)
        const influence = pointer.active ? Math.max(0, 1 - distance / HOVER_RADIUS) : 0
        const easedInfluence = influence * influence
        context.beginPath()
        context.arc(dot.x, dot.y, 1.2 + easedInfluence * 2.1, 0, Math.PI * 2)
        context.globalAlpha = 0.055 + easedInfluence * 0.72
        context.fillStyle = dotColor
        context.fill()
      }
      context.globalAlpha = 1
    }

    const animate = () => {
      draw()
      animationFrame = window.requestAnimationFrame(animate)
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }

    const handlePointerLeave = () => {
      pointer.active = false
    }

    resize()
    draw()
    if (!reducedMotion.matches) animate()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="cursor-dots" aria-hidden="true" />
}
