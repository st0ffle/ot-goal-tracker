"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { forwardRef } from 'react'

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button ref={ref} {...props}>
          {children}
        </Button>
      </motion.div>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'