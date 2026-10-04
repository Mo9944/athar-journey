import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plus, Target, Trash2 } from "lucide-react";
import { Empty, PageHeader, ProgressBar } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { setState, uid, useAthar } from "@/lib/store";

export const Route = createFileRoute("/growth")({
  head: () => seo("تطوير الذات", "حدّد أهدافك الصغيرة، قسّمها إلى خطوات، وتابع عاداتك اليومية في أثر."),
  component: Growth,
});

const today = () => new Date().toISOString().slice(0, 10);
const last7 = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().slice(0, 10); });
const input = "w-full rounded-xl border bg-card px-3 py-2 outline-none focus:border-primary";

function Growth() {
  const s = useAthar();
  const [title, setTitle] = useState(""); const [why, setWhy] = useState(""); const [habit, setHabit] = useState("");
  const [task, setTask] = useState<Record<string, string>>({});
  const days = last7();

  const updGoal = (id: string, fn: (g: (typeof s.goals)[number]) => (typeof s.goals)[number]) =>
    setState((st) => ({ goals: st.goals.map((g) => (g.id === id ? fn(g) : g)) }));

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="الجزء الثاني" title="تطوير الذات" desc="أهداف صغيرة واضحة، وعادات بسيطة تتكرّر — هكذا يتحوّل التعلّم إلى أثر." />

      <section className="space-y-4">
        <h2 className="text-xl font-bold">أهدافي</h2>
        <form className="card-soft grid gap-2 p-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return;
          setState((st) => ({ goals: [{ id: uid(), title: title.trim(), why: why.trim(), tasks: [], createdAt: Date.now() }, ...st.goals] })); setTitle(""); setWhy(""); }}>
          <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="هدف صغير (مثال: أقرأ كتابًا هذا الشهر)" aria-label="الهدف" />
          <input className={input} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="لماذا يهمّني؟" aria-label="السبب" />
          <button className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground"><Plus className="size-4" />أضف</button>
        </form>
        {s.goals.length === 0 ? <Empty icon={Target} title="لا أهداف بعد" desc="ابدأ بهدف صغير يمكنك إنجازه خلال أسابيع." /> :
          <div className="grid gap-4 md:grid-cols-2">{s.goals.map((g) => {
            const done = g.tasks.filter((t) => t.done).length; const p = g.tasks.length ? Math.round((done / g.tasks.length) * 100) : 0;
            return (
              <div key={g.id} className="card-soft space-y-3 p-5">
                <div className="flex justify-between gap-2"><div><p className="font-semibold">{g.title}</p>{g.why && <p className="text-sm text-muted-foreground">{g.why}</p>}</div>
                  <button aria-label="حذف الهدف" onClick={() => setState((st) => ({ goals: st.goals.filter((x) => x.id !== g.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button></div>
                <ProgressBar value={p} />
                <ul className="space-y-1">{g.tasks.map((t) => (
                  <li key={t.id}><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={t.done} onChange={() => updGoal(g.id, (x) => ({ ...x, tasks: x.tasks.map((y) => (y.id === t.id ? { ...y, done: !y.done } : y)) }))} />
                    <span className={t.done ? "line-through text-muted-foreground" : ""}>{t.text}</span></label></li>))}</ul>
                <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = (task[g.id] ?? "").trim(); if (!v) return;
                  updGoal(g.id, (x) => ({ ...x, tasks: [...x.tasks, { id: uid(), text: v, done: false }] })); setTask({ ...task, [g.id]: "" }); }}>
                  <input className={input} value={task[g.id] ?? ""} onChange={(e) => setTask({ ...task, [g.id]: e.target.value })} placeholder="خطوة صغيرة…" aria-label="خطوة" />
                  <button aria-label="أضف خطوة" className="rounded-xl border px-3"><Plus className="size-4" /></button>
                </form>
              </div>);
          })}</div>}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">عاداتي</h2>
        <form className="card-soft flex gap-2 p-4" onSubmit={(e) => { e.preventDefault(); if (!habit.trim()) return;
          setState((st) => ({ habits: [...st.habits, { id: uid(), title: habit.trim(), days: [] }] })); setHabit(""); }}>
          <input className={input} value={habit} onChange={(e) => setHabit(e.target.value)} placeholder="عادة يومية (مثال: قراءة 10 دقائق)" aria-label="العادة" />
          <button className="rounded-xl bg-primary px-4 font-semibold text-primary-foreground">أضف</button>
        </form>
        {s.habits.map((h) => (
          <div key={h.id} className="card-soft flex flex-wrap items-center justify-between gap-3 p-4">
            <div><p className="font-semibold">{h.title}</p><p className="text-xs text-muted-foreground">{h.days.filter((d) => days.includes(d)).length}/7 هذا الأسبوع</p></div>
            <div className="flex items-center gap-1">
              {days.map((d) => { const on = h.days.includes(d); return (
                <button key={d} aria-label={d} aria-pressed={on} onClick={() => setState((st) => ({ habits: st.habits.map((x) => x.id === h.id ? { ...x, days: on ? x.days.filter((y) => y !== d) : [...x.days, d] } : x) }))}
                  className={`grid size-8 place-items-center rounded-lg border text-xs ${on ? "border-primary bg-primary text-primary-foreground" : ""} ${d === today() ? "ring-2 ring-turquoise" : ""}`}>
                  {on ? <Check className="size-4" /> : new Date(d).getDate()}</button>); })}
              <button aria-label="حذف العادة" onClick={() => setState((st) => ({ habits: st.habits.filter((x) => x.id !== h.id) }))} className="mr-2 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
            </div>
          </div>))}
      </section>
    </div>
  );
}
