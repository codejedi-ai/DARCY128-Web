"use client";
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: string;
  size?: string;
  className?: string;
}

export default function LogoutButton({ variant, size, className }: LogoutButtonProps) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="w-full h-10 bg-gray-300/20 rounded animate-pulse"></div>
    );
  }

  if (!user) {
    return null; // Don't show logout button if user is not logged in
  }

  return (
    <Link href="/api/auth/logout" className="w-full">
      <Button 
        variant={variant as any || "outline"}
        size={size as any}
        className={className || "w-full text-red-400 border-red-400/30 hover:bg-red-400/10 flex items-center gap-2"}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </Link>
  );
}