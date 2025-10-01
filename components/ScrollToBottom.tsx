'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScrollToBottomProps {
  containerRef?: React.RefObject<HTMLElement>;
  threshold?: number;
  className?: string;
}

export default function ScrollToBottom({ 
  containerRef, 
  threshold = 100, 
  className = "fixed bottom-6 right-6 z-50" 
}: ScrollToBottomProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      const element = containerRef?.current || document.documentElement;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      
      const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold;
      const isScrolledDown = scrollTop > threshold;
      
      setIsVisible(isScrolledDown && !isNearBottom);
      setIsAtBottom(isNearBottom);
    };

    const element = containerRef?.current || window;
    element.addEventListener('scroll', checkScrollPosition);
    
    // Initial check
    checkScrollPosition();
    
    return () => element.removeEventListener('scroll', checkScrollPosition);
  }, [containerRef, threshold]);

  const scrollToBottom = () => {
    const element = containerRef?.current || document.documentElement;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          <Button
            onClick={scrollToBottom}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-6 h-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
