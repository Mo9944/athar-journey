import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, HelpCircle, Lightbulb, MessageCircle, Pause, Play, Search, Trophy } from "lucide-react";
import { Chip, PageHeader, ProgressBar, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { pathInfo } from "@/lib/journey";
import { emptyProj, exercisesFor, projKey, REFLECT, setPractice, usePractice, type Exercise } from "@/lib/practice";
import { uid } from "@/lib/store";

export const Route = createFileRoute("/practice")({
  head: () => seo("طبّق بنفسك", "تمارين عملية ومشروعات صغيرة مرتبطة بهدفك ومرحلتك، لتحويل ما تتعلمه إلى مهارة."),
  component: Practice,
});

const ask = (q: string) => ({ to: "/assistant" as const, search: { q } });

function ExerciseCard({ e }: { e: Exercise }) {
  const ps = usePractice();
  const st = ps.ex[e.key] ?? { answer: "", checks: e.criteria.map(() => false), status: "started" as const };
  const [hint, setHint] = useState(false);
  const save = (patch: Partial<typeof st>) => setPractice((s) => ({ lastEx: e.key, ex: { ...s.ex, [e.key]: { ...st, ...patch } } }));
  const ready = st.answer.trim().length > 0 && st.checks.every(Boolean);
  return (
    <article className="card-soft p-5">
      <div className="mb-2 flex flex-wrap gap-2"><Tag>{e.level}</Tag><Tag tone="lavender">المهارة: {e.skill}</Tag>{st.status === "applied" && <Tag tone="gold">طبّقته</Tag>}</div>
      <h3 className="text-lg font-bold">{e.title}</h3>
      <p className="mt-2">{e.task}</p>
      {e.example && <p className="mt-2 text-sm text-muted-foreground">{e.example}</p>}
      <ol className="mt-3 list-inside list-decimal space-y-1 text-sm">{e.steps.map((x) => <li key={x}>{x}</li>)}</ol>
      <label className="mt-4 block text-sm font-semibold" htmlFor={`a-${e.key}`}>إجابتك أو ما أنجزته (نص، كود، أو رابط لعملك)</label>
      <textarea id={`a-${e.key}`} value={st.answer} onChange={(x) => save({ answer: x.target.value })} rows={5} dir="auto"
        className="mt-1 w-full rounded-2xl border bg-card p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      <p className="mt-1 text-xs text-muted-foreground">أثر لا تشغّل الكود ولا تتحقق منه آليًا؛ شغّله على جهازك، ثم قيّم عملك بالمعايير التالية.</p>
      <fieldset className="mt-3 space-y-2"><legend className="mb-1 text-sm font-semibold">طريقة التحقق</legend>
        {e.criteria.map((c, i) => (
          <label key={c} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!st.checks[i]} onChange={() => save({ checks: st.checks.map((v, j) => (j === i ? !v : v)) })} className="size-4 accent-[var(--primary)]" />{c}</label>
        ))}
      </fieldset>
      <div className="mt-4 flex flex-wrap gap-2">
        <button disabled={!ready} onClick={() => save({ status: "applied" })} className="inline-flex items-center gap-1 rounded-2xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-40"><Check className="size-4" />سجّلته كتطبيق</button>
        <button onClick={() => setHint(!hint)} className="inline-flex items-center gap-1 rounded-2xl border px-4 py-2.5 text-sm"><HelpCircle className="size-4" />تلميح</button>
        <Link {...ask(`راجع إجابتي على هذا التمرين ووضّح الأخطاء وأسبابها واقترح تحسينًا، بدون أن تدّعي أنك شغّلت الكود.\nالتمرين: ${e.task}\nإجابتي:\n${st.answer || "(لم أكتب بعد)"}`)} className="inline-flex items-center gap-1 rounded-2xl border px-4 py-2.5 text-sm"><MessageCircle className="size-4" />راجع إجابتي مع المساعد</Link>
      </div>
      {hint && <div className="mt-3 rounded-2xl bg-sky/60 p-3 text-sm">
        ابدأ بتقسيم المطلوب: ما المدخل؟ ما الناتج؟ ما الخطوة بينهما؟ إن احتجت أكثر:
        <Link {...ask(`أعطني تلميحًا واحدًا فقط (بدون الحل الكامل) لهذا التمرين: ${e.task}`)} className="mr-1 font-semibold text-primary underline">اطلب تلميحًا من المساعد</Link>
        أو <Link {...ask(`هذا التمرين صعب علي، اقترح تمرينًا بديلًا أسهل على نفس المهارة: ${e.skill}`)} className="font-semibold text-primary underline">تمرينًا أسهل</Link>.
      </div>}
    </article>
  );
}

