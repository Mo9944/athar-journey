import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/plan")({
  head: () => seo("خطة التعلّم", "صفحة خطة التعلّم في منصة أثر — قيد الإنشاء."),
  component: () => (
    <div>
      <PageHeader title="خطة التعلّم" desc="هذه الصفحة قيد الإنشاء وستتوفر قريبًا." />
      <Link to="/discover" className="inline-flex rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">ابدأ باكتشاف ذاتك</Link>
    </div>
  ),
});
