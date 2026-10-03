import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Chip, PageHeader } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { setState, useAthar, type AtharState } from "@/lib/store";

export const Route = createFileRoute("/discover/tools")({
  head: () => seo("أنشطة اكتشاف اختيارية", "أنشطة قصيرة واختيارية لاستكشاف قيمك ونقاط قوتك وتفضيلات تعلّمك ودوافعك."),
  component: Tools,
});

const VALUES = ["العائلة", "الحرية", "الإبداع", "العدل", "المعرفة", "الإيمان", "الأمان", "المساعدة", "الإنجاز", "الصدق", "المغامرة", "الصحة", "الاستقلال", "الجمال", "المجتمع"];
const STRENGTHS = ["التنظيم", "الاستماع", "الكتابة", "التحليل", "الصبر", "الخيال", "القيادة", "التواصل", "حل المشكلات", "الدقة", "روح الفريق", "التعلّم السريع", "الإقناع", "المهارة اليدوية"];
const LEARNING = ["القراءة", "الفيديو", "الاستماع (بودكاست)", "التجربة العملية", "النقاش مع الآخرين", "الكتابة والتلخيص", "الخرائط الذهنية", "التعلّم الذاتي", "التعلّم في مجموعة"];
const TOPICS = ["العلوم", "التاريخ", "الفلسفة", "الأدب", "التقنية", "علم النفس", "الاقتصاد", "الفنون", "اللغات", "البيئة", "الصحة", "ريادة الأعمال"];

type ListKey = "values" | "strengths" | "growthAreas" | "learning" | "exploreTopics";

function Picker({ title, hint, options, field, max, s }: { title: string; hint: string; options: string[]; field: ListKey; max: number; s: AtharState }) {
  const sel = s[field];
  const toggle = (o: string) => setState((st) => {
    const cur = st[field];
    if (cur.includes(o)) return { [field]: cur.filter((x) => x !== o) };
    if (cur.length >= max) { toast(`يمكنك اختيار ${max} كحد أقصى`); return {}; }
    return { [field]: [...cur, o] };
  });
  return (
    <section className="card-soft p-5 md:p-6">
      <div className="mb-1 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><span className="text-xs text-muted-foreground">{sel.length}/{max}</span></div>
      <p className="mb-4 text-sm text-muted-foreground">{hint}</p>
      <div className="flex flex-wrap gap-2">{options.map((o) => <Chip key={o} active={sel.includes(o)} onClick={() => toggle(o)}>{o}</Chip>)}</div>
    </section>
  );
}

function Tools() {
  const s = useAthar();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="اكتشف ذاتك · اختياري" title="أنشطة قصيرة لاكتشاف ذاتك"
        desc="أنشطة تأملية بسيطة، ليست اختبارات علمية مُحكّمة. اختر ما يشبهك الآن — يمكنك التعديل في أي وقت. كل شيء يُحفظ تلقائيًا." />
      <Picker s={s} field="values" max={5} title="قيمك الشخصية" hint="ما أهم خمس قيم توجّه قراراتك؟" options={VALUES} />
      <Picker s={s} field="strengths" max={5} title="نقاط قوتك كما تراها" hint="ما الذي تشعر أنك تجيده؟" options={STRENGTHS} />
      <Picker s={s} field="growthAreas" max={3} title="مجالات تودّ تطويرها" hint="اختر ما تريد تحسينه — لا بأس، الجميع يتعلم." options={STRENGTHS} />
      <Picker s={s} field="learning" max={4} title="تفضيلات التعلّم" hint="كيف تحب أن تتعلّم عادة؟" options={LEARNING} />
      <Picker s={s} field="exploreTopics" max={5} title="مواضيع تثير فضولك" hint="ما الذي تريد أن تعرف عنه أكثر؟" options={TOPICS} />

      <section className="card-soft p-5 md:p-6 space-y-4">
        <h2 className="text-lg font-bold">الدوافع والتجارب ذات المعنى</h2>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">ما الذي يثير فضولك هذه الأيام؟</span>
          <textarea value={s.curiosity} maxLength={600} onChange={(e) => setState(() => ({ curiosity: e.target.value }))} rows={3}
            className="w-full rounded-xl border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">تذكّر تجربة شعرت فيها بالمعنى أو الفخر. ما الذي جعلها مميزة؟</span>
          <textarea value={s.motivation} maxLength={800} onChange={(e) => setState(() => ({ motivation: e.target.value }))} rows={4}
            className="w-full rounded-xl border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring" />
        </label>
      </section>

      <Link to="/discover/summary" className="inline-flex rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">اعرض ملخّص اكتشاف الذات</Link>
    </div>
  );
}
