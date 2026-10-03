import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Compass, Pencil, HelpCircle, Wrench, FlaskConical, GraduationCap, Building2, BookOpen, AlertTriangle } from "lucide-react";
import { Empty, PageHeader, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { leadingCodes, useAthar } from "@/lib/store";
import { CODES, RIASEC, pairNote } from "@/lib/riasec";

export const Route = createFileRoute("/discover/analysis")({
  head: () => seo("تحليل اهتماماتك", "تحليل مبسّط لنتائج RIASEC التي أدخلتها: أنشطة، مهارات، ومجالات للاستكشاف."),
  component: Analysis,
});

function Section({ icon: Icon, title, children }: { icon: typeof Compass; title: string; children: React.ReactNode }) {
  return (
    <section className="card-soft p-5 md:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Icon className="size-5 text-turquoise" />{title}</h2>
      {children}
    </section>
  );
}

function Analysis() {
  const s = useAthar();
  const codes = leadingCodes(s);
  if (codes.length === 0)
    return (
      <div>
        <PageHeader title="تحليل اهتماماتك" />
        <Empty icon={Compass} title="لم تُدخل نتائج بعد" desc="أدخل نتائج اختبار O*NET لنعرض لك تحليلًا مبسّطًا." />
        <Link to="/discover/results" className="mt-4 inline-flex rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">إدخال النتائج</Link>
      </div>
    );

  const top = codes.slice(0, 3);
  const isScores = s.onetMode === "scores";
  const chartData = isScores
    ? CODES.map((c) => ({ code: c, name: RIASEC[c].ar, value: s.scores[c] ?? 0 }))
    : top.map((c, i) => ({ code: c, name: RIASEC[c].ar, value: top.length - i }));
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="اكتشف ذاتك · الخطوة 3" title="تحليل اهتماماتك" />

      <div className="flex items-start gap-3 rounded-2xl bg-gold/15 p-4 text-sm">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold-foreground" />
        <p>هذا <b>تفسير عام من أثر</b> مبني على النتائج التي <b>أدخلتها أنت</b>. ليس تشخيصًا نفسيًا ولا حكمًا نهائيًا على شخصيتك أو مستقبلك المهني. الاهتمامات تتغيّر مع الخبرة.</p>
      </div>

      <Section icon={Compass} title="اهتماماتك البارزة">
        <div className="mb-3 flex items-center gap-2"><Tag tone={isScores ? "sky" : "gold"}>{isScores ? "درجات أدخلتها من الاختبار" : "ترتيب أبلغت عنه — ليس درجة مقاسة"}</Tag></div>
        <div className="h-64" dir="ltr">
          <ResponsiveContainer>
            <BarChart data={chartData} layout={isScores ? "horizontal" : "vertical"} margin={{ left: 10, right: 10 }}>
              {isScores ? (<><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis domain={[0, 40]} tick={{ fontSize: 12 }} /></>)
                : (<><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 13 }} /></>)}
              {isScores && <Tooltip />}
              <Bar dataKey="value" radius={8}>
                {chartData.map((d) => <Cell key={d.code} fill={top.includes(d.code) ? colors[top.indexOf(d.code)] : "var(--muted-foreground)"} fillOpacity={top.includes(d.code) ? 1 : 0.25} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {!isScores && <p className="text-xs text-muted-foreground">طول الشريط يعكس ترتيبك فقط (الأول، الثاني، الثالث).</p>}
      </Section>

      <Section icon={BookOpen} title="ماذا يعني كل اهتمام؟">
        <div className="grid gap-3 md:grid-cols-3">
          {top.map((c, i) => (
            <div key={c} className="rounded-xl bg-sky/60 p-4">
              <p className="text-xs text-muted-foreground">#{i + 1}</p>
              <p className="font-bold text-primary">{RIASEC[c].ar} ({c})</p>
              <p className="mt-2 text-sm">{RIASEC[c].desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {top.length > 1 && (
        <Section icon={FlaskConical} title="كيف قد تتكامل اهتماماتك؟">
          <ul className="space-y-2 text-sm">
            {top.slice(1).map((c) => <li key={c} className="rounded-xl bg-lavender/60 p-3"><b>{RIASEC[top[0]!].ar} + {RIASEC[c].ar}:</b> {pairNote(top[0]!, c)}</li>)}
          </ul>
        </Section>
      )}

      <Section icon={Building2} title="أنشطة ومواضيع وبيئات مرتبطة">
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          {[["أنشطة", "activities"], ["مواضيع تعلّم", "topics"], ["بيئات عمل", "environments"]].map(([label, key]) => (
            <div key={key}><p className="mb-2 font-semibold">{label}</p>
              <ul className="space-y-1 text-muted-foreground">{top.flatMap((c) => (RIASEC[c][key as "topics"]).slice(0, 2)).map((x) => <li key={x}>• {x}</li>)}</ul></div>
          ))}
        </div>
      </Section>

      <Section icon={HelpCircle} title="أسئلة للتأمل">
        <ul className="space-y-2 text-sm">
          <li>• هل تتذكّر موقفًا شعرت فيه بالحماس أثناء نشاط {RIASEC[top[0]!].short}؟ ماذا كان؟</li>
          <li>• هل يتوافق هذا الوصف مع تجاربك الفعلية، أم أن هناك ما لا يشبهك؟</li>
          <li>• ما الاهتمام الذي تتمنى تجربته أكثر لكن لم تتح لك الفرصة؟</li>
          <li>• هل تأثّرت إجاباتك في الاختبار بتوقعات الآخرين أكثر من رغباتك؟</li>
        </ul>
        <Link to="/journal" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"><Pencil className="size-4" />اكتب تأملك في الدفتر</Link>
      </Section>

      <Section icon={Wrench} title="مهارات قد تستكشفها">
        <div className="flex flex-wrap gap-2">{top.flatMap((c) => RIASEC[c].skills).map((x) => <Tag key={x}>{x}</Tag>)}</div>
      </Section>

      <Section icon={FlaskConical} title="تجارب عملية صغيرة">
        <ul className="space-y-2 text-sm">{top.flatMap((c) => RIASEC[c].experiments).map((x) => <li key={x} className="rounded-xl border p-3">🧪 {x}</li>)}</ul>
      </Section>

      <Section icon={GraduationCap} title="مجالات دراسية ومهنية للبحث">
        <p className="mb-3 text-sm text-muted-foreground">هذه مجالات <b>للاطلاع والبحث</b> فقط، وليست توصيات نهائية أو ضمانًا للتوافق.</p>
        <div className="flex flex-wrap gap-2">{top.flatMap((c) => RIASEC[c].fields).map((x) => <Tag key={x} tone="lavender">{x}</Tag>)}</div>
      </Section>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link to="/discover/tools" className="rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">تابع: أنشطة القيم والقوة</Link>
        <Link to="/discover/results" className="rounded-2xl border bg-card px-5 py-3 font-semibold">تعديل النتائج</Link>
        <Link to="/assistant" className="rounded-2xl border bg-card px-5 py-3 font-semibold">ناقش نتائجك مع المساعد</Link>
      </div>
    </div>
  );
}
