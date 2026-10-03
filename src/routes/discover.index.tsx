import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, ClipboardList, Heart, NotebookPen, UserRound, ArrowLeft, Info, CheckCircle2 } from "lucide-react";
import { PageHeader, ProgressBar } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { discoveryProgress, leadingCodes, useAthar } from "@/lib/store";
import { RIASEC } from "@/lib/riasec";

export const Route = createFileRoute("/discover/")({
  head: () => seo("اكتشف ذاتك", "ابدأ رحلة اكتشاف اهتماماتك عبر اختبار O*NET، ثم سجّل نتائجك واحصل على تحليل مبسّط."),
  component: Discover,
});

export const ONET_URL = "https://onetinterestprofiler.org/p/activities";

function Discover() {
  const s = useAthar();
  const codes = leadingCodes(s);
  const progress = discoveryProgress(s);
  const steps = [
    { n: 1, title: "أجرِ اختبار الاهتمامات", done: codes.length > 0 },
    { n: 2, title: "سجّل نتائجك في أثر", done: codes.length > 0, to: "/discover/results" as const },
    { n: 3, title: "اقرأ التحليل وتأمّل فيه", done: codes.length > 0, to: "/discover/analysis" as const },
    { n: 4, title: "أنشطة القيم ونقاط القوة", done: s.values.length > 0 || s.strengths.length > 0, to: "/discover/tools" as const },
    { n: 5, title: "ملخّص اكتشاف الذات", done: progress >= 80, to: "/discover/summary" as const },
  ];

  return (
    <div>
      <PageHeader eyebrow="الجزء الأول" title="اكتشف ذاتك"
        desc="اكتشاف الذات ليس بحثًا عن إجابة نهائية، بل محاولة لفهم ما يثير فضولك ويمنحك طاقة. هنا تبدأ بالتعرّف على اهتماماتك، ثم تتأمل فيها بهدوء.">
        <div className="mt-5 max-w-md">
          <div className="mb-1 flex justify-between text-sm"><span>تقدّمك في هذا الجزء</span><span className="font-semibold text-primary">{progress}%</span></div>
          <ProgressBar value={progress} />
        </div>
      </PageHeader>

      <section className="card-soft overflow-hidden">
        <div className="bg-teal-grad p-6 text-primary-foreground md:p-8">
          <p className="text-sm opacity-90">الخطوة الأولى</p>
          <h2 className="mt-1 text-2xl font-bold">اختبار اكتشاف الاهتمامات (O*NET Interest Profiler)</h2>
          <p className="mt-2 max-w-2xl opacity-95">اختبار مجاني ومعروف يطرح عليك أسئلة عن أنشطة متنوعة، ويعرض لك اهتماماتك في ستة مجالات (RIASEC). يستغرق تقريبًا 10–15 دقيقة، وهو باللغة الإنجليزية.</p>
          <a href={ONET_URL} target="_blank" rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-card px-5 py-3 font-semibold text-primary transition-transform hover:-translate-y-0.5">
            ابدأ اختبار اكتشاف اهتماماتك <ExternalLink className="size-4" />
          </a>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
          <div className="flex gap-3">
            <Info className="mt-1 size-5 shrink-0 text-turquoise" />
            <p className="text-sm text-muted-foreground"><b className="text-foreground">مهم:</b> سيفتح الاختبار في نافذة جديدة على موقع خارجي. أثر غير متصل به ولا يستلم نتائجك تلقائيًا. بعد الانتهاء، عُد إلى هنا وأدخل نتائجك يدويًا.</p>
          </div>
          <div className="flex gap-3">
            <Info className="mt-1 size-5 shrink-0 text-gold" />
            <p className="text-sm text-muted-foreground">الاختبار يستكشف <b className="text-foreground">اهتماماتك</b> فقط — وليس قدراتك، ولا تشخيصًا لشخصيتك، ولا يضمن مسارًا مهنيًا. والاهتمامات تتغيّر مع التجربة والتعلّم.</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-3">
        {steps.map((st) => {
          const inner = (
            <div className="card-soft card-lift flex items-center gap-4 p-4">
              <span className={`grid size-10 shrink-0 place-items-center rounded-full font-bold ${st.done ? "bg-primary text-primary-foreground" : "bg-sky text-primary"}`}>
                {st.done ? <CheckCircle2 className="size-5" /> : st.n}
              </span>
              <span className="flex-1 font-medium">{st.title}</span>
              {st.to && <ArrowLeft className="size-5 text-muted-foreground" />}
            </div>
          );
          return st.to ? <Link key={st.n} to={st.to}>{inner}</Link> : <a key={st.n} href={ONET_URL} target="_blank" rel="noopener noreferrer">{inner}</a>;
        })}
      </section>

      {codes.length > 0 && (
        <section className="mt-8 card-soft p-6">
          <p className="text-sm text-muted-foreground">اهتماماتك البارزة (كما أدخلتها)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {codes.slice(0, 3).map((c) => <span key={c} className="rounded-xl bg-sky px-3 py-1.5 font-semibold text-primary">{RIASEC[c].ar} ({c})</span>)}
          </div>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link to="/discover/results" className="card-soft card-lift p-5"><ClipboardList className="mb-2 size-6 text-primary" /><p className="font-semibold">إدخال النتائج</p><p className="text-sm text-muted-foreground">بالدرجات أو بالترتيب</p></Link>
        <Link to="/discover/tools" className="card-soft card-lift p-5"><Heart className="mb-2 size-6 text-primary" /><p className="font-semibold">أنشطة اختيارية</p><p className="text-sm text-muted-foreground">القيم، القوة، التعلّم</p></Link>
        <Link to="/journal" className="card-soft card-lift p-5"><NotebookPen className="mb-2 size-6 text-primary" /><p className="font-semibold">دفتر التأمل</p><p className="text-sm text-muted-foreground">خاص ومحفوظ محليًا</p></Link>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/discover/summary" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground"><UserRound className="size-5" />ملخّص اكتشاف الذات</Link>
        <Link to="/learn" className="inline-flex items-center gap-2 rounded-2xl border bg-card px-5 py-3 font-semibold">تخطَّ إلى رحلة التعلم</Link>
      </div>
    </div>
  );
}
