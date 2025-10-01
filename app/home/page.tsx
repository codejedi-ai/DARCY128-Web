// app/home/page.tsx
'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ClientScatter from '@/components/clientScatter'

export default function HomePage() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="h-screen bg-black">
      <div className="h-full">
        <div className="h-full relative overflow-hidden border-2 border-cyan-400/30 shadow-xl 
        shadow-cyan-400/10 bg-black">
          {/* Profile controls - stays in top-right */}
          <div className="absolute top-4 right-4 z-50">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer border-2"
                   onClick={() => setShowMenu(!showMenu)}>
                AU
              </div>
              {showMenu && (
                <div className="absolute mt-2 right-0 w-36 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 
                    hover:text-cyan-600 transition-colors"
                    onClick={handleProfile}
                  >
                    Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
          <ClientScatter />
        </div>
      </div>
    </div>
  );
}
