import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, ExternalLink, Plus, Trash2, Trophy } from "lucide-react";
import { Empty, PageHeader, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { REFLECT, setPractice, usePractice, type Achievement } from "@/lib/practice";
import { uid } from "@/lib/store";

export const Route = createFileRoute("/achievements")({
  head: () => seo("إنجازاتي", "ملف إنجازاتك وأعمالك ومشروعاتك ودروسك، محفوظ على جهازك فقط."),
  component: Achievements,
});

const KINDS: Achievement["kind"][] = ["مشروع", "عمل", "تمرين", "تأمل"];
const blank = { kind: "مشروع" as Achievement["kind"], title: "", desc: "", skills: "", result: "", link: "", lesson: "" };

function Achievements() {
  const ps = usePractice();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(blank);
  const [copied, setCopied] = useState("");
  const set = (k: keyof typeof blank, v: string) => setF((x) => ({ ...x, [k]: v }));

  function add() {
    if (!f.title.trim()) return;
    setPractice((s) => ({ achievements: [{ id: uid(), ...f, skills: f.skills.split(/[،,]/).map((x) => x.trim()).filter(Boolean), createdAt: Date.now() }, ...s.achievements] }));
    setF(blank); setOpen(false);
  }
  async function copy(a: Achievement) {
    const t = [a.title, a.desc, a.skills.length ? `المهارات: ${a.skills.join("، ")}` : "", a.result && `النتيجة: ${a.result}`, a.link].filter(Boolean).join("\n");
    try { await navigator.clipboard.writeText(t); setCopied(a.id); } catch { setCopied(""); }
  }
  const input = "mt-1 w-full rounded-2xl border bg-card p-3 text-sm";

  return (
    <div>
      <PageHeader eyebrow="رحلتك" title="إنجازاتي" desc="ما أنجزته فعلًا: مشروعات وأعمال ودروس. يبقى على جهازك فقط، ولا يُنشر شيء تلقائيًا." />
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-1 rounded-2xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground"><Plus className="size-4" />أضف إنجازًا</button>
        <Link to="/practice" className="rounded-2xl border px-4 py-2.5 text-sm">العودة إلى ما أطبّقه</Link>
      </div>
      {open && (
        <section className="card-soft mb-6 p-5">
          <div className="flex flex-wrap gap-2">{KINDS.map((k) => <button key={k} onClick={() => set("kind", k)} className={`rounded-full border px-3 py-1 text-sm ${f.kind === k ? "bg-primary text-primary-foreground" : ""}`}>{k}</button>)}</div>
          <label className="mt-3 block text-sm font-semibold">العنوان<input value={f.title} onChange={(e) => set("title", e.target.value)} className={input} /></label>
          <label className="mt-3 block text-sm font-semibold">الوصف<textarea value={f.desc} onChange={(e) => set("desc", e.target.value)} rows={2} className={input} /></label>
          <label className="mt-3 block text-sm font-semibold">المهارات المستخدمة (افصل بفاصلة)<input value={f.skills} onChange={(e) => set("skills", e.target.value)} className={input} /></label>
          <label className="mt-3 block text-sm font-semibold">النتيجة<input value={f.result} onChange={(e) => set("result", e.target.value)} className={input} /></label>
          <label className="mt-3 block text-sm font-semibold">رابط العمل (اختياري)<input value={f.link} onChange={(e) => set("link", e.target.value)} dir="ltr" placeholder="https://" className={input} /></label>
          <label className="mt-3 block text-sm font-semibold">درس تعلمته (اختياري)<textarea value={f.lesson} onChange={(e) => set("lesson", e.target.value)} placeholder={REFLECT[1]} rows={2} className={input} /></label>
          <button onClick={add} disabled={!f.title.trim()} className="mt-4 rounded-2xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-40">حفظ</button>
        </section>
      )}
      {ps.achievements.length === 0 ? <Empty icon={Trophy} title="لا إنجازات بعد" desc="عندما تُنهي مشروعًا في «طبّق بنفسك» يُحفظ هنا تلقائيًا، أو أضف إنجازًا بنفسك." /> : (
        <div className="grid gap-4 md:grid-cols-2">{ps.achievements.map((a) => (
          <article key={a.id} className="card-soft p-5">
            <div className="mb-2 flex items-center gap-2"><Tag>{a.kind}</Tag><span className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString("ar")}</span></div>
            <h3 className="font-bold">{a.title}</h3>
            {a.desc && <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>}
            {a.skills.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{a.skills.map((s) => <Tag key={s} tone="lavender">{s}</Tag>)}</div>}
            {a.result && <p className="mt-2 text-sm">النتيجة: {a.result}</p>}
            {a.lesson && <p className="mt-1 text-sm text-primary">ما تعلمته: {a.lesson}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              {/^https?:\/\//.test(a.link) && <a href={a.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary">رابط العمل <ExternalLink className="size-3.5" /></a>}
              <button onClick={() => copy(a)} className="inline-flex items-center gap-1 text-muted-foreground"><Copy className="size-3.5" />{copied === a.id ? "نُسخ" : "انسخ للمشاركة"}</button>
              <button aria-label="حذف" onClick={() => setPractice((s) => ({ achievements: s.achievements.filter((x) => x.id !== a.id) }))} className="mr-auto text-muted-foreground"><Trash2 className="size-4" /></button>
            </div>
          </article>))}</div>
      )}
    </div>
  );
}
