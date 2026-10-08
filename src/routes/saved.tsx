import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, ExternalLink } from "lucide-react";
import { Empty, PageHeader, Tag } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { setState, useAthar } from "@/lib/store";
import { RESOURCES } from "@/lib/library";

export const Route = createFileRoute("/saved")({
  head: () => seo("محفوظاتي", "كل ما حفظته في أثر: مصادر وأفكار وتأملات، مرتبة في مجموعات بسيطة."),
  component: Saved,
});

function Saved() {
  const s = useAthar();
  const res = RESOURCES.filter((r) => s.saved.includes(r.id));
  const groups = [...new Set(res.map((r) => r.category))];
  const empty = !res.length && !s.ideas.length && !s.journal.length;
  return (
    <div>
      <PageHeader eyebrow="محفوظاتي" title="ما حفظته" desc="مصادرك وأفكارك وتأملاتك في مكان واحد." />
      {empty && <Empty icon={Bookmark} title="لا شيء محفوظ بعد" desc="احفظ مصدرًا من المكتبة أو أضف فكرة في المختبر." />}
      {groups.map((g) => (
        <section key={g} className="mb-6">
          <h2 className="mb-2 font-bold">{g}</h2>
          <div className="grid gap-3 md:grid-cols-2">{res.filter((r) => r.category === g).map((r) => (
            <div key={r.id} className="card-soft p-4">
              <p className="font-semibold">{r.title}</p>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
              <div className="mt-2 flex gap-3 text-sm">
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary">فتح <ExternalLink className="size-3.5" /></a>}
                <button onClick={() => setState((x) => ({ saved: x.saved.filter((i) => i !== r.id) }))} className="text-muted-foreground">إزالة</button>
              </div>
            </div>))}</div>
        </section>
      ))}
      {s.ideas.length > 0 && <section className="mb-6"><h2 className="mb-2 font-bold">أفكاري <Link to="/lab" className="text-xs text-primary">({s.ideas.length})</Link></h2>
        <div className="grid gap-3 md:grid-cols-2">{s.ideas.map((i) => <div key={i.id} className="card-soft p-4"><Tag tone="lavender">{i.tag}</Tag><p className="mt-1 font-semibold">{i.title}</p><p className="text-sm text-muted-foreground">{i.note}</p></div>)}</div></section>}
      {s.journal.length > 0 && <section><h2 className="mb-2 font-bold">تأملاتي <Link to="/journal" className="text-xs text-primary">({s.journal.length})</Link></h2>
        <div className="space-y-2">{s.journal.slice(0, 5).map((j) => <div key={j.id} className="card-soft p-4 text-sm"><Tag>{j.type}</Tag><p className="mt-1 line-clamp-2">{j.text}</p></div>)}</div></section>}
    </div>
  );
}
