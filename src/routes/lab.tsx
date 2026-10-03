import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lightbulb, Trash2, Link2, Check, Brain } from "lucide-react";
import { toast } from "sonner";
import { Chip, Empty, PageHeader, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { setState, uid, useAthar } from "@/lib/store";

export const Route = createFileRoute("/lab")({
  head: () => seo("مختبر الأفكار", "سجّل أفكارك ونظّمها واربط بينها، وتدرّب على التفكير النقدي والإبداعي وحل المشكلات."),
  component: Lab,
});

const TAGS = ["فكرة", "سؤال", "مشروع", "ملاحظة"];
const EXERCISES = [
  { id: "c1", kind: "تفكير نقدي", title: "افتراض خفي", prompt: "\"كل الناجحين يستيقظون مبكرًا، إذن الاستيقاظ المبكر يصنع النجاح.\" ما الافتراض الخفي هنا؟ وما الدليل الذي تحتاجه؟" },
  { id: "c2", kind: "منطق", title: "استنتاج صحيح؟", prompt: "إذا كانت كل الطيور تملك أجنحة، والبطريق طائر، فهل يطير البطريق؟ ما الفرق بين المقدمات والاستنتاج؟" },
  { id: "c3", kind: "إبداع", title: "استخدامات غير مألوفة", prompt: "اكتب 10 استخدامات غير معتادة لمشبك الورق خلال 3 دقائق." },
  { id: "c4", kind: "حل المشكلات", title: "لماذا الخمسة", prompt: "اختر مشكلة صغيرة تواجهك، واسأل \"لماذا؟\" خمس مرات متتالية للوصول إلى جذرها." },
  { id: "c5", kind: "الأدلة", title: "رأي أم حقيقة؟", prompt: "اختر عنوان خبر قرأته اليوم: ما الجزء الذي يمكن التحقق منه، وما الجزء الذي هو رأي؟" },
  { id: "c6", kind: "تأمل", title: "غيّر زاوية النظر", prompt: "اختر قناعة تحملها، واكتب أقوى حجة ضدها بإنصاف." },
];

function Lab() {
  const s = useAthar();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tag, setTag] = useState<string>("فكرة");
  const [linking, setLinking] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const add = () => {
    if (!title.trim()) return;
    setState((st) => ({ ideas: [{ id: uid(), title: title.trim().slice(0, 120), note: note.trim().slice(0, 2000), tag, links: [], createdAt: Date.now() }, ...st.ideas] }));
    setTitle(""); setNote(""); toast.success("أُضيفت الفكرة");
  };
  const link = (a: string, b: string) => setState((st) => ({
    ideas: st.ideas.map((i) => i.id === a && !i.links.includes(b) ? { ...i, links: [...i.links, b] } : i.id === b && !i.links.includes(a) ? { ...i, links: [...i.links, a] } : i),
  }));
  const byId = (id: string) => s.ideas.find((i) => i.id === id);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="الجزء الثاني" title="مختبر الأفكار" desc="مكان لالتقاط أفكارك وربطها ببعض، والتدرّب على التفكير بوضوح." />

      <section className="card-soft p-5">
        <h2 className="mb-3 font-bold">فكرة جديدة</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الفكرة" aria-label="عنوان الفكرة" maxLength={120}
          className="mb-2 w-full rounded-xl border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring" />
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="تفاصيل، أدلة، أسئلة..." aria-label="تفاصيل" maxLength={2000}
          className="w-full rounded-xl border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring" />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {TAGS.map((t) => <Chip key={t} active={tag === t} onClick={() => setTag(t)}>{t}</Chip>)}
          <button onClick={add} disabled={!title.trim()} className="mr-auto rounded-2xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-50">حفظ</button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-bold">أفكاري وروابطها ({s.ideas.length})</h2>
        {linking && <p className="mb-3 rounded-xl bg-gold/20 p-3 text-sm">اختر فكرة لربطها بـ "{byId(linking)?.title}" <button className="underline" onClick={() => setLinking(null)}>إلغاء</button></p>}
        {s.ideas.length === 0 ? <Empty icon={Lightbulb} title="لا أفكار بعد" desc="سجّل أول فكرة، ثم اربطها بأفكار أخرى لتكوين خريطة." /> : (
          <div className="grid gap-3 md:grid-cols-2">
            {s.ideas.map((i) => (
              <article key={i.id} onClick={() => { if (linking && linking !== i.id) { link(linking, i.id); setLinking(null); toast.success("تم الربط"); } }}
                className={`card-soft p-4 ${linking && linking !== i.id ? "cursor-pointer ring-2 ring-gold" : ""}`}>
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div><Tag tone="lavender">{i.tag}</Tag><h3 className="mt-1 font-semibold">{i.title}</h3></div>
                  <div className="flex gap-1">
                    <button aria-label="ربط بفكرة" onClick={(e) => { e.stopPropagation(); setLinking(i.id); }} className="grid size-8 place-items-center rounded-lg hover:bg-muted"><Link2 className="size-4" /></button>
                    <button aria-label="حذف" onClick={(e) => { e.stopPropagation(); setState((st) => ({ ideas: st.ideas.filter((x) => x.id !== i.id).map((x) => ({ ...x, links: x.links.filter((l) => l !== i.id) })) })); }} className="grid size-8 place-items-center rounded-lg hover:bg-muted hover:text-destructive"><Trash2 className="size-4" /></button>
                  </div>
                </div>
                {i.note && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{i.note}</p>}
                {i.links.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{i.links.map((l) => byId(l) && <span key={l} className="rounded-full bg-sky px-2 py-0.5 text-xs text-primary">↔ {byId(l)!.title}</span>)}</div>}
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-bold"><Brain className="size-5 text-turquoise" />تمارين التفكير</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {EXERCISES.map((e) => {
            const done = s.exercisesDone.includes(e.id);
            return (
              <div key={e.id} className="card-soft p-4">
                <div className="flex items-center justify-between"><Tag>{e.kind}</Tag>{done && <Check className="size-4 text-primary" />}</div>
                <button onClick={() => setOpen(open === e.id ? null : e.id)} className="mt-2 block w-full text-right font-semibold" aria-expanded={open === e.id}>{e.title}</button>
                {open === e.id && (
                  <div className="mt-2">
                    <p className="text-sm">{e.prompt}</p>
                    <p className="mt-2 text-xs text-muted-foreground">لا توجد إجابة واحدة صحيحة. اكتب إجابتك كفكرة في المختبر أو ناقشها مع المساعد.</p>
                    <button onClick={() => setState((st) => ({ exercisesDone: done ? st.exercisesDone.filter((x) => x !== e.id) : [...st.exercisesDone, e.id] }))}
                      className={`mt-3 rounded-xl px-3 py-1.5 text-sm ${done ? "bg-primary text-primary-foreground" : "border"}`}>{done ? "أنجزته ✓" : "علّم كمُنجز"}</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
