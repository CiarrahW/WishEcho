import { AgeRange, Wish } from '../types';

export const ageRangeOrder: Record<AgeRange, number> = {
  CHILDHOOD: 0,
  TEENS: 1,
  TWENTIES: 2,
  THIRTIES: 3,
  FORTIES: 4,
  FIFTIES: 5,
  SIXTIES_PLUS: 6,
};

export const ageRangeLabels: Record<AgeRange, string> = {
  CHILDHOOD: 'Childhood (0-12)',
  TEENS: 'Teens (13-19)',
  TWENTIES: 'Twenties (20-29)',
  THIRTIES: 'Thirties (30-39)',
  FORTIES: 'Forties (40-49)',
  FIFTIES: 'Fifties (50-59)',
  SIXTIES_PLUS: 'Sixties+ (60+)',
};

/**
 * Echo Filter:
 * Filters wishes to only include those from age groups strictly younger 
 * than the user's current age group.
 */
export function getEchoWishes(userAgeRange: AgeRange, allWishes: Wish[]): Wish[] {
  const userAgeIndex = ageRangeOrder[userAgeRange];
  
  return allWishes.filter(wish => {
    const wishAgeIndex = ageRangeOrder[wish.ageRange];
    return wishAgeIndex < userAgeIndex;
  });
}
