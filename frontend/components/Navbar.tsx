'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Brain, LayoutDashboard, MessageSquare, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  // Don't show navbar on login/signup pages
  if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Serenity AI
            </span>
          </Link>

          {isLoggedIn && (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button 
                  variant={isActive('/dashboard') ? 'default' : 'ghost'}
                  className={isActive('/dashboard') 
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md' 
                    : 'text-gray-700 hover:text-violet-600 hover:bg-violet-50'
                  }
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/therapy">
                <Button 
                  variant={isActive('/therapy') ? 'default' : 'ghost'}
                  className={isActive('/therapy') 
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md' 
                    : 'text-gray-700 hover:text-violet-600 hover:bg-violet-50'
                  }
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Therapy
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
