import React from 'react';
import { Wish } from '../types';
import { ageRangeLabels } from '../utils/echoFilter';
import { formatDistanceToNow } from 'date-fns';
import { Quote, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface WishCardProps {
  key?: string;
  wish: Wish;
  index: number;
  onPursue: () => void;
}

export function WishCard({ wish, index, onPursue }: WishCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-[var(--color-surface)] rounded-3xl p-8 shadow-xl relative overflow-hidden group border border-[var(--color-surface-light)] hover:border-[var(--color-violet)]/50 transition-colors"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-violet)] to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-surface-light)] flex items-center justify-center text-[var(--color-violet-light)]">
            <Quote size={18} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
              {ageRangeLabels[wish.ageRange]}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {formatDistanceToNow(new Date(wish.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        
        <div className="px-3 py-1 rounded-full border border-[var(--color-surface-light)] text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-muted)] bg-[var(--color-bg)]/50">
          {wish.category.replace('_', ' ')}
        </div>
      </div>
      
      <p className="font-serif text-2xl leading-relaxed text-[var(--color-text)] mb-8">
        "{wish.content}"
      </p>
      
      <div className="flex justify-end">
        <button 
          onClick={onPursue}
          className="text-sm font-medium text-[var(--color-violet-light)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-2 group/btn"
        >
          <span>Pursue this today</span>
          <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
