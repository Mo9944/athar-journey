import type { RiasecCode } from "./store";

export interface Resource {
  id: string; title: string; desc: string; category: string; type: string;
  minutes?: number; url?: string; source?: string; demo: boolean; codes: RiasecCode[]; topics: string[];
}

export const CATEGORIES = ["العلوم والمعرفة العامة", "التاريخ والسير", "الفلسفة والتفكير النقدي", "الثقافة والأدب", "القيم والأخلاق", "الثقافة الرقمية والإعلامية", "التعلّم وتطوير الذات"];

export const RESOURCES: Resource[] = [
  { id: "khan", title: "أكاديمية خان", desc: "منصة تعليمية مجانية تقدّم دروسًا في العلوم والرياضيات وغيرها، مع نسخة عربية لبعض المحتوى.", category: "العلوم والمعرفة العامة", type: "منصة تعليمية", url: "https://www.khanacademy.org", source: "Khan Academy", demo: false, codes: ["I", "R"], topics: ["العلوم"] },
  { id: "edraak", title: "منصة إدراك", desc: "منصة عربية للتعليم الإلكتروني تقدّم دورات مجانية في مجالات متعددة.", category: "التعلّم وتطوير الذات", type: "منصة دورات", url: "https://www.edraak.org", source: "إدراك", demo: false, codes: ["S", "E", "I"], topics: ["ريادة الأعمال", "التقنية"] },
  { id: "wiki", title: "ويكيبيديا العربية", desc: "موسوعة حرة يمكن البدء منها للتعرف على أي موضوع، مع ضرورة التحقق من المصادر.", category: "العلوم والمعرفة العامة", type: "موسوعة", url: "https://ar.wikipedia.org", source: "ويكيبيديا", demo: false, codes: ["I", "C"], topics: ["التاريخ", "العلوم"] },
  { id: "onet", title: "O*NET OnLine", desc: "قاعدة بيانات أمريكية رسمية لوصف المهن ومهاراتها — مفيدة للبحث عن المجالات (بالإنجليزية).", category: "التعلّم وتطوير الذات", type: "قاعدة بيانات", url: "https://www.onetonline.org", source: "O*NET", demo: false, codes: ["C", "E", "I"], topics: ["الاقتصاد"] },
  { id: "d1", title: "ما هو المنهج العلمي؟", desc: "مقدمة مبسّطة لخطوات الملاحظة وصياغة الفرضيات واختبارها.", category: "العلوم والمعرفة العامة", type: "مقالة قصيرة", minutes: 8, demo: true, codes: ["I"], topics: ["العلوم"] },
  { id: "d2", title: "كيف نقرأ التاريخ بعين ناقدة", desc: "أسئلة تساعدك على التمييز بين الرواية والمصدر والتفسير.", category: "التاريخ والسير", type: "دليل", minutes: 10, demo: true, codes: ["I", "A"], topics: ["التاريخ"] },
  { id: "d3", title: "مغالطات منطقية شائعة", desc: "تعرّف على أشهر المغالطات مثل الشخصنة والتعميم المتسرّع وكيف تكتشفها.", category: "الفلسفة والتفكير النقدي", type: "بطاقات تعلّم", minutes: 12, demo: true, codes: ["I", "E"], topics: ["الفلسفة"] },
  { id: "d4", title: "قراءة نص أدبي: من السطح إلى العمق", desc: "طريقة من ثلاث مراحل لقراءة قصة قصيرة أو قصيدة وفهم رموزها.", category: "الثقافة والأدب", type: "تمرين", minutes: 15, demo: true, codes: ["A", "S"], topics: ["الأدب", "الفنون"] },
  { id: "d5", title: "معضلات أخلاقية للنقاش", desc: "مواقف قصيرة تدعوك للتفكير في قيمك وكيف توازن بينها.", category: "القيم والأخلاق", type: "نشاط تأملي", minutes: 10, demo: true, codes: ["S", "I"], topics: ["الفلسفة", "علم النفس"] },
  { id: "d6", title: "كيف تتحقق من خبر قبل مشاركته", desc: "خطوات عملية للتحقق من المصدر والتاريخ والصورة.", category: "الثقافة الرقمية والإعلامية", type: "دليل عملي", minutes: 7, demo: true, codes: ["C", "I"], topics: ["التقنية"] },
  { id: "d7", title: "التكرار المتباعد: تعلّم لا يُنسى", desc: "فكرة مراجعة المعلومات على فترات متزايدة لتثبيتها في الذاكرة.", category: "التعلّم وتطوير الذات", type: "مقالة قصيرة", minutes: 6, demo: true, codes: ["C", "I"], topics: ["علم النفس"] },
  { id: "d8", title: "مدخل إلى التفكير التصميمي", desc: "منهجية لحل المشكلات تبدأ بفهم الناس واحتياجاتهم.", category: "التعلّم وتطوير الذات", type: "مقالة قصيرة", minutes: 10, demo: true, codes: ["A", "E", "S"], topics: ["ريادة الأعمال", "الفنون"] },
  { id: "d9", title: "كيف تعمل الآلات البسيطة", desc: "الرافعة والبكرة والمستوى المائل — مبادئ بسيطة خلف أدوات يومية.", category: "العلوم والمعرفة العامة", type: "شرح مصوّر", minutes: 9, demo: true, codes: ["R", "I"], topics: ["العلوم", "البيئة"] },
];
