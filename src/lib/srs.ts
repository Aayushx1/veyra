/** SM-2 spaced repetition, stored locally. Grades: 0 again, 3 hard, 4 good, 5 easy. */
export type Grade = 0 | 3 | 4 | 5;

export interface Card {
  ease: number;
  interval: number; // days
  reps: number;
  due: number; // epoch ms
}

export const DAY = 86_400_000;
export const newCard = (now: number): Card => ({ ease: 2.5, interval: 0, reps: 0, due: now });

export function review(card: Card, grade: Grade, now: number): Card {
  if (grade < 3) return { ...card, reps: 0, interval: 1, due: now + DAY };
  const ease = Math.max(1.3, card.ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  const reps = card.reps + 1;
  const interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(card.interval * ease);
  return { ease, reps, interval, due: now + interval * DAY };
}

export type Deck = Record<string, Card>;
const KEY = 'veyra:srs';

export function loadDeck(storage: Pick<Storage, 'getItem'> = localStorage): Deck {
  try {
    const raw = JSON.parse(storage.getItem(KEY) ?? '{}') as unknown;
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Deck) : {};
  } catch {
    return {};
  }
}

export function saveDeck(deck: Deck, storage: Pick<Storage, 'setItem'> = localStorage): void {
  try {
    storage.setItem(KEY, JSON.stringify(deck));
  } catch {
    /* storage full or blocked: progress just will not persist */
  }
}

export const isDue = (c: Card | undefined, now: number) => !c || c.due <= now;
