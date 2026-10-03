import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NotebookPen, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Chip, Empty, PageHeader, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { setState, uid, useAthar } from "@/lib/store";

export const Route = createFileRoute("/journal")({
  head: () => seo("دفتر التأمل", "دفترك الخاص لتسجيل أفكارك واكتشافاتك وأهدافك، محفوظ في متصفحك فقط."),
  component: Journal,
});

const TYPES = ["فكرة", "اكتشاف", "تأمل في النتائج", "نقطة قوة", "تحدٍّ", "هدف", "سؤال للمستقبل"];
const PROMPTS: Record<string, string> = {
  "فكرة": "ما الذي يدور في ذهنك الآن؟",
  "اكتشاف": "ما الذي اكتشفته عن نفسك مؤخرًا؟",
  "تأمل في النتائج": "هل تشبهك نتائج اختبار الاهتمامات؟ لماذا؟",
  "نقطة قوة": "متى شعرت أنك في أفضل حالاتك؟",
  "تحدٍّ": "ما التحدي الذي تواجهه، وما الذي جرّبته؟",
  "هدف": "ما الذي تريد تحقيقه، ولماذا يهمك؟",
  "سؤال للمستقبل": "ما السؤال الذي تريد أن تجد له إجابة؟",
};

function Journal() {
  const s = useAthar();
  const [type, setType] = useState(TYPES[0]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setState((st) => ({ journal: [{ id: uid(), type, text: t.slice(0, 4000), createdAt: Date.now() }, ...st.journal] }));
    setText("");
    toast.success("حُفظت الملاحظة");
  };
  const list = filter ? s.journal.filter((j) => j.type === filter) : s.journal;

  return (
    <div>
      <PageHeader eyebrow="مساحتك الخاصة" title="دفتر التأمل" desc="اكتب بحرية. ما تكتبه هنا يبقى في متصفحك ولا يُرسل إلى أي مكان.">
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Lock className="size-3.5" />محفوظ محليًا على هذا الجهاز</p>
      </PageHeader>

      <div className="card-soft p-5">
        <div className="mb-3 flex flex-wrap gap-2">{TYPES.map((t) => <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>)}</div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder={PROMPTS[type]} aria-label="نص الملاحظة" maxLength={4000}
          className="w-full rounded-xl border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring" />
        <button onClick={add} disabled={!text.trim()} className="mt-3 rounded-2xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-50">حفظ</button>
      </div>

      <div className="mt-8 mb-3 flex flex-wrap gap-2">
        <Chip active={!filter} onClick={() => setFilter(null)}>الكل ({s.journal.length})</Chip>
        {TYPES.filter((t) => s.journal.some((j) => j.type === t)).map((t) => <Chip key={t} active={filter === t} onClick={() => setFilter(t)}>{t}</Chip>)}
      </div>
      {list.length === 0 ? <Empty icon={NotebookPen} title="دفترك فارغ" desc="ابدأ بكتابة أول فكرة أو تأمل." /> : (
        <div className="space-y-3">
          {list.map((j) => (
            <article key={j.id} className="card-soft p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2"><Tag>{j.type}</Tag><span className="text-xs text-muted-foreground">{new Date(j.createdAt).toLocaleDateString("ar")}</span></div>
                <button aria-label="حذف" onClick={() => setState((st) => ({ journal: st.journal.filter((x) => x.id !== j.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </div>
              <p className="whitespace-pre-wrap text-sm">{j.text}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
