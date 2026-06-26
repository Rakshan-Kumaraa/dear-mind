import { motion } from 'framer-motion';
import React from 'react';

export default function AnimatedTitle({ variant = "glass" }) {
  const text = "Dear Mind";
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const child = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 12, stiffness: 100 }
    }
  };

  // FIXED: No more invisible text! Pure white text with a dynamic theme-colored glow.
  const gradientStyle = "text-white drop-shadow-[0_0_25px_var(--accent-start)]";
  
  const glassStyle = "text-white/95 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]";

  return (
    <div className="flex items-center justify-center transform scale-90">
      <motion.h1 
        className={`text-4xl md:text-5xl font-black tracking-tighter uppercase flex mb-8 transition-colors duration-700 ${variant === 'gradient' ? gradientStyle : glassStyle}`}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {text.split("").map((letter, index) => (
          <motion.span key={index} variants={child}>
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}