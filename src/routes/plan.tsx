import { createFileRoute, Link } from "@tanstack/react-router";
import { Map, RefreshCw, X } from "lucide-react";
import { Empty, PageHeader, ProgressBar, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { leadingCodes, setState, uid, useAthar, type AtharState, type Plan } from "@/lib/store";
import { RIASEC } from "@/lib/riasec";
import { RESOURCES } from "@/lib/library";

export const Route = createFileRoute("/plan")({
  head: () => seo("خطة التعلّم", "خطة تعلّم شخصية مقترحة بناءً على اهتماماتك ومواضيعك، مع توضيح سبب كل اقتراح."),
  component: PlanPage,
});

function buildPlan(s: AtharState, skip: number): Plan | null {
  const codes = leadingCodes(s).slice(0, 2);
  if (!codes.length && !s.exploreTopics.length) return null;
  const scored = RESOURCES.map((r) => ({ r, n: r.codes.filter((c) => codes.includes(c)).length * 2 + r.topics.filter((t) => s.exploreTopics.includes(t)).length * 3 }))
    .filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
  const picks = [...scored.slice(skip), ...scored.slice(0, skip)].slice(0, 3).map((x) => x.r);
  const topic = s.exploreTopics[skip % Math.max(1, s.exploreTopics.length)] ?? (codes[0] ? RIASEC[codes[0]].short : "موضوع جديد");
  const d = new Date(); d.setDate(d.getDate() + 14);
  return {
    id: uid(), objective: `استكشاف «${topic}» خلال أسبوعين`,
    reason: `اقترحنا هذه الخطة لأنك ${codes.length ? `أظهرت اهتمامًا بـ ${codes.map((c) => RIASEC[c].ar).join(" و")}` : ""}${codes.length && s.exploreTopics.length ? "، و" : ""}${s.exploreTopics.length ? `اخترت مواضيع مثل ${s.exploreTopics.slice(0, 2).join("، ")}` : ""}.`,
    steps: [...picks.map((r) => ({ id: uid(), text: `اقرأ/شاهد: ${r.title}`, done: false })),
      { id: uid(), text: "اكتب تأملًا قصيرًا في دفتر التأمل عمّا تعلّمته", done: false },
      { id: uid(), text: "سجّل فكرة واحدة في مختبر الأفكار", done: false }],
    topics: [topic], activities: ["قراءة", "تأمل", "تطبيق"], reviewDate: d.toISOString().slice(0, 10), status: "active",
  };
}

function PlanPage() {
  const s = useAthar();
  const active = s.plans.filter((p) => p.status === "active");
  const make = () => { const p = buildPlan(s, s.plans.length); if (p) setState((st) => ({ plans: [p, ...st.plans] })); };
  const upd = (id: string, fn: (p: Plan) => Plan) => setState((st) => ({ plans: st.plans.map((p) => (p.id === id ? fn(p) : p)) }));
  const canBuild = leadingCodes(s).length > 0 || s.exploreTopics.length > 0;

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="الجزء الثاني" title="خطة التعلّم" desc="خطط مقترحة بشفافية: نوضّح لك لماذا اقترحنا كل خطة، ويمكنك رفضها أو طلب غيرها." />
      {canBuild ? <button onClick={make} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground"><RefreshCw className="size-4" />اقترح خطة جديدة</button>
        : <Link to="/discover" className="inline-flex rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">أكمل اكتشاف ذاتك أولًا</Link>}
      {active.length === 0 ? <Empty icon={Map} title="لا خطط نشطة" desc="اطلب خطة مقترحة لتبدأ." /> : active.map((p) => {
        const done = p.steps.filter((x) => x.done).length;
        return (
          <div key={p.id} className="card-soft space-y-3 p-5">
            <div className="flex justify-between gap-2"><p className="text-lg font-bold">{p.objective}</p>
              <button onClick={() => upd(p.id, (x) => ({ ...x, status: "rejected" }))} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"><X className="size-4" />لا تناسبني</button></div>
            <p className="rounded-xl bg-sky/50 p-3 text-sm"><b>لماذا؟ </b>{p.reason}</p>
            <ProgressBar value={Math.round((done / p.steps.length) * 100)} />
            <ul className="space-y-2">{p.steps.map((st) => (
              <li key={st.id}><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={st.done} onChange={() => upd(p.id, (x) => ({ ...x, steps: x.steps.map((y) => (y.id === st.id ? { ...y, done: !y.done } : y)) }))} />
                <span className={st.done ? "line-through text-muted-foreground" : ""}>{st.text}</span></label></li>))}</ul>
            <div className="flex flex-wrap gap-2">{p.activities.map((a) => <Tag key={a} tone="lavender">{a}</Tag>)}<Tag tone="gold">مراجعة: {p.reviewDate}</Tag></div>
          </div>);
      })}
    </div>
  );
}
