import React, { useEffect, useState } from 'react';
import { Category, User, Wish, Goal } from './types';
import { getEchoWishes } from './utils/echoFilter';
import { Header } from './components/Header';
import { WishCard } from './components/WishCard';
import { SubmitWishForm } from './components/SubmitWishForm';
import { AuthForm } from './components/AuthForm';
import { GoalDashboard } from './components/GoalDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Target, Radio } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [currentView, setCurrentView] = useState<'feed' | 'goals'>('feed');

  const categories: Category[] = [
    'CAREER', 'RELATIONSHIPS', 'ADVENTURE', 'PERSONAL_GROWTH', 'CREATIVITY', 'HEALTH'
  ];

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        setIsAuthenticated(true);
        fetchWishes();
        fetchGoals(token);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes');
      if (res.ok) {
        const allWishes = await res.json();
        setWishes(allWishes);
      }
    } catch (error) {
      console.error('Failed to fetch wishes:', error);
    }
  };

  const fetchGoals = async (token?: string) => {
    const t = token || localStorage.getItem('token');
    if (!t) return;
    try {
      const res = await fetch('/api/goals', {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      if (res.ok) {
        const allGoals = await res.json();
        setGoals(allGoals);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = (token: string, user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    fetchWishes();
    fetchGoals(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setWishes([]);
    setGoals([]);
    setCurrentView('feed');
  };

  const handlePursueWish = async (wishId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ wishId })
      });

      if (res.ok) {
        fetchGoals(token);
        setCurrentView('goals');
      }
    } catch (error) {
      console.error('Failed to pursue wish:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="w-12 h-12 border-4 border-[var(--color-surface-light)] border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  // Apply the Echo Filter: only show wishes from younger age groups
  let echoWishes = currentUser ? getEchoWishes(currentUser.ageRange, wishes) : [];
  
  // Apply Category Filter
  if (selectedCategory !== 'ALL') {
    echoWishes = echoWishes.filter(w => w.category === selectedCategory);
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans selection:bg-[var(--color-violet)]/30 relative overflow-x-hidden">
      {/* Soft background gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-violet)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-accent)]/5 rounded-full blur-[120px]" />
      </div>

      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-[var(--color-surface)] p-1.5 rounded-full border border-[var(--color-surface-light)] shadow-sm flex gap-2">
            <button
              onClick={() => setCurrentView('feed')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                currentView === 'feed'
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg)] shadow-md'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Radio size={16} />
              Echo Feed
            </button>
            <button
              onClick={() => setCurrentView('goals')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                currentView === 'goals'
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg)] shadow-md'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Target size={16} />
              My Goals
              {goals.filter(g => g.status === 'IN_PROGRESS').length > 0 && (
                <span className={`ml-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  currentView === 'goals' ? 'bg-[var(--color-bg)] text-[var(--color-accent)]' : 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                }`}>
                  {goals.filter(g => g.status === 'IN_PROGRESS').length}
                </span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentView === 'feed' ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Left Column: Intro & Form */}
              <div className="lg:col-span-4 space-y-12">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-serif text-5xl md:text-6xl leading-[1.1] font-light tracking-tight mb-6 text-[var(--color-text)]">
                    Listen to the <br />
                    <span className="italic text-[var(--color-violet-light)]">echoes</span> of <br />
                    yesterday.
                  </h2>
                  <p className="text-[var(--color-text-muted)] leading-relaxed text-lg mb-8 max-w-md">
                    Rediscover forgotten dreams. These are wishes from people in life stages you've already passed. What advice would you give them? What dreams did you leave behind?
                  </p>
                </motion.div>

                {currentUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <SubmitWishForm currentUser={currentUser} onWishSubmitted={fetchWishes} />
                  </motion.div>
                )}
              </div>

              {/* Middle Column: Filter Sidebar */}
              <div className="lg:col-span-2">
                <div className="sticky top-32">
                  <div className="flex items-center gap-2 mb-6 text-[var(--color-text-muted)]">
                    <Filter size={16} />
                    <h3 className="text-sm font-medium uppercase tracking-wider">Filters</h3>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedCategory('ALL')}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === 'ALL' 
                          ? 'bg-[var(--color-surface)] text-[var(--color-accent)] border border-[var(--color-surface-light)]' 
                          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/50 hover:text-[var(--color-text)] border border-transparent'
                      }`}
                    >
                      All Echoes
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          selectedCategory === cat 
                            ? 'bg-[var(--color-surface)] text-[var(--color-accent)] border border-[var(--color-surface-light)]' 
                            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/50 hover:text-[var(--color-text)] border border-transparent'
                        }`}
                      >
                        {cat.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: The Echoes (Filtered Wishes) */}
              <div className="lg:col-span-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif text-2xl text-[var(--color-text)]">Echoes from the past</h3>
                  <div className="text-xs font-medium uppercase tracking-widest text-[var(--color-violet-light)] bg-[var(--color-surface)] px-3 py-1 rounded-full border border-[var(--color-surface-light)]">
                    {echoWishes.length} wishes found
                  </div>
                </div>

                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {echoWishes.length > 0 ? (
                      echoWishes.map((wish, index) => (
                        <WishCard 
                          key={wish.id} 
                          wish={wish} 
                          index={index} 
                          onPursue={() => handlePursueWish(wish.id)}
                        />
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[var(--color-surface)]/50 rounded-3xl p-12 text-center border border-[var(--color-surface-light)] border-dashed backdrop-blur-sm"
                      >
                        <p className="font-serif text-xl text-[var(--color-violet-light)] mb-2">The echo is quiet.</p>
                        <p className="text-[var(--color-text-muted)] text-sm">No wishes found for this category from younger age groups.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <GoalDashboard goals={goals} onGoalUpdate={() => fetchGoals()} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
