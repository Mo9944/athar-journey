import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: () => seo("لوحتي", "صفحة لوحتي في منصة أثر — قيد الإنشاء."),
  component: () => (
    <div>
      <PageHeader title="لوحتي" desc="هذه الصفحة قيد الإنشاء وستتوفر قريبًا." />
      <Link to="/discover" className="inline-flex rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">ابدأ باكتشاف ذاتك</Link>
    </div>
  ),
});
