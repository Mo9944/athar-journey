import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/athar/AppShell";
import { seo } from "@/lib/seo";
import { clearAll } from "@/lib/store";

export const Route = createFileRoute("/privacy")({
  head: () => seo("الخصوصية وبياناتي", "ما الذي تحفظه أثر وأين، وكيف تحذف بياناتك."),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="space-y-4">
      <PageHeader title="الخصوصية وبياناتي" desc="لا حسابات ولا تسجيل. كل ما تُدخله (نتائج الاهتمامات، القيم، الدفتر، الأفكار) يُحفظ في متصفحك على هذا الجهاز فقط." />
      <div className="card-soft p-5 text-sm space-y-2">
        <p>• نتائج اختبار O*NET بيانات تُدخلها أنت يدويًا؛ أثر غير متصل بالاختبار.</p>
        <p>• التحليلات تفسيرات عامة من أثر، وليست تشخيصًا أو توصية مهنية نهائية.</p>
        <p>• مسح بيانات المتصفح يحذف تقدّمك.</p>
      </div>
      <button onClick={() => { if (confirm("هل تريد حذف كل بياناتك المحفوظة؟")) { clearAll(); toast.success("حُذفت بياناتك"); } }}
        className="rounded-2xl bg-destructive px-5 py-3 font-semibold text-destructive-foreground">حذف كل بياناتي</button>
    </div>
  );
}
