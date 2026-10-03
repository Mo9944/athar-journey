import { useSyncExternalStore } from "react";

export type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";

export interface JournalEntry { id: string; type: string; text: string; createdAt: number }
export interface Idea { id: string; title: string; note: string; tag: string; links: string[]; createdAt: number }
export interface Goal { id: string; title: string; why: string; tasks: { id: string; text: string; done: boolean }[]; createdAt: number }
export interface Habit { id: string; title: string; days: string[] }
export interface PlanStep { id: string; text: string; done: boolean }
export interface Plan { id: string; objective: string; reason: string; steps: PlanStep[]; topics: string[]; activities: string[]; reviewDate: string; status: "active" | "rejected" }
export interface ChatMsg { role: "user" | "assistant"; content: string }

export interface AtharState {
  started: boolean;
  onetMode: "scores" | "ranking" | null;
  scores: Partial<Record<RiasecCode, number>>;
  ranking: RiasecCode[];
  values: string[];
  strengths: string[];
  growthAreas: string[];
  learning: string[];
  curiosity: string;
  motivation: string;
  exploreTopics: string[];
  journal: JournalEntry[];
  ideas: Idea[];
  exercisesDone: string[];
  readDone: string[];
  goals: Goal[];
  habits: Habit[];
  plans: Plan[];
  chat: ChatMsg[];
}

const KEY = "athar-v1";
export const initialState: AtharState = {
  started: false, onetMode: null, scores: {}, ranking: [], values: [], strengths: [], growthAreas: [],
  learning: [], curiosity: "", motivation: "", exploreTopics: [], journal: [], ideas: [], exercisesDone: [],
  readDone: [], goals: [], habits: [], plans: [], chat: [],
};

let state: AtharState = initialState;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initialState, ...JSON.parse(raw) };
  } catch { /* ignore corrupt data */ }
}

export function setState(fn: (s: AtharState) => Partial<AtharState>) {
  load();
  state = { ...state, ...fn(state) };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full */ }
  listeners.forEach((l) => l());
}

export function clearAll() {
  localStorage.removeItem(KEY);
  state = initialState;
  listeners.forEach((l) => l());
}

export function useAthar(): AtharState {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => { load(); return state; },
    () => initialState,
  );
}

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Ordered leading codes: from scores if present, otherwise user ranking. */
export function leadingCodes(s: AtharState): RiasecCode[] {
  if (s.onetMode === "scores") {
    return (Object.entries(s.scores) as [RiasecCode, number][])
      .filter(([, v]) => typeof v === "number")
      .sort((a, b) => b[1] - a[1]).map(([k]) => k);
  }
  return s.ranking;
}

export function discoveryProgress(s: AtharState) {
  const parts = [
    leadingCodes(s).length > 0,
    s.values.length > 0,
    s.strengths.length > 0,
    s.learning.length > 0,
    !!s.curiosity || !!s.motivation,
    s.journal.length > 0,
  ];
  return Math.round((parts.filter(Boolean).length / parts.length) * 100);
}
