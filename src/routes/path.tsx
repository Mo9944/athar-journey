import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Pause, Play, RotateCcw, Route as RouteIcon, Sparkle } from "lucide-react";
import { Chip, PageHeader, ProgressBar, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { PRESETS, allTopics, filterByBudget, pace, startStage, trackFor, type Track } from "@/lib/tracks";

export const Route = createFileRoute("/path")({
  head: () => seo("مساري", "حوّل هدفك إلى مسار تعلّم: مستواك، ما ينقصك، مصادر مناسبة، تطبيق، مشروع ومراجعة."),
  component: PathPage,
});

interface Journey {
  goal: string; trackId: string; level: string; time: string; budget: string;
  score: number | null; start: number; load: "light" | "normal" | "more"; paused: boolean;
  done: string[]; practice: number[]; quiz: number[]; projects: string[]; reviews: string[]; checkin: number;
}
const KEY = "athar-path-v1";
const save = (j: Journey | null) => { if (j) localStorage.setItem(KEY, JSON.stringify(j)); else localStorage.removeItem(KEY); };

function PathPage() {
  const [j, setJ] = useState<Journey | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(KEY); if (r) setJ(JSON.parse(r)); } catch { /* ignore */ } setReady(true); }, []);
  const update = (fn: (j: Journey) => Partial<Journey>) => setJ((p) => { if (!p) return p; const n = { ...p, ...fn(p) }; save(n); return n; });
  if (!ready) return null;
  return j ? <Journey j={j} update={update} reset={() => { if (confirm("إعادة بدء الرحلة؟ سيُحذف تقدّمك في هذا المسار.")) { save(null); setJ(null); } }} />
    : <Setup onDone={(n) => { save(n); setJ(n); }} />;
}

function Setup({ onDone }: { onDone: (j: Journey) => void }) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(""); const [trackId, setTrackId] = useState<string | undefined>();
  const [level, setLevel] = useState("مبتدئ"); const [time, setTime] = useState("حوالي ساعة"); const [budget, setBudget] = useState("مجاني فقط");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const t = trackFor(goal, trackId);
  const finish = (useQuiz: boolean) => {
    const score = useQuiz && t.assess.length ? t.assess.filter((a, i) => answers[i] === a.answer).length / t.assess.length : null;
    onDone({ goal, trackId: t.id, level, time, budget, score, start: startStage(level, score, t.stages.length), load: "normal", paused: false, done: [], practice: [], quiz: [], projects: [], reviews: [], checkin: Date.now() });
  };
  const steps = ["هدفي", "مستواي", "تحقق سريع"];
  return (
    <div>
      <PageHeader eyebrow="الجزء الثاني" title="من الهدف إلى الفعل" desc="ثلاث خطوات قصيرة، ثم نبني لك مسارًا واضحًا يبدأ من حيث أنت." />
      <div className="mb-6 flex gap-2">{steps.map((s, i) => <Tag key={s} tone={i === step ? "gold" : "sky"}>{i + 1}. {s}</Tag>)}</div>
      <div className="card-soft space-y-5 p-6">
        {step === 0 && <>
          <p className="font-semibold">ما هدفك؟</p>
          <div className="flex flex-wrap gap-2">{PRESETS.map((p) => <Chip key={p.goal} active={goal === p.goal} onClick={() => { setGoal(p.goal); setTrackId(p.track); }}>{p.goal}</Chip>)}</div>
          <input value={goal} onChange={(e) => { setGoal(e.target.value); setTrackId(undefined); }} placeholder="أو اكتب هدفك بكلماتك" className="w-full rounded-2xl border bg-card p-3" />
          {goal && <p className="text-sm text-muted-foreground">المسار المقترح: <b className="text-primary">{t.label}</b></p>}
          <button disabled={!goal.trim()} onClick={() => setStep(1)} className="rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50">التالي</button>
        </>}
        {step === 1 && <>
          <Q label="مستواك الحالي" opts={["مبتدئ", "عندي أساسيات", "متوسط"]} v={level} set={setLevel} />
          <Q label="وقتك المتاح يوميًا" opts={["أقل من ساعة", "حوالي ساعة", "1–2 ساعة", "أكثر"]} v={time} set={setTime} />
          <Q label="الميزانية" opts={["مجاني فقط", "يمكنني الدفع"]} v={budget} set={setBudget} />
          <div className="flex gap-2"><button onClick={() => setStep(0)} className="rounded-2xl border px-5 py-3">رجوع</button>
            <button onClick={() => setStep(2)} className="rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">التالي</button></div>
        </>}
        {step === 2 && <>
          <p className="font-semibold">أسئلة قصيرة لتحديد نقطة البداية (اختيارية)</p>
          {t.assess.map((a, i) => <div key={i} className="space-y-2"><p className="text-sm">{a.q}</p>
            <div className="flex flex-wrap gap-2">{a.options.map((o, oi) => <Chip key={o} active={answers[i] === oi} onClick={() => setAnswers({ ...answers, [i]: oi })}>{o}</Chip>)}</div></div>)}
          <div className="flex flex-wrap gap-2"><button onClick={() => setStep(1)} className="rounded-2xl border px-5 py-3">رجوع</button>
            <button onClick={() => finish(true)} disabled={!t.assess.length || Object.keys(answers).length < t.assess.length} className="rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50">ابنِ مساري</button>
            <button onClick={() => finish(false)} className="rounded-2xl border px-5 py-3">تخطَّ وابنِ المسار</button></div>
        </>}
      </div>
    </div>
  );
}

