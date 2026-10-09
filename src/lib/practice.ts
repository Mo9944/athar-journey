import { useSyncExternalStore } from "react";
import type { Track } from "./tracks";

export type ExLevel = "مبتدئ" | "متوسط" | "متقدم";
export interface Exercise { key: string; si: number; level: ExLevel; title: string; skill: string; task: string; example?: string; steps: string[]; criteria: string[] }
export interface ExState { answer: string; checks: boolean[]; status: "started" | "applied" }
export interface ProjState { steps: boolean[]; problem: string; result: string; learned: string; link: string; paused: boolean; done: boolean }
export interface Achievement { id: string; kind: "مشروع" | "تمرين" | "تأمل" | "عمل"; title: string; desc: string; skills: string[]; result: string; link: string; lesson: string; createdAt: number }
export interface PracticeState { ex: Record<string, ExState>; proj: Record<string, ProjState>; activeProj: string | null; lastEx: string | null; achievements: Achievement[] }

const KEY = "athar-practice-v1";
const init: PracticeState = { ex: {}, proj: {}, activeProj: null, lastEx: null, achievements: [] };
let state = init; let loaded = false;
const ls = new Set<() => void>();
function load() {
  if (loaded || typeof window === "undefined") return; loaded = true;
  try { const r = localStorage.getItem(KEY); if (r) state = { ...init, ...JSON.parse(r) }; } catch { /* ignore */ }
}
export function setPractice(fn: (s: PracticeState) => Partial<PracticeState>) {
  load(); state = { ...state, ...fn(state) };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* full */ }
  ls.forEach((l) => l());
}
export function usePractice() {
  return useSyncExternalStore((cb) => { ls.add(cb); return () => ls.delete(cb); }, () => { load(); return state; }, () => init);
}

/** Graded exercises built from the learner's own track stages. */
export function exercisesFor(t: Track): Exercise[] {
  return t.stages.flatMap((st, si) => {
    const list: Exercise[] = [{
      key: `${t.id}-${si}-b`, si, level: "مبتدئ", title: `تمرين: ${st.title}`, skill: st.topics[0] ?? st.title, task: st.practice,
      steps: ["اقرأ المطلوب جيدًا وحدد الناتج", "نفّذ أبسط نسخة تعمل", "جرّبها أو راجعها بنفسك", "اكتب ما فعلته أو الصق عملك هنا"],
      criteria: ["الناتج يحقق المطلوب في التمرين", "أستطيع شرح كل خطوة بكلماتي", "جرّبت حالة مختلفة أو راجعت عملي مرة ثانية"],
    }];
    if (st.topics.length > 1) list.push({
      key: `${t.id}-${si}-m`, si, level: "متوسط", title: `اشرح ثم طبّق: ${st.topics[1]}`, skill: st.topics[1] ?? st.title,
      task: `اشرح "${st.topics[1]}" في 3 جمل بكلماتك، ثم طبّقه في مثال صغير من حياتك أو عملك.`,
      example: "مثال على الشكل: الشرح ← مثال ← ما الذي قد يخطئ فيه المبتدئ.",
      steps: ["اكتب الشرح دون الرجوع للمصدر", "قارنه بالمصدر وصحّح", "طبّقه في مثال صغير"],
      criteria: ["الشرح صحيح ومختصر", "المثال يستخدم المفهوم فعلًا", "حددت خطأً شائعًا واحدًا على الأقل"],
    });
    if (st.topics.length > 2) list.push({
      key: `${t.id}-${si}-a`, si, level: "متقدم", title: `تحدٍّ: اجمع مهارات ${st.title}`, skill: st.topics.join("، "),
      task: `صمّم مهمة صغيرة تجمع بين: ${st.topics.join("، ")} ثم نفّذها.`,
      steps: ["حدد مشكلة صغيرة حقيقية", "خطط للحل على ورقة", "نفّذ ثم حسّن مرة واحدة"],
      criteria: ["المهمة تستخدم أكثر من مفهوم", "الحل يعمل أو الناتج مكتمل", "كتبت ما ستحسّنه لاحقًا"],
    });
    return list;
  });
}

export const projKey = (t: Track, i: number) => `${t.id}-p${i}`;
export const emptyProj = (n: number): ProjState => ({ steps: Array(n).fill(false), problem: "", result: "", learned: "", link: "", paused: false, done: false });
export const REFLECT = ["ما أكثر شيء فهمته من التجربة؟", "ما الصعوبة التي واجهتك وكيف تعاملت معها؟", "ما الذي اكتشفته عن طريقة تعلمك؟", "هل ما تتعلمه ما زال مرتبطًا بهدفك؟", "ما الخطوة التي تريد تجربتها بعد ذلك؟"];
