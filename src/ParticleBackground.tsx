import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  radius: number
  velocityX: number
  velocityY: number
  alpha: number
}

const PARTICLE_DENSITY = 18_000
const MAX_PARTICLES = 90
const CONNECTION_DISTANCE = 120

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let particles: Particle[] = []
    let animationFrame = 0
    let width = 0
    let height = 0

    const createParticles = () => {
      const count = Math.min(MAX_PARTICLES, Math.max(28, Math.round((width * height) / PARTICLE_DENSITY)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.25 + 0.45,
        velocityX: (Math.random() - 0.5) * 0.16,
        velocityY: (Math.random() - 0.5) * 0.16,
        alpha: Math.random() * 0.34 + 0.18,
      }))
    }

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      createParticles()
      if (reducedMotion.matches) draw(false)
    }

    const draw = (move = true) => {
      context.clearRect(0, 0, width, height)

      for (let first = 0; first < particles.length; first += 1) {
        const particle = particles[first]

        if (move) {
          particle.x += particle.velocityX
          particle.y += particle.velocityY
          if (particle.x < -4) particle.x = width + 4
          if (particle.x > width + 4) particle.x = -4
          if (particle.y < -4) particle.y = height + 4
          if (particle.y > height + 4) particle.y = -4
        }

        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(234, 234, 234, ${particle.alpha})`
        context.fill()

        for (let second = first + 1; second < particles.length; second += 1) {
          const neighbor = particles[second]
          const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y)
          if (distance >= CONNECTION_DISTANCE) continue

          const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.09
          context.beginPath()
          context.moveTo(particle.x, particle.y)
          context.lineTo(neighbor.x, neighbor.y)
          context.strokeStyle = `rgba(234, 234, 234, ${opacity})`
          context.lineWidth = 0.5
          context.stroke()
        }
      }
    }

    const animate = () => {
      draw(true)
      animationFrame = window.requestAnimationFrame(animate)
    }

    const restart = () => {
      window.cancelAnimationFrame(animationFrame)
      resize()
      if (!reducedMotion.matches) animate()
    }

    restart()
    window.addEventListener('resize', restart)
    reducedMotion.addEventListener('change', restart)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', restart)
      reducedMotion.removeEventListener('change', restart)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-background" aria-hidden="true" />
}
