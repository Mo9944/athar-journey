import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, BookOpen, Lightbulb, Target, MessageCircle, LayoutDashboard, ShieldCheck, NotebookPen, Sprout, Route, Bookmark, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/path", label: "رحلتي", icon: Route },
  { to: "/learn", label: "تعلّم", icon: GraduationCap },
  { to: "/discover", label: "اكتشف", icon: Compass },
  { to: "/saved", label: "محفوظاتي", icon: Bookmark },
  { to: "/journal", label: "دفتر التأمل", icon: NotebookPen },
  { to: "/library", label: "المكتبة", icon: BookOpen },
  { to: "/lab", label: "مختبر الأفكار", icon: Lightbulb },
  { to: "/growth", label: "تطوير الذات", icon: Target },
  { to: "/assistant", label: "المساعد", icon: MessageCircle },
] as const;

const MOBILE = ["/dashboard", "/path", "/discover", "/saved", "/assistant"];

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/") return <>{children}</>;
  const active = (to: string) => path === to || path.startsWith(to + "/");

  return (
    <div className="min-h-dvh md:flex">
      <aside className="hidden md:flex md:w-64 shrink-0 flex-col gap-1 border-l border-sidebar-border bg-sidebar p-4 sticky top-0 h-dvh">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2">
          <span className="grid size-10 place-items-center rounded-xl bg-teal-grad text-primary-foreground"><Sprout className="size-5" /></span>
          <span className="font-display text-2xl font-bold text-primary">أثر</span>
        </Link>
        {NAV.map((n) => (
          <Link key={n.to} to={n.to}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active(n.to) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-muted"}`}>
            <n.icon className="size-5" />{n.label}
          </Link>
        ))}
        <div className="mt-auto">
          <Link to="/privacy" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${active("/privacy") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            <ShieldCheck className="size-5" />الخصوصية وبياناتي
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-teal-grad text-primary-foreground"><Sprout className="size-4" /></span>
            <span className="font-display text-xl font-bold text-primary">أثر</span>
          </Link>
          <div className="flex gap-1">
            <Link to="/learn" aria-label="تعلّم" className="grid size-10 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><GraduationCap className="size-5" /></Link>
            <Link to="/journal" aria-label="دفتر التأمل" className="grid size-10 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><NotebookPen className="size-5" /></Link>
            <Link to="/lab" aria-label="مختبر الأفكار" className="grid size-10 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><Lightbulb className="size-5" /></Link>
            <Link to="/privacy" aria-label="الخصوصية" className="grid size-10 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><ShieldCheck className="size-5" /></Link>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:px-8 md:py-10 md:pb-10">{children}</main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {NAV.filter((n) => MOBILE.includes(n.to)).map((n) => (
            <Link key={n.to} to={n.to} className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${active(n.to) ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              <n.icon className="size-5" />{n.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({ eyebrow, title, desc, children }: { eyebrow?: string; title: string; desc?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 animate-rise">
      {eyebrow && <p className="mb-1 text-sm font-semibold text-turquoise">{eyebrow}</p>}
      <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
      {desc && <p className="mt-2 max-w-2xl text-muted-foreground">{desc}</p>}
      {children}
    </div>
  );
}

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: "primary" | "gold" }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full transition-all duration-700 ${tone === "gold" ? "bg-gold" : "bg-teal-grad"}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm transition-all ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-turquoise"}`}>
      {children}
    </button>
  );
}

export function Empty({ icon: Icon, title, desc }: { icon: typeof Compass; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/60 p-8 text-center">
      <Icon className="mx-auto mb-3 size-8 text-turquoise" />
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

export function Tag({ children, tone = "sky" }: { children: ReactNode; tone?: "sky" | "lavender" | "gold" | undefined }) {
  const cls = tone === "gold" ? "bg-gold/25 text-gold-foreground" : tone === "lavender" ? "bg-lavender" : "bg-sky text-primary";
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
}
