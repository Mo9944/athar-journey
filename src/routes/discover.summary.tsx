import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { PageHeader, ProgressBar, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { discoveryProgress, leadingCodes, useAthar } from "@/lib/store";
import { RIASEC } from "@/lib/riasec";

export const Route = createFileRoute("/discover/summary")({
  head: () => seo("ملخّص اكتشاف الذات", "ملفك المرن لاكتشاف الذات: اهتماماتك، قيمك، نقاط قوتك، ومواضيع تريد استكشافها."),
  component: Summary,
});

function Block({ title, items, edit, tone }: { title: string; items: string[]; edit: string; tone?: "sky" | "lavender" | "gold" }) {
  return (
    <div className="card-soft p-5">
      <div className="mb-3 flex items-center justify-between"><p className="font-semibold">{title}</p>
        <Link to={edit} aria-label={`تعديل ${title}`} className="text-muted-foreground hover:text-primary"><Pencil className="size-4" /></Link></div>
      {items.length ? <div className="flex flex-wrap gap-2">{items.map((x) => <Tag key={x} tone={tone}>{x}</Tag>)}</div>
        : <p className="text-sm text-muted-foreground">لم تُضف شيئًا بعد.</p>}
    </div>
  );
}

function Summary() {
  const s = useAthar();
  const codes = leadingCodes(s).slice(0, 3);
  const p = discoveryProgress(s);
  const reflections = s.journal.slice(0, 3);
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="اكتشف ذاتك" title="ملفّك المرن لاكتشاف الذات"
        desc="صورة لما تعرفه عن نفسك الآن — وليست تصنيفًا ثابتًا. ستتغيّر مع كل تجربة جديدة، ويمكنك تحديثها متى شئت." />
      <div className="card-soft p-5"><div className="mb-1 flex justify-between text-sm"><span>اكتمال الملف</span><span className="font-semibold text-primary">{p}%</span></div><ProgressBar value={p} /></div>

      <div className="card-soft overflow-hidden">
        <div className="bg-hero p-5">
          <p className="mb-1 text-sm text-muted-foreground">اهتمامات O*NET <Tag>أدخلتها أنت</Tag></p>
          {codes.length ? (
            <div className="mt-2 flex flex-wrap gap-2">{codes.map((c, i) => (
              <span key={c} className="rounded-xl bg-card px-3 py-2 shadow-[var(--shadow-soft)]"><b className="text-primary">{i + 1}. {RIASEC[c].ar}</b> <span className="text-xs text-muted-foreground">({c})</span></span>
            ))}</div>
          ) : <Link to="/discover/results" className="text-sm text-primary underline">أدخل نتائجك</Link>}
          {codes.length > 0 && <p className="mt-3 text-sm">تفسير أثر: قد تستمتع بأنشطة تجمع بين <b>{codes.map((c) => RIASEC[c].short).join("، و")}</b>.</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Block title="قيمك" items={s.values} edit="/discover/tools" />
        <Block title="نقاط قوتك" items={s.strengths} edit="/discover/tools" tone="lavender" />
        <Block title="مجالات للتطوير" items={s.growthAreas} edit="/discover/tools" tone="gold" />
        <Block title="مواضيع تريد استكشافها" items={s.exploreTopics} edit="/discover/tools" />
      </div>

      {(s.curiosity || reflections.length > 0) && (
        <div className="card-soft p-5">
          <p className="mb-2 font-semibold">من تأملاتك</p>
          {s.curiosity && <p className="text-sm">🔎 {s.curiosity}</p>}
          {reflections.map((r) => <p key={r.id} className="mt-2 border-r-2 border-turquoise pr-3 text-sm text-muted-foreground line-clamp-2">{r.text}</p>)}
        </div>
      )}

      <div className="rounded-2xl bg-teal-grad p-6 text-primary-foreground">
        <p className="text-sm opacity-90">الجزء الثاني</p>
        <h2 className="text-xl font-bold">جاهز لتحويل ما اكتشفته إلى تعلّم؟</h2>
        <p className="mt-1 text-sm opacity-95">سنستخدم اهتماماتك ومواضيعك المختارة لاقتراح محتوى وأنشطة تناسبك.</p>
        <Link to="/learn" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-card px-5 py-3 font-semibold text-primary">انتقل إلى رحلة التعلم والتطوير <ArrowLeft className="size-5" /></Link>
      </div>
    </div>
  );
}
