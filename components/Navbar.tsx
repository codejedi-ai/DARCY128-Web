"use client";
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import LogoutButton from '@/components/LogoutButton';
import { ROUTES } from '@/lib/routes';

export default function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo on the left */}
        <Link href={ROUTES.HOME} className="flex items-center space-x-2">
          <Image
            src="/favicon.ico"
            alt="Perceptr Logo"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="text-white font-bold text-xl">Perceptr</span>
        </Link>


        {/* Login/User section on the right */}
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="w-20 h-8 bg-gray-300/20 rounded animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-3">
              <Link href={ROUTES.PROFILE} className="flex items-center space-x-2 text-white text-sm hover:text-gray-300 transition-colors">
                <User className="w-4 h-4" />
                <span>{user.name || user.email}</span>
              </Link>
              <LogoutButton 
                variant="outline" 
                size="sm"
                className="text-black bg-white border-white hover:bg-gray-200"
              />
            </div>
          ) : (
            <Link href={ROUTES.LOGIN}>
              <Button 
                variant="outline" 
                size="sm"
                className="text-black bg-white border-white hover:bg-gray-200"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
