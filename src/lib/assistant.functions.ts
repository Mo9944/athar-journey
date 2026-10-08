import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).max(30),
  profile: z.string().max(2000),
});

const SYSTEM = `أنت "مساعد أثر"، مرشد تعلّم عربي ودود. تساعد المستخدم على فهم اهتماماته، والتأمل، واختيار ما يتعلّمه، وتحويل التعلّم إلى خطوات عملية صغيرة.
- اكتب بالعربية الفصحى البسيطة، بإيجاز ووضوح.
- لا تصنّف المستخدم تصنيفًا ثابتًا؛ استخدم لغة "قد" و"ربما".
- اطرح سؤالًا تأمليًا واحدًا عند المناسبة.
- لا تقدّم تشخيصًا نفسيًا أو طبيًا؛ انصح بمختص عند الحاجة.
- لا تخترع مصادر أو روابط.
- إذا كان لدى المستخدم "مساري الحالي"، اربط إجابتك بهدفه ومرحلته وموضوعه التالي، واقترح خطوة واحدة واضحة تناسب وقته.`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) return { error: "المساعد غير متاح حاليًا." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: `${SYSTEM}\n\nملف المستخدم (أدخله بنفسه):\n${data.profile || "لا يوجد بعد."}` }, ...data.messages],
      }),
    });
    if (res.status === 429) return { error: "طلبات كثيرة، حاول بعد قليل." };
    if (res.status === 402) return { error: "نفد رصيد الذكاء الاصطناعي مؤقتًا." };
    if (!res.ok) return { error: "تعذّر الوصول إلى المساعد." };
    const j = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { reply: j.choices?.[0]?.message?.content ?? "" };
  });
