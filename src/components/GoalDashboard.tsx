import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Loader2, Sparkles, Target } from 'lucide-react';

interface GoalDashboardProps {
  goals: Goal[];
  onGoalUpdate: () => void;
}

export function GoalDashboard({ goals, onGoalUpdate }: GoalDashboardProps) {
  const [steps, setSteps] = useState<Record<string, string[]>>({});
  const [loadingSteps, setLoadingSteps] = useState<Record<string, boolean>>({});

  const generateSteps = async (goal: Goal) => {
    if (steps[goal.id] || loadingSteps[goal.id] || !goal.wishContent) return;

    setLoadingSteps(prev => ({ ...prev, [goal.id]: true }));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/generate-steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ wishContent: goal.wishContent })
      });

      if (res.ok) {
        const data = await res.json();
        setSteps(prev => ({ ...prev, [goal.id]: data.steps }));
      }
    } catch (error) {
      console.error('Failed to generate steps:', error);
    } finally {
      setLoadingSteps(prev => ({ ...prev, [goal.id]: false }));
    }
  };

  const toggleGoalStatus = async (goal: Goal) => {
    const newStatus = goal.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/goals/${goal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        onGoalUpdate();
      }
    } catch (error) {
      console.error('Failed to update goal status:', error);
    }
  };

  if (goals.length === 0) {
    return (
      <div className="bg-[var(--color-surface)]/50 rounded-3xl p-12 text-center border border-[var(--color-surface-light)] border-dashed backdrop-blur-sm">
        <div className="flex justify-center mb-4">
          <Target size={32} className="text-[var(--color-accent)] opacity-50" />
        </div>
        <p className="font-serif text-xl text-[var(--color-accent)] mb-2">No goals yet.</p>
        <p className="text-[var(--color-text-muted)] text-sm">Find a wish in the Echo Feed and choose to pursue it today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Target className="text-[var(--color-accent)]" />
        <h2 className="font-serif text-3xl text-[var(--color-text)]">Your Current Goals</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-[var(--color-surface)] rounded-3xl p-8 shadow-xl relative overflow-hidden border transition-colors ${
              goal.status === 'COMPLETED' 
                ? 'border-[var(--color-accent)]/30 bg-[var(--color-bg)]/50' 
                : 'border-[var(--color-surface-light)]'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="px-3 py-1 rounded-full border border-[var(--color-surface-light)] text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-muted)] bg-[var(--color-bg)]/50">
                {goal.wishCategory?.replace('_', ' ')}
              </div>
              <button 
                onClick={() => toggleGoalStatus(goal)}
                className={`transition-colors ${goal.status === 'COMPLETED' ? 'text-[var(--color-accent)]' : 'text-[var(--color-surface-light)] hover:text-[var(--color-accent)]'}`}
              >
                {goal.status === 'COMPLETED' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
            </div>

            <p className={`font-serif text-xl leading-relaxed mb-6 ${goal.status === 'COMPLETED' ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text)]'}`}>
              "{goal.wishContent}"
            </p>

            {goal.status !== 'COMPLETED' && (
              <div className="mt-6 pt-6 border-t border-[var(--color-surface-light)]">
                {!steps[goal.id] && !loadingSteps[goal.id] ? (
                  <button
                    onClick={() => generateSteps(goal)}
                    className="w-full py-3 rounded-xl bg-[var(--color-bg)] text-[var(--color-accent)] text-sm font-medium hover:bg-[var(--color-surface-light)]/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    Get Actionable Steps
                  </button>
                ) : loadingSteps[goal.id] ? (
                  <div className="flex items-center justify-center py-4 text-[var(--color-accent)]">
                    <Loader2 className="animate-spin" size={24} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Steps for Today</h4>
                    {steps[goal.id].map((step, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                        <div className="w-5 h-5 rounded-full bg-[var(--color-bg)] border border-[var(--color-surface-light)] flex items-center justify-center text-[10px] font-medium text-[var(--color-accent)] shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
