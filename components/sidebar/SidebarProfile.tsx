"use client";
import { useUser } from '@auth0/nextjs-auth0';
import { User } from 'lucide-react';
import LogoutButton from '../LogoutButton';

export default function SidebarProfile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="mt-auto space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
          <div className="w-10 h-10 bg-gray-300/20 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="w-20 h-4 bg-gray-300/20 rounded animate-pulse mb-1"></div>
            <div className="w-24 h-3 bg-gray-300/20 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-full h-10 bg-gray-300/20 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-auto">
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="mt-auto space-y-4">
      {/* Profile Section */}
      <div className="p-3 bg-white/10 rounded-lg border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
            {user.picture ? (
              <img 
                src={user.picture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-white/60 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <LogoutButton />
    </div>
  );
}
