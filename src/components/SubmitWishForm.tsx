import React, { useState } from 'react';
import { AgeRange, Category, User } from '../types';
import { ageRangeLabels } from '../utils/echoFilter';
import { Send, Sparkles } from 'lucide-react';

interface SubmitWishFormProps {
  currentUser: User;
  onWishSubmitted: () => void;
}

export function SubmitWishForm({ currentUser, onWishSubmitted }: SubmitWishFormProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('PERSONAL_GROWTH');
  const [ageRange, setAgeRange] = useState<AgeRange>(currentUser.ageRange);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: Category[] = [
    'CAREER', 'RELATIONSHIPS', 'ADVENTURE', 'PERSONAL_GROWTH', 'CREATIVITY', 'HEALTH'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          ageRange,
          category,
        }),
      });

      if (response.ok) {
        setContent('');
        onWishSubmitted();
      }
    } catch (error) {
      console.error('Failed to submit wish:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-3xl p-8 shadow-2xl border border-[var(--color-surface-light)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-violet)] to-[var(--color-accent)] opacity-50" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[var(--color-surface-light)] flex items-center justify-center text-[var(--color-accent)]">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="font-serif text-xl font-medium text-[var(--color-text)]">Leave an Echo</h3>
          <p className="text-sm text-[var(--color-text-muted)]">Share a wish for your future self or others.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="I wish to..."
            className="w-full bg-[var(--color-bg)] border border-[var(--color-surface-light)] rounded-2xl p-5 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-violet)]/50 focus:border-transparent resize-none font-serif text-lg transition-all"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-[var(--color-bg)] border border-[var(--color-surface-light)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]/50 appearance-none transition-all text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--color-text-muted)]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Life Stage</label>
            <div className="relative">
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value as AgeRange)}
                className="w-full bg-[var(--color-bg)] border border-[var(--color-surface-light)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]/50 appearance-none transition-all text-sm"
              >
                {Object.entries(ageRangeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--color-text-muted)]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-[var(--color-surface-light)]">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="bg-[var(--color-accent)] text-[var(--color-bg)] px-6 py-3 rounded-full font-medium text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[var(--color-accent)]/20"
          >
            {isSubmitting ? 'Sending...' : 'Send to the Echo'}
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
