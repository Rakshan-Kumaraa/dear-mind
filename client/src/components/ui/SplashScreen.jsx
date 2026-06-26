import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);    // Phase 1: Dear Mind (Spring pop)
    const t2 = setTimeout(() => setPhase(2), 2500);   // Phase 2: The Welcome Message
    const t3 = setTimeout(() => onComplete(), 5000);  // Phase 3: Unleash the app!

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030303] overflow-hidden"
    >
      {/* THE AURORA BACKGROUND - Morphing, rotating liquid shapes */}
      <div className="absolute inset-0 flex items-center justify-center opacity-70">
        <motion.div
          animate={{ 
            rotate: [0, 180, 360],
            scale: [1, 1.4, 1],
            borderRadius: ["30%", "50%", "30%"] // Creates a liquid/blob effect
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-[60vw] h-[60vw] max-w-3xl max-h-3xl bg-[var(--accent-start)] mix-blend-screen blur-[100px] opacity-40 -translate-x-1/4"
        />
        <motion.div
          animate={{ 
            rotate: [360, 180, 0],
            scale: [1.2, 1, 1.2],
            borderRadius: ["50%", "30%", "50%"]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-[50vw] h-[50vw] max-w-2xl max-h-2xl bg-[var(--accent-end)] mix-blend-screen blur-[120px] opacity-50 translate-x-1/4 translate-y-1/4"
        />
      </div>

      <AnimatePresence mode="wait">
        {/* PHASE 1 */}
        {phase === 1 && (
          <motion.h1
            key="title"
            initial={{ opacity: 0, scale: 0.5, y: 30, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(15px)' }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.4 }} // Spring physics for a satisfying pop
            className="text-6xl md:text-8xl font-black uppercase z-10 text-center drop-shadow-[0_0_40px_var(--accent-start)]"
          >
            {/* The Shimmering Text Effect */}
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-r from-[var(--accent-end)] via-white to-[var(--accent-start)] bg-[length:200%_auto] text-transparent bg-clip-text inline-block"
            >
              Dear Mind
            </motion.span>
          </motion.h1>
        )}
        
        {/* PHASE 2 */}
        {phase === 2 && (
          <motion.div
            key="quote"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="z-10 flex flex-col items-center justify-center gap-3 px-8 text-center"
          >
            <span className="text-2xl md:text-4xl font-light text-white/90 tracking-wide drop-shadow-md">
              Welcome to your
            </span>
            
            {/* Staggered punch-in for the main subject */}
            <motion.span 
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.5 }}
              className="text-4xl md:text-6xl font-black italic bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              personal Diary.
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}