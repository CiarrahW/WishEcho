import React from 'react';
import { User } from '../types';
import { ageRangeLabels } from '../utils/echoFilter';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

export function Header({ currentUser, onLogout }: HeaderProps) {
  return (
    <header className="py-6 px-6 md:px-12 flex items-center justify-between border-b border-[var(--color-surface-light)] bg-[var(--color-bg)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-violet)] to-[var(--color-accent)] flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[var(--color-bg)]" />
        </div>
        <h1 className="font-serif text-2xl font-medium tracking-tight text-[var(--color-text)]">
          WishEcho
        </h1>
      </div>
      
      {currentUser && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-[var(--color-text)]">{currentUser.name}</div>
              <div className="text-xs text-[var(--color-accent)]">{ageRangeLabels[currentUser.ageRange]}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-light)] flex items-center justify-center text-[var(--color-violet-light)] font-serif font-medium border border-[var(--color-violet)]/30">
              {currentUser.name?.charAt(0) || 'U'}
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors p-2 rounded-full hover:bg-[var(--color-surface-light)]"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </header>
  );
}
