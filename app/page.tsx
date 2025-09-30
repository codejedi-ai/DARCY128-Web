"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DynamicVantaBackground = dynamic(() => import('./components/VantageBackground'), {
  ssr: false
});

const smoothTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.7
}

export default function Home() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 2000)
    const timer2 = setTimeout(() => setStage(2), 4000)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, []);

  return (
    <DynamicVantaBackground>
    <div className="flex flex-col items-center justify-center min-h-screen text-white overflow-hidden">
      <motion.div 
        layout
        transition={smoothTransition}
        className="flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.h1
              key="hello"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={smoothTransition}
              className="text-5xl font-bold mb-8"
            >
              Hi there :)
            </motion.h1>
          )}
          {stage >= 1 && (
            <motion.h1
              key="perceptr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...smoothTransition,
                delay: stage === 1 ? 0.3 : 0
              }}
              className="text-6xl font-bold mb-8"
            >
              <div className='flex flex-col items-center gap-8'>
                Perceptr
                <a href="/auth/login">Login</a>
                <Link href="/auth/login">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => {
                      try {
                        const audio = new Audio('/uofthacks_st.mp3'); // Note the absolute path from public directory
                        audio.play().catch(error => {
                          console.error('Audio playback failed:', error);
                        });
                      } catch (error) {
                        console.error('Audio creation failed:', error);
                      }
                    }}
                  >
                    Let&apos;s get started
                  </Button>
                </Link>
              </div>
            </motion.h1>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </DynamicVantaBackground>
  );
}
