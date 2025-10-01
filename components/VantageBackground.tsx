'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface VantaBackgroundProps {
  children: React.ReactNode;
}

interface VantaEffect {
  destroy: () => void;
}

const VantaBackground = ({ children }: VantaBackgroundProps) => {
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVanta = async () => {
      if (!vantaEffect) {
        // @ts-expect-error/omasdgoiajfs
        const NET = (await import('vanta/dist/vanta.net.min')).default;
        setVantaEffect(
          NET({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xffffff,
            backgroundColor: 0x0
          })
        );
      }
    };
    
    loadVanta();
    
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} style={{ width: '100%', height: '100vh', position: 'fixed'}}>
      {children}
    </div>
  );
};

export default VantaBackground;
