import { motion, type Variants } from 'framer-motion'
import { type ReactNode, type MouseEvent } from 'react'

const cardVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    backgroundColor: '#ffffff',
    borderColor: '#F0F0F0',
  },
  hover: {
    y: -12,
    scale: 1.03,
    boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 0 0 1px rgba(14,128,239,0.15)',
    backgroundColor: '#ffffff',
    borderColor: 'rgba(14,128,239,0.25)',
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.15,
    rotate: 8,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

const headingVariants: Variants = {
  rest: { color: '#111111' },
  hover: { color: '#0062cc', transition: { duration: 0.3 } },
}

const descVariants: Variants = {
  rest: { y: 0, opacity: 0.75 },
  hover: { y: -3, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}

const overlayVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

const shimmerVariants: Variants = {
  rest: { x: '-150%', opacity: 0 },
  hover: {
    x: '150%',
    opacity: 1,
    transition: { duration: 0.7, ease: 'easeInOut' },
  },
}

interface PremiumCardProps {
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

export function PremiumCard({ children, className = '', onClick }: PremiumCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border bg-white ${className}`}
      style={{ willChange: 'transform' }}
    >
      {/* Gradient overlay from bottom */}
      <motion.div
        variants={overlayVariants}
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-50/60 via-transparent to-transparent"
      />
      {/* Shimmer sweep */}
      <motion.div
        variants={shimmerVariants}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.45) 50%, transparent 75%)',
          width: '60%',
          height: '100%',
        }}
      />
      <div className="relative z-20 h-full">{children}</div>
    </motion.div>
  )
}

export function PremiumIcon({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={iconVariants}
      className={`relative flex items-center justify-center ${className}`}
      style={{ willChange: 'transform' }}
    >
      {/* Soft glow behind icon */}
      <motion.div
        variants={{
          rest: { opacity: 0, scale: 0.8 },
          hover: { opacity: 0.5, scale: 1.3, transition: { duration: 0.4 } },
        }}
        className="absolute inset-0 rounded-xl blur-md bg-primary-200"
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

export function PremiumHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.h3 variants={headingVariants} className={className}>
      {children}
    </motion.h3>
  )
}

export function PremiumDesc({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.p variants={descVariants} className={className}>
      {children}
    </motion.p>
  )
}

export { cardVariants, iconVariants, headingVariants, descVariants, overlayVariants, shimmerVariants }