function Practice() {
  const ps = usePractice();
  const [p, setP] = useState<ReturnType<typeof pathInfo>>(null);
  const [ready, setReady] = useState(false);
  const [more, setMore] = useState(false);
  const [lvl, setLvl] = useState<string | null>(null);
  useEffect(() => { setP(pathInfo()); setReady(true); }, []);
  const exs = useMemo(() => (p ? exercisesFor(p.track) : []), [p]);
  if (!ready) return null;
  if (!p) return (
    <div><PageHeader eyebrow="المرحلة الثانية" title="طبّق بنفسك" desc="حوّل ما تتعلمه إلى مهارة تستخدمها." />
      <section className="card-soft p-6"><p className="font-semibold">نحتاج هدفك أولًا</p><p className="mt-1 text-sm text-muted-foreground">حدد هدفك في دقيقة، ثم نقترح لك تمرينًا مناسبًا لمستواك.</p>
        <Link to="/path" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground">حدد هدفك <ArrowLeft className="size-5" /></Link></section></div>
  );

  const t = p.track;
  const startLvl = p.level === "متوسط" ? "متوسط" : "مبتدئ";
  const stageEx = exs.filter((e) => e.si === p.si);
  const main = (ps.lastEx && exs.find((e) => e.key === ps.lastEx && ps.ex[e.key]?.status !== "applied"))
    ?? stageEx.find((e) => ps.ex[e.key]?.status !== "applied" && (e.level === startLvl || e.level === "مبتدئ")) ?? stageEx.find((e) => ps.ex[e.key]?.status !== "applied") ?? exs.find((e) => ps.ex[e.key]?.status !== "applied");
  const extra = exs.filter((e) => e !== main && (!lvl || e.level === lvl));

  const pi = ps.activeProj ? t.projects.findIndex((_, i) => projKey(t, i) === ps.activeProj) : -1;
  const proj = pi >= 0 ? t.projects[pi] : undefined;
  const pk = proj ? projKey(t, pi) : "";
  const pst = proj ? ps.proj[pk] ?? emptyProj(proj.steps.length) : null;
  const saveP = (patch: object) => setPractice((s) => ({ proj: { ...s.proj, [pk]: { ...(pst as object), ...patch } as typeof pst & object } }));
  const nextProj = t.projects.findIndex((_, i) => !ps.proj[projKey(t, i)]?.done);

  // Real progress, per stage
  const applied = exs.filter((e) => ps.ex[e.key]?.status === "applied");
  const seen = p.done.length;
  const projDone = t.projects.filter((_, i) => ps.proj[projKey(t, i)]?.done).length;
  const toPractice = t.stages.map((s, si) => ({ s, ok: exs.some((e) => e.si === si && ps.ex[e.key]?.status === "applied") })).filter((x) => !x.ok).slice(0, 2);

  function finishProject() {
    if (!proj || !pst) return;
    setPractice((s) => ({ activeProj: null, proj: { ...s.proj, [pk]: { ...pst, done: true } },
      achievements: [{ id: uid(), kind: "مشروع", title: proj.title, desc: pst.problem || proj.objective, skills: proj.skills, result: pst.result || proj.result, link: pst.link, lesson: pst.learned, createdAt: Date.now() }, ...s.achievements] }));
  }

  return (
    <div>
      <PageHeader eyebrow="المرحلة الثانية — التطبيق" title="طبّق بنفسك" desc="تمرين واحد واضح الآن. الباقي اختياري ومتاح عندما تريد." />
      <section className="card-soft mb-6 p-5 text-sm">
        <p>هدفك: <b>{p.goal}</b> · أنت في: <b className="text-primary">{t.stages[p.si]?.title}</b></p>
        {p.next && <p className="mt-1 text-muted-foreground">تتعلّم الآن: {p.next} — <Link to="/path" className="text-primary underline">العودة إلى ما أتعلمه</Link></p>}
      </section>

      {main ? <ExerciseCard e={main} /> : <p className="card-soft p-5">أكملت كل التمارين المتاحة لمسارك. جرّب مشروعًا أدناه.</p>}
      <div className="mt-3 rounded-2xl bg-lavender/50 p-4 text-sm">
        <p className="font-semibold">اكتشفت أن شيئًا ينقصك؟</p>
        <p className="mt-1 text-muted-foreground">لا تبدأ من الصفر. سيبقى تمرينك محفوظًا هنا، تعلّم الجزء الناقص ثم عُد.</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link to="/path" className="inline-flex items-center gap-1 font-semibold text-primary underline"><Search className="size-4" />مصادر مرحلتك</Link>
          {main && <Link {...ask(`أعمل على تمرين "${main.title}" وأشعر أن مهارة ${main.skill} تنقصني. اشرحها باختصار وحدد ما أحتاج تعلمه فقط لأكمل التمرين.`)} className="inline-flex items-center gap-1 font-semibold text-primary underline"><MessageCircle className="size-4" />حدد ما ينقصني مع المساعد</Link>}
        </div>
      </div>

      <button onClick={() => setMore(!more)} className="mt-6 text-sm font-semibold text-primary underline">{more ? "إخفاء التدريبات الإضافية" : `تدريبات إضافية (${extra.length})`}</button>
      {more && <div className="mt-3 space-y-4">
        <div className="flex flex-wrap gap-2"><Chip active={!lvl} onClick={() => setLvl(null)}>الكل</Chip>{["مبتدئ", "متوسط", "متقدم"].map((l) => <Chip key={l} active={lvl === l} onClick={() => setLvl(l)}>{l}</Chip>)}</div>
        {extra.slice(0, 4).map((e) => <ExerciseCard key={e.key} e={e} />)}
      </div>}

      <h2 className="mb-3 mt-10 flex items-center gap-2 text-lg font-bold"><Lightbulb className="size-5 text-gold" />مشروعك</h2>
      {proj && pst ? (
        <section className="card-soft p-5">
          <div className="mb-2 flex flex-wrap gap-2"><Tag>{proj.size}</Tag>{pst.paused && <Tag tone="gold">متوقف مؤقتًا</Tag>}</div>
          <h3 className="text-lg font-bold">{proj.title}</h3>
          <p className="text-sm text-muted-foreground">الهدف: {proj.objective} · المهارات: {proj.skills.join("، ")} · الأدوات: {proj.tools.join("، ")}</p>
          <label className="mt-4 block text-sm font-semibold">1. ما المشكلة التي يحلها مشروعك؟</label>
          <textarea value={pst.problem} onChange={(x) => saveP({ problem: x.target.value })} rows={2} className="mt-1 w-full rounded-2xl border bg-card p-3 text-sm" />
          <label className="mt-3 block text-sm font-semibold">2. ما النتيجة النهائية المطلوبة؟</label>
          <textarea value={pst.result} onChange={(x) => saveP({ result: x.target.value })} placeholder={proj.result} rows={2} className="mt-1 w-full rounded-2xl border bg-card p-3 text-sm" />
          <p className="mt-3 text-sm font-semibold">3. نفّذ خطوة بخطوة</p>
          <div className="mb-2 mt-1"><ProgressBar value={(pst.steps.filter(Boolean).length / proj.steps.length) * 100} /></div>
          {proj.steps.map((x, i) => <label key={x} className="flex items-center gap-2 py-1 text-sm"><input type="checkbox" checked={!!pst.steps[i]} onChange={() => saveP({ steps: pst.steps.map((v, j) => (j === i ? !v : v)) })} className="size-4" />{x}</label>)}
          <label className="mt-3 block text-sm font-semibold">4. رابط العمل (اختياري)</label>
          <input value={pst.link} onChange={(x) => saveP({ link: x.target.value })} dir="ltr" placeholder="https://" className="mt-1 w-full rounded-2xl border bg-card p-3 text-sm" />
          <label className="mt-3 block text-sm font-semibold">5. ماذا تعلمت؟ (اختياري)</label>
          <textarea value={pst.learned} onChange={(x) => saveP({ learned: x.target.value })} placeholder={REFLECT[0]} rows={2} className="mt-1 w-full rounded-2xl border bg-card p-3 text-sm" />
          <details className="mt-2 text-xs text-muted-foreground"><summary className="cursor-pointer">أسئلة للتأمل (اختيارية)</summary><ul className="mt-1 list-inside list-disc">{REFLECT.map((r) => <li key={r}>{r}</li>)}</ul></details>
          <div className="mt-4 flex flex-wrap gap-2">
            <button disabled={!pst.steps.every(Boolean)} onClick={finishProject} className="inline-flex items-center gap-1 rounded-2xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-40"><Trophy className="size-4" />أنهيت المشروع — احفظه في إنجازاتي</button>
            <button onClick={() => saveP({ paused: !pst.paused })} className="inline-flex items-center gap-1 rounded-2xl border px-4 py-2.5 text-sm">{pst.paused ? <><Play className="size-4" />استئناف</> : <><Pause className="size-4" />إيقاف مؤقت</>}</button>
            <button onClick={() => setPractice(() => ({ activeProj: null }))} className="rounded-2xl border px-4 py-2.5 text-sm">اختر فكرة أخرى</button>
            <Link {...ask(`أعمل على مشروع "${proj.title}". المشكلة: ${pst.problem || "-"}. أنجزت ${pst.steps.filter(Boolean).length} من ${proj.steps.length} خطوات. ساعدني في الخطوة التالية بتلميحات وأسئلة، لا بالحل الكامل.`)} className="inline-flex items-center gap-1 rounded-2xl border px-4 py-2.5 text-sm"><MessageCircle className="size-4" />ساعدني مع المساعد</Link>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">تقدّمك محفوظ حتى لو غيّرت الفكرة أو أوقفت المشروع.</p>
        </section>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">{t.projects.map((pr, i) => {
          const d = ps.proj[projKey(t, i)];
          return (
            <article key={pr.title} className={`card-soft p-4 ${i === nextProj ? "ring-2 ring-turquoise" : "opacity-90"}`}>
              <Tag>{pr.size}</Tag>{d?.done && <span className="mr-2"><Tag tone="gold">أنجزته</Tag></span>}
              <p className="mt-2 font-semibold">{pr.title}</p><p className="text-xs text-muted-foreground">{pr.objective}</p>
              {i === nextProj && <p className="mt-1 text-xs text-primary">مقترح لك الآن: يناسب ما وصلت إليه.</p>}
              {!d?.done && <button onClick={() => setPractice(() => ({ activeProj: projKey(t, i) }))} className="mt-3 rounded-xl border px-3 py-1.5 text-sm">{d ? "تابع" : "ابدأ"}</button>}
            </article>);
        })}</div>
      )}

      <h2 className="mb-3 mt-10 text-lg font-bold">ما الذي تحسّن لديك؟</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card-soft p-4"><p className="text-2xl font-bold">{seen}</p><p className="text-sm text-muted-foreground">موضوعات اطّلعت عليها</p></div>
        <div className="card-soft p-4"><p className="text-2xl font-bold text-primary">{applied.length}</p><p className="text-sm text-muted-foreground">تمارين طبّقتها وقيّمتها</p></div>
        <div className="card-soft p-4"><p className="text-2xl font-bold text-gold">{projDone}</p><p className="text-sm text-muted-foreground">مشروعات أنجزتها</p></div>
      </div>
      <p className="mt-3 text-sm">مهارات مارستها: {applied.length ? [...new Set(applied.map((e) => e.skill))].join("، ") : "لا شيء بعد — ابدأ بالتمرين أعلاه."}</p>
      {toPractice.length > 0 && <p className="mt-1 text-sm text-muted-foreground">تحتاج ممارسة: {toPractice.map((x) => x.s.title).join("، ")}</p>}
      <p className="mt-1 text-xs text-muted-foreground">هذه مؤشرات تقييمك الذاتي، وليست شهادة إتقان.</p>
      <Link to="/achievements" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary underline"><Trophy className="size-4" />إنجازاتي ({ps.achievements.length})</Link>
    </div>
  );
}
