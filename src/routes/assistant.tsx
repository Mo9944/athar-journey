import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Send, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { leadingCodes, setState, useAthar, type AtharState } from "@/lib/store";
import { RIASEC } from "@/lib/riasec";
import { askAssistant } from "@/lib/assistant.functions";
import { pathInfo } from "@/lib/journey";


export const Route = createFileRoute("/assistant")({
  head: () => seo("مساعد التعلّم", "تحدّث مع مساعد أثر الذكي ليقترح عليك ما تتعلّمه ويساعدك على التأمل والتخطيط."),
  component: Assistant,
});

const SUGGEST = ["ماذا أتعلّم هذا الأسبوع؟", "ساعدني أتأمل في يومي", "حوّل هدفي إلى خطوات صغيرة", "اشرح لي مفهوم التفكير النقدي"];

function profileText(s: AtharState) {
  const codes = leadingCodes(s).slice(0, 3).map((c) => RIASEC[c].ar).join("، ");
  return [codes && `اهتمامات: ${codes}`, s.values.length && `قيم: ${s.values.join("، ")}`, s.strengths.length && `نقاط قوة: ${s.strengths.join("، ")}`,
    s.exploreTopics.length && `مواضيع: ${s.exploreTopics.join("، ")}`, s.goals.length && `أهداف: ${s.goals.map((g) => g.title).join("، ")}`, pathInfo()?.text].filter(Boolean).join("\n");
}

function Assistant() {
  const s = useAthar();
  const ask = useServerFn(askAssistant);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [p, setP] = useState<ReturnType<typeof pathInfo>>(null);
  useEffect(() => setP(pathInfo()), []);
  const suggest = p ? [`اشرح لي "${p.next || p.stage}" ببساطة`, `أعطني تمرينًا صغيرًا على ${p.stage}`, "ما خطوتي التالية في مساري؟", "اختبرني بسؤالين على ما تعلمته"] : SUGGEST;

  async function send(q: string) {
    if (!q.trim() || busy) return;
    const msgs = [...s.chat, { role: "user" as const, content: q.trim() }];
    setState(() => ({ chat: msgs })); setText(""); setBusy(true); setErr("");
    try {
      const r = await ask({ data: { messages: msgs.slice(-20), profile: profileText(s) } });
      if ("error" in r && r.error) setErr(r.error);
      else setState(() => ({ chat: [...msgs, { role: "assistant", content: r.reply ?? "" }] }));
    } catch { setErr("حدث خطأ، حاول مرة أخرى."); }
    setBusy(false);
  }

  return (
    <div className="flex flex-col">
      <PageHeader eyebrow="ذكاء اصطناعي" title="مساعد التعلّم" desc="يستخدم ما أدخلته في ملفك ليقترح ويسأل ويساعدك على التخطيط. اقتراحاته إرشادية وليست أحكامًا." />
      {p ? <Link to="/path" className="mb-4 block rounded-2xl bg-sky/60 p-3 text-sm">المساعد يعرف مسارك: <b className="text-primary">{p.goal}</b> — المرحلة: {p.stage}</Link>
        : <Link to="/path" className="mb-4 block rounded-2xl bg-sky/60 p-3 text-sm">ابدأ <b className="text-primary">مساري</b> ليقدّم لك المساعد إرشادًا مرتبطًا بهدفك.</Link>}
      <div className="card-soft mb-4 min-h-[300px] space-y-3 p-4">
        {s.chat.length === 0 && <div className="flex flex-wrap gap-2">{suggest.map((q) => (
          <button key={q} onClick={() => send(q)} className="rounded-full border bg-card px-4 py-2 text-sm hover:border-turquoise">{q}</button>))}</div>}
        {s.chat.map((m, i) => (
          <div key={i} className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 ${m.role === "user" ? "mr-auto bg-primary text-primary-foreground" : "ml-auto bg-muted"}`}>{m.content}</div>
        ))}
        {busy && <div className="ml-auto w-fit rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">يفكّر…</div>}
        {err && <p className="text-sm text-destructive">{err}</p>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); void send(text); }} className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب سؤالك…" aria-label="رسالتك"
          className="flex-1 rounded-2xl border bg-card px-4 py-3 outline-none focus:border-primary" />
        <button disabled={busy} aria-label="إرسال" className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground disabled:opacity-50"><Send className="size-5" /></button>
        {s.chat.length > 0 && <button type="button" aria-label="مسح المحادثة" onClick={() => setState(() => ({ chat: [] }))} className="grid size-12 place-items-center rounded-2xl border text-muted-foreground"><Trash2 className="size-5" /></button>}
      </form>
    </div>
  );
}
