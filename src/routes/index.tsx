import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, BookOpen, Sprout, ShieldCheck, ArrowLeft, Lightbulb, Target } from "lucide-react";
import { seo } from "@/lib/seo";
import { setState, useAthar } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => seo("مرحبًا بك", "أثر: رحلة هادئة لفهم اهتماماتك، تطوير تفكيرك، وتحويل ما تتعلمه إلى خطوات عملية — دون حساب أو تسجيل."),
  component: Welcome,
});

function Welcome() {
  const s = useAthar();
  return (
    <div className="min-h-dvh bg-hero">
      <div className="mx-auto max-w-5xl px-5 py-8 md:py-14">
        <div className="flex items-center gap-2">
          <span className="grid size-11 place-items-center rounded-xl bg-teal-grad text-primary-foreground"><Sprout className="size-6" /></span>
          <span className="font-display text-3xl font-bold text-primary">أثر</span>
        </div>

        <section className="mt-12 md:mt-20 max-w-2xl animate-rise">
          <p className="mb-3 inline-block rounded-full bg-gold/25 px-3 py-1 text-sm font-medium text-gold-foreground">المرحلة الأولى · رحلة من جزأين</p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">افهم نفسك،<br /><span className="text-primary">واترك أثرًا</span> فيما تتعلّم.</h1>
          <p className="mt-5 text-lg text-muted-foreground">رحلة هادئة تبدأ باكتشاف اهتماماتك، ثم تنتقل بك إلى المعرفة والتفكير والتطوير العملي. بلا حساب، وبلا تسجيل — بياناتك تبقى في متصفحك.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/discover" onClick={() => setState(() => ({ started: true }))}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5">
              {s.started ? "تابع رحلتك" : "ابدأ الرحلة"} <ArrowLeft className="size-5" />
            </Link>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border bg-card px-6 py-3.5 font-semibold hover:border-turquoise">استكشف المنصة</Link>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-2">
          <div className="card-soft card-lift p-6 animate-rise" style={{ animationDelay: "80ms" }}>
            <div className="mb-3 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-sky text-primary"><Compass className="size-5" /></span>
              <span className="text-sm font-semibold text-turquoise">الجزء الأول</span>
            </div>
            <h2 className="text-xl font-bold">اكتشف ذاتك</h2>
            <p className="mt-2 text-sm text-muted-foreground">اختبار اهتمامات O*NET، تحليل مبسّط لنتائجك، أنشطة للقيم ونقاط القوة، ودفتر تأمل خاص.</p>
          </div>
          <div className="card-soft card-lift p-6 animate-rise" style={{ animationDelay: "160ms" }}>
            <div className="mb-3 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-lavender text-primary"><BookOpen className="size-5" /></span>
              <span className="text-sm font-semibold text-turquoise">الجزء الثاني</span>
            </div>
            <h2 className="text-xl font-bold">تعلّم وطوّر أفكارك</h2>
            <p className="mt-2 text-sm text-muted-foreground">مكتبة معرفية، مختبر للأفكار والتفكير النقدي، أهداف وخطط تعلم مرنة، ومساعد تعلم ذكي.</p>
          </div>
        </section>

        <section className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          {[["رحلة متصلة", Target], ["تفكير نقدي", Lightbulb], ["لا حسابات · بياناتك محلية", ShieldCheck]].map(([t, I]) => {
            const Icon = I as typeof Target;
            return <span key={t as string} className="flex items-center gap-2"><Icon className="size-4 text-turquoise" />{t as string}</span>;
          })}
          <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">كيف نتعامل مع بياناتك؟</Link>
        </section>
      </div>
    </div>
  );
}
