import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AgeRange } from '../types';
import { ageRangeLabels } from '../utils/echoFilter';
import { Sparkles } from 'lucide-react';

interface AuthFormProps {
  onLogin: (token: string, user: any) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState<AgeRange>('TWENTIES');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const body = isLogin 
      ? { email, password } 
      : { email, password, name, ageRange };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      onLogin(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Soft background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-violet)]/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--color-surface)]/80 backdrop-blur-xl p-8 rounded-3xl border border-[var(--color-surface-light)] shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface-light)] flex items-center justify-center text-[var(--color-accent)]">
            <Sparkles size={24} />
          </div>
        </div>

        <h2 className="font-serif text-3xl text-center mb-2 font-medium">
          {isLogin ? 'Welcome back' : 'Join the Echo'}
        </h2>
        <p className="text-center text-[var(--color-text-muted)] text-sm mb-8">
          {isLogin ? 'Listen to the echoes of yesterday.' : 'Share your dreams with the future.'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-surface-light)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-violet)] transition-colors"
                  placeholder="How should we call you?"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Current Life Stage</label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value as AgeRange)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-surface-light)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-violet)] transition-colors appearance-none"
                >
                  {Object.entries(ageRangeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-surface-light)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-violet)] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-surface-light)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-violet)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-bg)] font-medium py-3 rounded-xl transition-colors mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
