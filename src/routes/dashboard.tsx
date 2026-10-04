import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Lightbulb, Map, MessageCircle, NotebookPen, Target } from "lucide-react";
import { PageHeader, ProgressBar, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { discoveryProgress, leadingCodes, useAthar } from "@/lib/store";
import { RIASEC } from "@/lib/riasec";

export const Route = createFileRoute("/dashboard")({
  head: () => seo("لوحتي", "نظرة شاملة على رحلتك في أثر: اكتشاف الذات، التعلّم، الأهداف، والعادات."),
  component: Dashboard,
});

function Dashboard() {
  const s = useAthar();
  const p = discoveryProgress(s);
  const codes = leadingCodes(s).slice(0, 3);
  const tasks = s.goals.flatMap((g) => g.tasks);
  const tasksP = tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0;
  const plan = s.plans.find((x) => x.status === "active");
  const next = p < 100 ? { to: "/discover", label: "أكمل اكتشاف ذاتك" } : !plan ? { to: "/plan", label: "اطلب خطة تعلّم" } : { to: "/growth", label: "تابع أهدافك" };
  const stats = [
    { icon: NotebookPen, n: s.journal.length, l: "تأملات", to: "/journal" },
    { icon: Lightbulb, n: s.ideas.length, l: "أفكار", to: "/lab" },
    { icon: Target, n: s.goals.length, l: "أهداف", to: "/growth" },
    { icon: Map, n: s.plans.filter((x) => x.status === "active").length, l: "خطط نشطة", to: "/plan" },
  ] as const;

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="مرحبًا بك" title="لوحتي" desc="أين وصلت في رحلتك، وما الخطوة التالية." />
      <div className="rounded-2xl bg-teal-grad p-6 text-primary-foreground">
        <p className="text-sm opacity-90">خطوتك التالية</p>
        <Link to={next.to} className="mt-2 inline-flex rounded-2xl bg-card px-5 py-3 font-semibold text-primary">{next.label}</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-soft space-y-2 p-5"><div className="flex justify-between"><p className="font-semibold"><Compass className="inline size-4" /> اكتشاف الذات</p><span className="text-primary">{p}%</span></div><ProgressBar value={p} />
          <div className="flex flex-wrap gap-2">{codes.map((c) => <Tag key={c}>{RIASEC[c].ar}</Tag>)}</div></div>
        <div className="card-soft space-y-2 p-5"><div className="flex justify-between"><p className="font-semibold"><Target className="inline size-4" /> إنجاز الخطوات</p><span className="text-primary">{tasksP}%</span></div><ProgressBar value={tasksP} tone="gold" />
          <p className="text-sm text-muted-foreground">{plan ? `الخطة الحالية: ${plan.objective}` : "لا خطة نشطة بعد."}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{stats.map((x) => (
        <Link key={x.l} to={x.to} className="card-soft p-4 text-center hover:border-turquoise"><x.icon className="mx-auto mb-1 size-6 text-turquoise" /><p className="text-2xl font-bold">{x.n}</p><p className="text-sm text-muted-foreground">{x.l}</p></Link>))}</div>
      <Link to="/assistant" className="card-soft flex items-center gap-3 p-5 hover:border-turquoise"><MessageCircle className="size-6 text-primary" /><div><p className="font-semibold">اسأل مساعد التعلّم</p><p className="text-sm text-muted-foreground">اقتراحات وتأملات مبنية على ملفك.</p></div></Link>
    </div>
  );
}
