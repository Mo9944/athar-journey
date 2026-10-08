import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Lightbulb, MessageCircle, Target } from "lucide-react";
import { PageHeader, ProgressBar } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { pathInfo } from "@/lib/journey";

export const Route = createFileRoute("/learn")({
  head: () => seo("تعلّم", "تابع التعلّم من حيث توقفت: هدفك، مرحلتك الحالية، وخطوتك التالية."),
  component: Learn,
});

const FLOW = ["افهم ماذا تحتاج", "تعلّم", "اختر المصدر", "افهم", "طبّق", "راجع", "الخطوة التالية"];

function Learn() {
  const [p, setP] = useState<ReturnType<typeof pathInfo>>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setP(pathInfo()); setReady(true); }, []);
  if (!ready) return null;
  return (
    <div>
      <PageHeader eyebrow="المرحلة الثانية" title="تعلّم" desc="تكمل من حيث توقفت. نعرض لك ما يهمك الآن فقط." />
      {p ? (
        <section className="card-soft mb-6 p-6">
          <p className="text-sm text-muted-foreground">هدفك</p>
          <p className="text-xl font-bold">{p.goal}</p>
          <p className="mt-3 text-sm">أنت الآن في: <b className="text-primary">{p.stage}</b></p>
          {p.next && <p className="text-sm">التالي: {p.next}</p>}
          <div className="my-4"><ProgressBar value={p.pct} /></div>
          <Link to="/path" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground">تعلّم الآن <ArrowLeft className="size-5" /></Link>
        </section>
      ) : (
        <section className="card-soft mb-6 p-6">
          <p className="font-semibold">لم تحدد هدفك بعد</p>
          <p className="mt-1 text-sm text-muted-foreground">حدد هدفك أولًا، وسنبني لك ما تحتاج تعلّمه.</p>
          <Link to="/path" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground">حدد هدفك <ArrowLeft className="size-5" /></Link>
        </section>
      )}
      <div className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {FLOW.map((f, i) => <span key={f}>{f}{i < FLOW.length - 1 && " ←"}</span>)}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/library" className="card-soft card-lift flex items-center gap-3 p-4"><BookOpen className="size-5 text-turquoise" /><span><b>المكتبة</b><br /><span className="text-xs text-muted-foreground">مصادر مختارة</span></span></Link>
        <Link to="/lab" className="card-soft card-lift flex items-center gap-3 p-4"><Lightbulb className="size-5 text-turquoise" /><span><b>مختبر الأفكار</b><br /><span className="text-xs text-muted-foreground">طبّق وفكّر</span></span></Link>
        <Link to="/growth" className="card-soft card-lift flex items-center gap-3 p-4"><Target className="size-5 text-turquoise" /><span><b>الأهداف والعادات</b><br /><span className="text-xs text-muted-foreground">حوّل التعلم لعادة</span></span></Link>
        <Link to="/assistant" className="card-soft card-lift flex items-center gap-3 p-4"><MessageCircle className="size-5 text-turquoise" /><span><b>اسأل المساعد</b><br /><span className="text-xs text-muted-foreground">يعرف هدفك ومرحلتك</span></span></Link>
      </div>
    </div>
  );
}
