export type AgeRange = 
  | 'CHILDHOOD'
  | 'TEENS'
  | 'TWENTIES'
  | 'THIRTIES'
  | 'FORTIES'
  | 'FIFTIES'
  | 'SIXTIES_PLUS';

export type Category = 
  | 'CAREER'
  | 'RELATIONSHIPS'
  | 'ADVENTURE'
  | 'PERSONAL_GROWTH'
  | 'CREATIVITY'
  | 'HEALTH';

export type WishStatus = 'ACTIVE' | 'FULFILLED' | 'FORGOTTEN';
export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface User {
  id: string;
  email: string;
  name?: string;
  ageRange: AgeRange;
  createdAt: string;
}

export interface Wish {
  id: string;
  content: string;
  ageRange: AgeRange;
  category: Category;
  status: WishStatus;
  authorId: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  wishId: string;
  status: GoalStatus;
  createdAt: string;
  wishContent?: string;
  wishCategory?: Category;
}
