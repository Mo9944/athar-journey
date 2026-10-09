import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { pathInfo } from "@/lib/journey";
import type { Res } from "@/lib/tracks";
import { BookOpen, Clock, ExternalLink, Check, Sparkle, Search, Bookmark } from "lucide-react";
import { Chip, Empty, PageHeader, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { leadingCodes, setState, useAthar } from "@/lib/store";
import { CATEGORIES, RESOURCES, type Resource } from "@/lib/library";
import { RIASEC } from "@/lib/riasec";

export const Route = createFileRoute("/library")({
  head: () => seo("تعلّم وطوّر أفكارك", "مكتبة معرفية مختارة في العلوم والتاريخ والفلسفة والأدب والقيم والثقافة الرقمية."),
  component: Learn,
});

function Card({ r, done, why }: { r: Resource; done: boolean; why?: string }) {
  const saved = useAthar().saved.includes(r.id);
  return (
    <article className="card-soft card-lift flex flex-col p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Tag>{r.category}</Tag>
        {r.demo && <Tag tone="gold">محتوى تجريبي</Tag>}
      </div>
      <h3 className="font-bold">{r.title}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.desc}</p>
      {why && <p className="mt-2 text-xs text-primary">لماذا مقترح؟ {why}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>{r.type}</span>
        {r.minutes && <span className="flex items-center gap-1"><Clock className="size-3.5" />{r.minutes} د</span>}
        {r.source && <span>المصدر: {r.source}</span>}
      </div>
      <div className="mt-4 flex gap-2">
        {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-xl bg-sky px-3 py-2 text-sm font-medium text-primary">زيارة <ExternalLink className="size-3.5" /></a>}
        <button onClick={() => setState((s) => ({ readDone: done ? s.readDone.filter((x) => x !== r.id) : [...s.readDone, r.id] }))}
          className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium ${done ? "bg-primary text-primary-foreground" : "border"}`}>
          <Check className="size-4" />{done ? "أنجزته" : "علّم كمُنجز"}
        </button>
        <button aria-label={saved ? "إزالة من المحفوظات" : "حفظ"} onClick={() => setState((s) => ({ saved: saved ? s.saved.filter((x) => x !== r.id) : [...s.saved, r.id] }))}
          className={`mr-auto grid size-9 place-items-center rounded-xl border ${saved ? "text-gold" : "text-muted-foreground"}`}><Bookmark className="size-4" fill={saved ? "currentColor" : "none"} /></button>
      </div>
    </article>
  );
}

type Hit = { name: string; provider: string; meta: string; why: string; url?: string | undefined };
function Group({ title, items }: { title: string; items: Hit[] }) {
  const [more, setMore] = useState(false);
  if (!items.length) return null;
  const shown = more ? items : items.slice(0, 3);
  return (
    <section className="mb-6">
      <h3 className="mb-2 text-sm font-bold text-primary">{title} <span className="text-muted-foreground">({items.length})</span></h3>
      <div className="grid gap-3 md:grid-cols-3">{shown.map((h, i) => (
        <article key={h.name + i} className="card-soft p-4">
          <p className="font-semibold">{h.name}</p>
          <p className="text-xs text-muted-foreground">{h.provider} · {h.meta}</p>
          <p className="mt-2 text-xs text-primary">لماذا أرى هذا؟ {h.why}</p>
          {h.url && <a href={h.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">زيارة <ExternalLink className="size-3.5" /></a>}
        </article>))}</div>
      {items.length > 3 && <button onClick={() => setMore(!more)} className="mt-2 text-sm font-medium text-primary underline">{more ? "عرض أقل" : "عرض المزيد"}</button>}
    </section>
  );
}

function Learn() {
  const [p, setP] = useState<ReturnType<typeof pathInfo>>(null);
  useEffect(() => { setP(pathInfo()); }, []);
  const s = useAthar();
  const codes = leadingCodes(s).slice(0, 3);
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const suggested = useMemo(() => RESOURCES.map((r) => {
    const c = r.codes.find((x) => codes.includes(x));
    const t = r.topics.find((x) => s.exploreTopics.includes(x));
    return { r, why: c ? `يرتبط باهتمامك ${RIASEC[c].ar}` : t ? `ضمن موضوع ${t} الذي اخترته` : "" };
  }).filter((x) => x.why).slice(0, 3), [codes, s.exploreTopics]);

  const groups = useMemo(() => {
    const term = q.trim(); if (!term) return null;
    const m = (t: string) => t.toLowerCase().includes(term.toLowerCase());
    const fromRes = (r: Res, why: string): Hit => ({ name: r.name, provider: r.provider, meta: `${r.price} · ${r.lang} · ${r.level}`, why, url: r.url });
    const now: Hit[] = [], goal: Hit[] = [], other: Hit[] = [];
    const seen = new Set<string>();
    if (p) p.track.resources.forEach((list, si) => list.forEach((r) => {
      const stage = p.track.stages[si]; if (!stage) return;
      if (seen.has(r.url) || !(m(r.name + r.provider + r.learn) || m(stage.title + stage.topics.join(" ")))) return;
      seen.add(r.url);
      if (si === p.si) now.push(fromRes(r, `يساعدك في مرحلتك الحالية: ${stage.title}`));
      else goal.push(fromRes(r, `جزء من هدفك "${p.goal}" — مرحلة ${stage.title}`));
    }));
    RESOURCES.filter((r) => m(r.title + r.desc + r.category)).forEach((r) => other.push({ name: r.title, provider: r.source ?? "أثر", meta: `${r.type}${r.demo ? " · محتوى تجريبي" : ""}`, why: `من تصنيف ${r.category}`, url: r.url }));
    return { now, goal, other };
  }, [q, p]);

  const list = RESOURCES.filter((r) => (!cat || r.category === cat) && (!q || (r.title + r.desc).includes(q)));

  return (
    <div>
      <PageHeader eyebrow="الجزء الثاني" title="تعلّم وطوّر أفكارك" desc="مكتبة مختارة لتوسيع معرفتك. ابدأ بما يناسب اهتماماتك، أو تجوّل بحرية." />

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Link to="/lab" className="card-soft card-lift p-4 bg-lavender/40"><p className="font-semibold">مختبر الأفكار</p><p className="text-xs text-muted-foreground">تمارين تفكير وحفظ الأفكار</p></Link>
        <Link to="/growth" className="card-soft card-lift p-4 bg-sky/50"><p className="font-semibold">الأهداف والعادات</p><p className="text-xs text-muted-foreground">خطوات صغيرة نحو التغيير</p></Link>
        <Link to="/plan" className="card-soft card-lift p-4 bg-gold/15"><p className="font-semibold">خطة تعلم مخصصة</p><p className="text-xs text-muted-foreground">مبنية على ملفك</p></Link>
      </div>

      {suggested.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><Sparkle className="size-5 text-gold" />مقترح لك</h2>
          <div className="grid gap-4 md:grid-cols-3">{suggested.map(({ r, why }) => <Card key={r.id} r={r} why={why} done={s.readDone.includes(r.id)} />)}</div>
        </section>
      ) : (
        <div className="mb-8 rounded-2xl bg-sky/60 p-4 text-sm">لتحصل على اقتراحات مخصصة، <Link to="/discover" className="font-semibold text-primary underline">أكمل اكتشاف ذاتك</Link> أو اختر مواضيع تهمّك.</div>
      )}

      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن موضوع أو مهارة أو مصدر" aria-label="بحث"
          className="w-full rounded-2xl border bg-card py-3 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        <Chip active={!cat} onClick={() => setCat(null)}>الكل</Chip>
        {CATEGORIES.map((c) => <span key={c} className="shrink-0"><Chip active={cat === c} onClick={() => setCat(c)}>{c}</Chip></span>)}
      </div>
      {groups ? (groups.now.length + groups.goal.length + groups.other.length === 0
        ? <Empty icon={BookOpen} title="لا نتائج" desc="جرّب كلمة أخرى." />
        : <div>
            {!p && <p className="mb-4 text-xs text-muted-foreground">حدد هدفك في <Link to="/path" className="text-primary underline">مساري</Link> لتظهر النتائج مرتبة حسب مرحلتك.</p>}
            <Group title="لمرحلتك الآن" items={groups.now} />
            <Group title="لهدفك" items={groups.goal} />
            <Group title="مصادر أخرى" items={groups.other} />
          </div>) :
      list.length === 0 ? <Empty icon={BookOpen} title="لا نتائج" desc="جرّب كلمة أخرى أو تصنيفًا مختلفًا." /> :
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{list.map((r) => <Card key={r.id} r={r} done={s.readDone.includes(r.id)} />)}</div>}
      <p className="mt-6 text-xs text-muted-foreground">البطاقات الموسومة بـ "محتوى تجريبي" نماذج توضيحية من أثر وليست مراجع منشورة.</p>
    </div>
  );
}