function Q({ label, opts, v, set }: { label: string; opts: string[]; v: string; set: (s: string) => void }) {
  return <div className="space-y-2"><p className="font-semibold">{label}</p><div className="flex flex-wrap gap-2">{opts.map((o) => <Chip key={o} active={v === o} onClick={() => set(o)}>{o}</Chip>)}</div></div>;
}

function Journey({ j, update, reset }: { j: Journey; update: (fn: (j: Journey) => Partial<Journey>) => void; reset: () => void }) {
  const t: Track = trackFor(j.goal, j.trackId);
  const topics = allTopics(t).filter((x) => x.si >= j.start);
  const progress = topics.length ? Math.round((topics.filter((x) => j.done.includes(x.key)).length / topics.length) * 100) : 0;
  const current = t.stages.findIndex((st, si) => si >= j.start && !(st.topics.every((_, ti) => j.done.includes(`${si}-${ti}`)) && j.practice.includes(si) && j.quiz.includes(si)));
  const perWeek = pace(j.time, j.load);
  const nextTopic = topics.find((x) => !j.done.includes(x.key));
  const needCheckin = Date.now() - j.checkin > 14 * 864e5;
  const toggle = <K extends "done" | "practice" | "quiz" | "projects" | "reviews">(k: K, v: Journey[K][number]) =>
    update((p) => { const arr = p[k] as (string | number)[]; return { [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] } as Partial<Journey>; });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="مساري" title={j.goal} desc={`مسار ${t.label} — يبدأ من المرحلة ${j.start + 1} حسب مستواك.`} />

      <div className="rounded-2xl bg-teal-grad p-6 text-primary-foreground">
        <p className="text-sm opacity-90">{j.paused ? "المسار متوقف مؤقتًا" : "خطوتك التالية الآن"}</p>
        <p className="mt-1 text-xl font-bold">{j.paused ? "استأنف عندما تكون جاهزًا" : nextTopic ? `تعلّم: ${nextTopic.name}` : current >= 0 ? `أكمل تطبيق واختبار المرحلة ${current + 1}` : "اختر مشروعًا وطبّق ما تعلمته 🎉"}</p>
        <div className="mt-4"><ProgressBar value={progress} tone="gold" /></div>
        <p className="mt-1 text-sm opacity-90">{progress}% • حوالي {perWeek} موضوع أسبوعيًا</p>
      </div>

      {needCheckin && <div className="card-soft flex flex-wrap items-center justify-between gap-3 bg-gold/15 p-4">
        <p className="font-semibold">هل ما زال هذا الهدف مناسبًا لك؟</p>
        <div className="flex gap-2"><button onClick={() => update(() => ({ checkin: Date.now() }))} className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">نعم، أكمل</button>
          <button onClick={reset} className="rounded-xl border px-4 py-2 text-sm">أريد هدفًا آخر</button></div></div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-soft p-5"><p className="mb-2 font-semibold">ما لديك</p><ul className="list-inside list-disc text-sm text-muted-foreground">{t.have.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div className="card-soft p-5"><p className="mb-2 font-semibold">ما ينقصك</p><ul className="list-inside list-disc text-sm text-muted-foreground">{t.needed.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => update((p) => ({ paused: !p.paused }))} className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm">{j.paused ? <Play className="size-4" /> : <Pause className="size-4" />}{j.paused ? "استئناف" : "إيقاف مؤقت"}</button>
        <Chip active={j.load === "light"} onClick={() => update(() => ({ load: "light" }))}>أخف</Chip>
        <Chip active={j.load === "normal"} onClick={() => update(() => ({ load: "normal" }))}>عادي</Chip>
        <Chip active={j.load === "more"} onClick={() => update(() => ({ load: "more" }))}>أكثر</Chip>
        <button onClick={reset} className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm text-muted-foreground"><RotateCcw className="size-4" />إعادة بدء الرحلة</button>
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold"><RouteIcon className="size-5 text-turquoise" />المراحل</h2>
        {t.stages.map((st, si) => {
          if (si < j.start) return <div key={si} className="card-soft p-4 text-sm text-muted-foreground">المرحلة {si + 1}: {st.title} — تجاوزتها حسب مستواك</div>;
          const res = filterByBudget(t.resources[si] ?? [], j.budget);
          const open = si === current || (current === -1 && si === t.stages.length - 1);
          return (
            <details key={si} open={open} className="card-soft p-5">
              <summary className="cursor-pointer font-bold">المرحلة {si + 1}: {st.title} {si < current || current === -1 ? "✓" : ""}</summary>
              <p className="mt-2 text-sm text-primary">بعد هذه المرحلة: {st.outcome}</p>
              <p className="mt-4 mb-2 text-sm font-semibold">أتعلّم</p>
              <div className="space-y-1">{st.topics.map((tp, ti) => { const k = `${si}-${ti}`; const d = j.done.includes(k); return (
                <button key={k} onClick={() => toggle("done", k)} className="flex w-full items-center gap-2 rounded-xl p-2 text-right text-sm hover:bg-muted">
                  <span className={`grid size-5 place-items-center rounded-md border ${d ? "bg-primary text-primary-foreground" : ""}`}>{d && <Check className="size-3.5" />}</span>{tp}</button>); })}</div>
              {res.length > 0 && <><p className="mt-4 mb-2 text-sm font-semibold">مصدر مناسب</p>
                <div className="grid gap-3 md:grid-cols-2">{res.slice(0, 2).map((r, ri) => (
                  <div key={r.name} className="rounded-xl border p-3 text-sm">
                    <div className="mb-1 flex flex-wrap gap-1">{ri === 0 && <Tag tone="gold">مقترح</Tag>}<Tag>{r.price}</Tag><Tag tone="lavender">{r.lang}</Tag></div>
                    <p className="font-semibold">{r.name} <span className="text-xs text-muted-foreground">— {r.provider}</span></p>
                    <p className="text-xs text-muted-foreground">{r.learn}</p><p className="mt-1 text-xs text-primary">لماذا؟ {r.why}</p>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary underline">فتح المصدر <ExternalLink className="size-3" /></a>
                  </div>))}</div></>}
              <div className="mt-4 rounded-xl bg-sky/50 p-3 text-sm"><p className="font-semibold">أطبّق</p><p>{st.practice}</p>
                <button onClick={() => toggle("practice", si)} className={`mt-2 rounded-lg px-3 py-1.5 text-xs ${j.practice.includes(si) ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{j.practice.includes(si) ? "طبّقته ✓" : "علّم كمُطبّق"}</button></div>
              <Quiz q={st.quiz} passed={j.quiz.includes(si)} onPass={() => !j.quiz.includes(si) && toggle("quiz", si)} />
              <button onClick={() => toggle("reviews", String(si))} className="mt-3 text-xs text-muted-foreground underline">{j.reviews.includes(String(si)) ? "✓ راجعت هذا الجزء" : "راجع هذا الجزء لاحقًا"}</button>
            </details>);
        })}
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold"><Sparkle className="size-5 text-gold" />أعمل مشروعًا</h2>
        <div className="grid gap-4 md:grid-cols-3">{t.projects.map((p) => { const d = j.projects.includes(p.title); return (
          <div key={p.title} className="card-soft flex flex-col p-5 text-sm">
            <Tag tone="lavender">{p.size}</Tag><p className="mt-2 font-bold">{p.title}</p><p className="text-muted-foreground">{p.objective}</p>
            <ol className="mt-2 list-inside list-decimal text-muted-foreground">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            <p className="mt-2 text-xs">الناتج: {p.result}</p><p className="text-xs text-primary">للملف: {p.portfolio}</p>
            <button onClick={() => toggle("projects", p.title)} className={`mt-3 rounded-xl px-3 py-2 ${d ? "bg-primary text-primary-foreground" : "border"}`}>{d ? "أنجزته ✓" : "علّم كمُنجز"}</button>
          </div>); })}</div>
      </section>

      {t.career && <section className="card-soft grid gap-4 p-5 text-sm md:grid-cols-3">
        <div><p className="font-semibold">أدوار مناسبة</p><ul className="list-inside list-disc text-muted-foreground">{t.career.roles.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div><p className="font-semibold">سيرتك الذاتية</p><ul className="list-inside list-disc text-muted-foreground">{t.career.cv.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div><p className="font-semibold">المقابلات</p><ul className="list-inside list-disc text-muted-foreground">{t.career.interview.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </section>}

      <Link to="/assistant" className="card-soft block p-4 text-sm hover:border-turquoise">عالق في خطوة؟ <b className="text-primary">اسأل المساعد</b></Link>
    </div>
  );
}

function Quiz({ q, passed, onPass }: { q: { q: string; options: string[]; answer: number }; passed: boolean; onPass: () => void }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="mt-4 text-sm"><p className="font-semibold">أراجع: {q.q}</p>
      <div className="mt-2 flex flex-wrap gap-2">{q.options.map((o, i) => <Chip key={o} active={pick === i} onClick={() => { setPick(i); if (i === q.answer) onPass(); }}>{o}</Chip>)}</div>
      {(passed || pick === q.answer) && <p className="mt-2 text-primary">إجابة صحيحة ✓</p>}
      {pick !== null && pick !== q.answer && <p className="mt-2 text-muted-foreground">ليست هذه، راجع المرحلة وحاول مجددًا.</p>}
    </div>
  );
}
