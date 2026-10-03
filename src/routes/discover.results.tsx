import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { setState, useAthar, type RiasecCode } from "@/lib/store";
import { CODES, RIASEC } from "@/lib/riasec";
import { ExternalLink, X } from "lucide-react";

export const Route = createFileRoute("/discover/results")({
  head: () => seo("إدخال نتائج الاهتمامات", "أدخل نتائج اختبار O*NET يدويًا: بالدرجات أو باختيار اهتماماتك الأبرز."),
  component: Results,
});

function Results() {
  const s = useAthar();
  const nav = useNavigate();
  const [mode, setMode] = useState<"scores" | "ranking">(s.onetMode ?? "scores");
  const [scores, setScores] = useState<Record<string, string>>(
    Object.fromEntries(CODES.map((c) => [c, s.scores[c]?.toString() ?? ""])),
  );
  const [ranking, setRanking] = useState<RiasecCode[]>(s.ranking);

  const save = () => {
    if (mode === "scores") {
      const parsed: Partial<Record<RiasecCode, number>> = {};
      for (const c of CODES) {
        const v = (scores[c] ?? "").trim();
        if (v === "") continue;
        const n = Number(v);
        if (!Number.isFinite(n) || n < 0 || n > 40) { toast.error(`قيمة غير صالحة لـ ${RIASEC[c].ar}: أدخل رقمًا بين 0 و40`); return; }
        parsed[c] = n;
      }
      if (Object.keys(parsed).length < 2) { toast.error("أدخل درجتين على الأقل"); return; }
      setState(() => ({ onetMode: "scores", scores: parsed }));
    } else {
      if (ranking.length < 1) { toast.error("اختر اهتمامًا واحدًا على الأقل"); return; }
      setState(() => ({ onetMode: "ranking", ranking }));
    }
    toast.success("حُفظت نتائجك في متصفحك");
    nav({ to: "/discover/analysis" });
  };

  const toggle = (c: RiasecCode) =>
    setRanking((r) => (r.includes(c) ? r.filter((x) => x !== c) : r.length >= 3 ? r : [...r, c]));

  return (
    <div>
      <PageHeader eyebrow="اكتشف ذاتك · الخطوة 2" title="سجّل نتائج اختبارك"
        desc="أدخل النتائج كما ظهرت لك في موقع O*NET. هذه بيانات تُدخلها أنت — أثر لا يستلمها تلقائيًا." />

      <div className="card-soft p-5 mb-6 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-2">كيف أجد نتائجي؟</p>
        <ol className="list-decimal pr-5 space-y-1">
          <li>بعد إنهاء الأسئلة، تعرض صفحة النتائج ستة مجالات: Realistic, Investigative, Artistic, Social, Enterprising, Conventional.</li>
          <li>بجانب كل مجال رقم (عادة من 0 إلى 40). انسخ كل رقم في الخانة المقابلة.</li>
          <li>إن لم تظهر لك أرقام، اختر "ترتيب الاهتمامات" وحدد أبرز ثلاثة مجالات بالترتيب.</li>
        </ol>
        <a href="https://onetinterestprofiler.org/p/activities" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-primary underline underline-offset-4">فتح الاختبار <ExternalLink className="size-3.5" /></a>
      </div>

      <div className="mb-6 inline-flex rounded-2xl bg-muted p-1" role="tablist">
        {(["scores", "ranking"] as const).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${mode === m ? "bg-card shadow-[var(--shadow-soft)] text-primary" : "text-muted-foreground"}`}>
            {m === "scores" ? "لدي درجات" : "ترتيب الاهتمامات"}
          </button>
        ))}
      </div>

      {mode === "scores" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {CODES.map((c) => (
            <label key={c} className="card-soft flex items-center gap-4 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky font-bold text-primary">{c}</span>
              <span className="flex-1">
                <span className="block font-semibold">{RIASEC[c].ar}</span>
                <span className="block text-xs text-muted-foreground">{RIASEC[c].en} · {RIASEC[c].short}</span>
              </span>
              <input inputMode="numeric" value={scores[c]} onChange={(e) => setScores({ ...scores, [c]: e.target.value.replace(/[^\d.]/g, "") })}
                placeholder="—" aria-label={`درجة ${RIASEC[c].ar}`} maxLength={4}
                className="w-20 rounded-xl border bg-background px-3 py-2 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
          ))}
        </div>
      ) : (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">اختر حتى ثلاثة مجالات بترتيب أهميتها لك (الأول = الأبرز).</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {CODES.map((c) => {
              const idx = ranking.indexOf(c);
              return (
                <button key={c} onClick={() => toggle(c)} aria-pressed={idx >= 0}
                  className={`card-soft flex items-center gap-4 p-4 text-right transition-all ${idx >= 0 ? "ring-2 ring-primary" : ""}`}>
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl font-bold ${idx >= 0 ? "bg-primary text-primary-foreground" : "bg-sky text-primary"}`}>{idx >= 0 ? idx + 1 : c}</span>
                  <span className="flex-1">
                    <span className="block font-semibold">{RIASEC[c].ar} ({c})</span>
                    <span className="block text-xs text-muted-foreground">{RIASEC[c].short}</span>
                  </span>
                  {idx >= 0 && <X className="size-4 text-muted-foreground" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={save} className="mt-8 w-full rounded-2xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground sm:w-auto">احفظ واعرض التحليل</button>
    </div>
  );
}
