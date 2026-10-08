import { allTopics, trackFor } from "@/lib/tracks";

export function pathInfo() {
  try {
    const raw = localStorage.getItem("athar-path-v1"); if (!raw) return null;
    const j = JSON.parse(raw) as { goal: string; trackId: string; level: string; time: string; budget: string; start: number; done: string[]; paused: boolean };
    const t = trackFor(j.goal, j.trackId);
    const topics = allTopics(t).filter((x) => x.si >= j.start);
    const next = topics.find((x) => !j.done.includes(x.key));
    const stage = t.stages[next ? next.si : t.stages.length - 1];
    const pct = topics.length ? Math.round((topics.filter((x) => j.done.includes(x.key)).length / topics.length) * 100) : 0;
    return { pct, goal: j.goal, stage: stage?.title ?? "", next: next?.name ?? "",
      text: `مساري الحالي: الهدف "${j.goal}"، المستوى ${j.level}، الوقت ${j.time}، الميزانية ${j.budget}. المرحلة الحالية: ${stage?.title ?? "-"}${next ? `، الموضوع التالي: ${next.name}` : "، أنهى كل المواضيع"}. التقدّم ${pct}%${j.paused ? " (المسار متوقف مؤقتًا)" : ""}.` };
  } catch { return null; }
}
