"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface ViewTransitionProps {
  children: ReactNode
  viewKey: string
}

// Variantes d'animation pour les transitions entre vues
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
}

export function ViewTransition({ children, viewKey }: ViewTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}