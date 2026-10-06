import type { RiasecCode } from "./store";

export type Price = "مجاني" | "مدفوع" | "مجاني جزئيًا" | "تجربة مجانية";
export interface Res { name: string; provider: string; price: Price; lang: string; level: string; learn: string; why: string; url: string }
export interface Stage { title: string; outcome: string; topics: string[]; practice: string; quiz: { q: string; options: string[]; answer: number } }
export interface Project { size: "صغير" | "متوسط" | "واقعي"; title: string; objective: string; skills: string[]; steps: string[]; result: string; tools: string[]; portfolio: string }
export interface Track {
  id: string; label: string; keywords: string[]; codes: RiasecCode[];
  have: string[]; needed: string[]; stages: Stage[]; projects: Project[];
  assess: { q: string; options: string[]; answer: number }[];
  resources: Res[][]; // per stage; first = suggested
  career?: { roles: string[]; cv: string[]; interview: string[] };
}

const T: Track[] = [
  {
    id: "code", label: "تعلّم البرمجة (Python)", keywords: ["برمج", "python", "بايثون", "كود", "تطوير"], codes: ["I", "R", "C"],
    have: ["مهارات استخدام الحاسوب الأساسية", "الرغبة في التجربة"],
    needed: ["أساسيات البرمجة", "لغة Python", "حل المشكلات", "Git و GitHub", "بناء مشروع صغير"],
    stages: [
      { title: "أساسيات البرمجة", outcome: "تكتب برنامجًا بسيطًا يأخذ مدخلات ويتخذ قرارات", topics: ["المتغيرات (Variables)", "الشروط (Conditions)", "التكرار (Loops)", "الدوال (Functions)"], practice: "اكتب برنامجًا يسأل عن عمر المستخدم ويخبره هل هو أكبر من 18 أم لا.", quiz: { q: "ما الذي يفعله التكرار (loop)؟", options: ["يخزّن قيمة", "يكرر أوامر عدة مرات", "يطبع نصًا فقط"], answer: 1 } },
      { title: "Python", outcome: "تستخدم القوائم والقواميس والوحدات بثقة", topics: ["قواعد الكتابة (Syntax)", "هياكل البيانات (Lists, Dicts)", "الوحدات (Modules)"], practice: "أنشئ قائمة بأسماء 5 كتب ثم اطبعها مرتبة أبجديًا.", quiz: { q: "أي هيكل يخزّن أزواج مفتاح/قيمة؟", options: ["list", "dict", "str"], answer: 1 } },
      { title: "حل المشكلات", outcome: "تقسّم مشكلة إلى خطوات وتحلّها بالكود", topics: ["تمارين قصيرة", "تحديات متدرجة"], practice: "حلّ 3 تمارين سهلة على منصة تمارين مجانية.", quiz: { q: "أول خطوة لحل مشكلة برمجية؟", options: ["الكتابة فورًا", "فهم المطلوب وتقسيمه", "نسخ حل جاهز"], answer: 1 } },
      { title: "أدوات العمل", outcome: "تحفظ عملك وتشاركه على GitHub", topics: ["Git", "GitHub"], practice: "أنشئ مستودعًا على GitHub وارفع إليه أحد تمارينك.", quiz: { q: "ما وظيفة Git؟", options: ["تتبع تغييرات الكود", "تشغيل الإنترنت", "تصميم الواجهات"], answer: 0 } },
    ],
    projects: [
      { size: "صغير", title: "آلة حاسبة نصية", objective: "تطبيق المتغيرات والشروط والدوال", skills: ["Variables", "Conditions", "Functions"], steps: ["اطلب رقمين وعملية", "نفّذ العملية بدالة", "تعامل مع القسمة على صفر"], result: "برنامج يعمل في الطرفية", tools: ["Python", "محرر نصوص"], portfolio: "رابط المستودع مع شرح قصير" },
      { size: "متوسط", title: "مدير مهام بسيط", objective: "استخدام القوائم وحفظ البيانات في ملف", skills: ["Lists", "Files", "Loops"], steps: ["إضافة مهمة", "عرض المهام", "حذف مهمة", "الحفظ في ملف"], result: "أداة شخصية تستخدمها فعلًا", tools: ["Python", "Git"], portfolio: "مستودع بملف README وصور" },
      { size: "واقعي", title: "أداة تحل مشكلة حقيقية لديك", objective: "تطبيق كل ما تعلمته على حاجة واقعية", skills: ["حل المشكلات", "Modules", "GitHub"], steps: ["حدد مشكلة يومية", "صمم الحل على الورق", "ابنِه على مراحل", "اطلب رأي شخص"], result: "مشروع يمكنك الحديث عنه", tools: ["Python", "GitHub"], portfolio: "دراسة حالة: المشكلة، الحل، ما تعلمته" },
    ],
    assess: [
      { q: "ما ناتج: x = 3 ثم x = x + 2؟", options: ["3", "5", "لا أعرف"], answer: 1 },
      { q: "ماذا يعني if في البرمجة؟", options: ["تكرار", "شرط", "لا أعرف"], answer: 1 },
      { q: "ما الدالة (function)؟", options: ["كتلة كود قابلة لإعادة الاستخدام", "نوع ملف", "لا أعرف"], answer: 0 },
    ],
    resources: [
      [
        { name: "CS50x: مقدمة في علوم الحاسوب", provider: "جامعة هارفارد", price: "مجاني", lang: "الإنجليزية (ترجمات متاحة)", level: "مبتدئ", learn: "أساسيات التفكير البرمجي", why: "رشحناه لأنه يبني الفهم من الصفر ويعتمد على حل المسائل.", url: "https://cs50.harvard.edu/x/" },
        { name: "منهج freeCodeCamp", provider: "freeCodeCamp", price: "مجاني", lang: "الإنجليزية", level: "مبتدئ", learn: "أساسيات البرمجة بالتطبيق", why: "بديل مجاني تفاعلي يناسب من يحب التعلم بالممارسة.", url: "https://www.freecodecamp.org/learn" },
        { name: "Python for Everybody", provider: "Coursera / جامعة ميشيغان", price: "مجاني جزئيًا", lang: "الإنجليزية", level: "مبتدئ", learn: "البرمجة بـ Python بإيقاع منظم", why: "مناسب لمن يفضل مسارًا منظمًا؛ الشهادة مدفوعة.", url: "https://www.coursera.org/specializations/python" },
      ],
      [
        { name: "دليل Python الرسمي (Tutorial)", provider: "Python.org", price: "مجاني", lang: "الإنجليزية", level: "مبتدئ–متوسط", learn: "قواعد اللغة وهياكل البيانات", why: "مرجع موثوق أثناء التطبيق، لكنه ليس أفضل مصدر وحيد للمبتدئ.", url: "https://docs.python.org/3/tutorial/" },
        { name: "منهج freeCodeCamp", provider: "freeCodeCamp", price: "مجاني", lang: "الإنجليزية", level: "مبتدئ", learn: "تمارين Python تفاعلية", why: "بديل مجاني للتطبيق المباشر.", url: "https://www.freecodecamp.org/learn" },
      ],
      [
        { name: "مسار Python على Exercism", provider: "Exercism", price: "مجاني", lang: "الإنجليزية", level: "كل المستويات", learn: "تمارين مع ملاحظات المرشدين", why: "يركز على الممارسة المتدرجة، وهذا ما تحتاجه هنا.", url: "https://exercism.org/tracks/python" },
        { name: "Codewars", provider: "Codewars", price: "مجاني", lang: "الإنجليزية", level: "كل المستويات", learn: "تحديات قصيرة", why: "بديل مجاني ممتع للتحديات.", url: "https://www.codewars.com/" },
      ],
      [
        { name: "GitHub Skills", provider: "GitHub", price: "مجاني", lang: "الإنجليزية", level: "مبتدئ", learn: "استخدام Git و GitHub عمليًا", why: "تتعلم داخل GitHub نفسه خطوة بخطوة.", url: "https://skills.github.com/" },
        { name: "كتاب Pro Git", provider: "git-scm.com", price: "مجاني", lang: "متعدد اللغات", level: "مبتدئ–متوسط", learn: "فهم Git بعمق", why: "مرجع رسمي مجاني للرجوع إليه.", url: "https://git-scm.com/book" },
      ],
    ],
    career: { roles: ["مطوّر مبتدئ (Junior Developer)", "محلل بيانات مبتدئ", "مختبر برمجيات"], cv: ["Python", "Git/GitHub", "حل المشكلات"], interview: ["اشرح مشروعًا بنيته وما الذي تعلمته", "حلّ مسألة بصوت مرتفع"] },
  },
  {
    id: "english", label: "تحسين اللغة الإنجليزية", keywords: ["انجليز", "إنجليز", "english", "لغة"], codes: ["S", "A"],
    have: ["معرفة بعض الكلمات", "تعرّض للمحتوى الإنجليزي"],
    needed: ["مفردات يومية", "الاستماع", "الكتابة", "المحادثة"],
    stages: [
      { title: "المفردات والقواعد الأساسية", outcome: "تفهم وتستخدم جملًا يومية بسيطة", topics: ["مفردات يومية", "الأزمنة الأساسية", "تكوين الجمل"], practice: "اكتب 5 جمل عن يومك بالإنجليزية.", quiz: { q: "اختر الصحيح: She ___ to work every day.", options: ["go", "goes", "going"], answer: 1 } },
      { title: "الاستماع", outcome: "تفهم الفكرة العامة لمقطع قصير", topics: ["مقاطع قصيرة", "التقاط الكلمات المفتاحية"], practice: "استمع لمقطع 3 دقائق واكتب 3 أفكار فهمتها.", quiz: { q: "أفضل طريقة للاستماع في البداية؟", options: ["مقاطع طويلة بلا ترجمة", "مقاطع قصيرة متكررة", "تجنب الاستماع"], answer: 1 } },
      { title: "الكتابة", outcome: "تكتب فقرة واضحة", topics: ["الفقرة", "الربط بين الجمل"], practice: "اكتب فقرة من 6 جمل عن هدفك.", quiz: { q: "ما الذي يربط الجمل؟", options: ["Linking words", "Numbers", "Emojis"], answer: 0 } },
      { title: "المحادثة", outcome: "تتحدث دقيقتين عن موضوع مألوف", topics: ["التعريف بالنفس", "الحديث عن موضوع مألوف"], practice: "سجّل صوتك دقيقة تعرّف فيها بنفسك.", quiz: { q: "ما الأهم في المحادثة في البداية؟", options: ["الكمال", "الاستمرار والوضوح", "الصمت"], answer: 1 } },
    ],
    projects: [
      { size: "صغير", title: "يومياتي الإنجليزية", objective: "الكتابة المنتظمة", skills: ["مفردات", "كتابة"], steps: ["اكتب 3 جمل يوميًا لمدة أسبوع", "راجعها بأداة تصحيح"], result: "7 فقرات قصيرة", tools: ["دفتر", "Write & Improve"], portfolio: "—" },
      { size: "متوسط", title: "تلخيص بودكاست", objective: "الاستماع والكتابة معًا", skills: ["استماع", "تلخيص"], steps: ["اختر حلقة قصيرة", "دوّن الأفكار", "اكتب ملخصًا"], result: "ملخص مكتوب", tools: ["BBC Learning English"], portfolio: "—" },
      { size: "واقعي", title: "تقديم شخصي مسجّل", objective: "المحادثة بثقة", skills: ["محادثة"], steps: ["اكتب نقاطك", "تدرّب", "سجّل فيديو دقيقتين"], result: "فيديو تعريفي", tools: ["هاتفك"], portfolio: "يفيد في مقابلات العمل" },
    ],
    assess: [
      { q: "ما معنى: I have been working here for two years؟", options: ["أعمل هنا منذ سنتين", "سأعمل سنتين", "لا أعرف"], answer: 0 },
      { q: "اختر الصحيح: There ___ many people.", options: ["is", "are", "لا أعرف"], answer: 1 },
      { q: "ما مرادف big؟", options: ["large", "small", "لا أعرف"], answer: 0 },
    ],
    resources: [
      [
        { name: "LearnEnglish", provider: "British Council", price: "مجاني", lang: "الإنجليزية", level: "كل المستويات", learn: "قواعد ومفردات بتمارين", why: "منظم حسب المستوى ومن جهة موثوقة.", url: "https://learnenglish.britishcouncil.org/" },
        { name: "Duolingo", provider: "Duolingo", price: "مجاني جزئيًا", lang: "العربية/الإنجليزية", level: "مبتدئ", learn: "مفردات يومية بتمارين قصيرة", why: "مناسب لدقائق قليلة يوميًا.", url: "https://www.duolingo.com/" },
      ],
      [
        { name: "BBC Learning English", provider: "BBC", price: "مجاني", lang: "الإنجليزية", level: "كل المستويات", learn: "استماع بمقاطع قصيرة", why: "مقاطع قصيرة واضحة تناسب التدرج.", url: "https://www.bbc.co.uk/learningenglish" },
      ],
      [
        { name: "Write & Improve", provider: "Cambridge", price: "مجاني جزئيًا", lang: "الإنجليزية", level: "كل المستويات", learn: "تصحيح الكتابة", why: "يعطيك ملاحظات على كتابتك فورًا.", url: "https://writeandimprove.com/" },
      ],
      [
        { name: "BBC Learning English", provider: "BBC", price: "مجاني", lang: "الإنجليزية", level: "كل المستويات", learn: "عبارات المحادثة", why: "يقدم عبارات حقيقية تستخدم يوميًا.", url: "https://www.bbc.co.uk/learningenglish" },
      ],
    ],
  },
  {
    id: "marketing", label: "تعلّم التسويق", keywords: ["تسويق", "marketing", "business", "مبيعات", "أعمال"], codes: ["E", "A", "S"],
    have: ["فهم عام لمنصات التواصل"],
    needed: ["فهم العميل", "أساسيات التسويق الرقمي", "المحتوى", "قياس النتائج"],
    stages: [
      { title: "فهم العميل", outcome: "تبني ملف عميل واضح", topics: ["تقسيم العملاء", "ملف العميل (Persona)"], practice: "حلّل شركة تعرفها واكتب ملفًا لعميلها المثالي.", quiz: { q: "تقسيم العملاء يعني؟", options: ["البيع للجميع", "تقسيمهم لمجموعات متشابهة", "خفض الأسعار"], answer: 1 } },
      { title: "التسويق الرقمي", outcome: "تفهم القنوات الأساسية ومتى تستخدم كلًّا منها", topics: ["القنوات الرقمية", "محركات البحث", "منصات التواصل"], practice: "اقترح قناتين لمشروع صغير مع سبب كل منهما.", quiz: { q: "SEO تتعلق بـ؟", options: ["محركات البحث", "الطباعة", "المحاسبة"], answer: 0 } },
      { title: "المحتوى والقياس", outcome: "تخطط محتوى وتقيس نتيجته", topics: ["خطة محتوى", "المؤشرات الأساسية"], practice: "صمّم خطة محتوى لأسبوع واحد بثلاثة منشورات.", quiz: { q: "مؤشر يقيس التفاعل؟", options: ["Engagement rate", "الإيجار", "عدد الموظفين"], answer: 0 } },
    ],
    projects: [
      { size: "صغير", title: "ملف عميل لعلامة محلية", objective: "تطبيق تقسيم العملاء", skills: ["Persona"], steps: ["اختر علامة", "اجمع ملاحظات", "اكتب الملف"], result: "صفحة ملف عميل", tools: ["مستند", "Canva"], portfolio: "دراسة حالة قصيرة" },
      { size: "متوسط", title: "خطة تسويق لشهر", objective: "ربط القنوات بالأهداف", skills: ["القنوات", "المحتوى"], steps: ["حدد الهدف", "اختر القنوات", "جدول المحتوى", "مؤشرات النجاح"], result: "خطة قابلة للتنفيذ", tools: ["جدول بيانات"], portfolio: "ملف PDF للخطة" },
      { size: "واقعي", title: "حملة صغيرة حقيقية", objective: "تجربة وقياس", skills: ["المحتوى", "القياس"], steps: ["ساعد مشروعًا صغيرًا أو صديقًا", "انشر", "قِس", "اكتب ما تعلمته"], result: "نتائج حقيقية", tools: ["منصات التواصل"], portfolio: "قبل/بعد مع الأرقام" },
    ],
    assess: [
      { q: "ما الـ Target audience؟", options: ["الجمهور المستهدف", "المنافسون", "لا أعرف"], answer: 0 },
      { q: "ما CTR؟", options: ["نسبة النقر", "التكلفة الكلية", "لا أعرف"], answer: 0 },
      { q: "ما Funnel التسويقي؟", options: ["مراحل رحلة العميل", "نوع إعلان", "لا أعرف"], answer: 0 },
    ],
    resources: [
      [
        { name: "HubSpot Academy", provider: "HubSpot", price: "مجاني", lang: "الإنجليزية", level: "مبتدئ", learn: "أساسيات التسويق وفهم العميل", why: "دورات عملية مجانية من شركة تسويق معروفة.", url: "https://academy.hubspot.com/" },
        { name: "إدراك", provider: "Edraak", price: "مجاني", lang: "العربية", level: "مبتدئ", learn: "دورات عربية متنوعة", why: "بديل عربي مجاني؛ ابحث فيه عن التسويق.", url: "https://www.edraak.org/" },
      ],
      [
        { name: "Google Skillshop", provider: "Google", price: "مجاني", lang: "متعدد اللغات", level: "مبتدئ–متوسط", learn: "أدوات Google التسويقية", why: "مصدر رسمي لأدوات البحث والإعلان.", url: "https://skillshop.withgoogle.com/" },
        { name: "Google Digital Marketing & E-commerce Certificate", provider: "Google / Coursera", price: "مدفوع", lang: "الإنجليزية", level: "مبتدئ", learn: "مسار منظم بشهادة", why: "بديل مدفوع لمن يريد شهادة منظمة. تحقق من السعر في الموقع.", url: "https://grow.google/certificates/digital-marketing-ecommerce/" },
      ],
      [
        { name: "HubSpot Academy", provider: "HubSpot", price: "مجاني", lang: "الإنجليزية", level: "مبتدئ", learn: "تسويق المحتوى", why: "يغطي التخطيط والقياس عمليًا.", url: "https://academy.hubspot.com/" },
      ],
    ],
    career: { roles: ["مسوّق رقمي مبتدئ", "منسق محتوى", "تطوير أعمال (Business Development)"], cv: ["تقسيم العملاء", "تخطيط المحتوى", "قياس الأداء"], interview: ["اعرض خطة تسويق أعددتها", "كيف تقيس نجاح حملة؟"] },
  },
  {
    id: "design", label: "تعلّم التصميم", keywords: ["تصميم", "design", "ux", "جرافيك"], codes: ["A", "I"],
    have: ["ذوق بصري وملاحظة"],
    needed: ["مبادئ التصميم", "أداة تصميم", "التطبيق", "ملف أعمال"],
    stages: [
      { title: "مبادئ التصميم", outcome: "تميّز التصميم الجيد وتشرح السبب", topics: ["التباين والمحاذاة", "الألوان", "الخطوط"], practice: "اختر إعلانًا واكتب 3 أشياء نجحت فيه وشيئًا يمكن تحسينه.", quiz: { q: "المحاذاة تساعد على؟", options: ["الفوضى", "التنظيم والوضوح", "إخفاء النص"], answer: 1 } },
      { title: "الأداة", outcome: "تستخدم أداة تصميم بثقة", topics: ["واجهة Figma", "الإطارات والمكونات"], practice: "أعد رسم بطاقة تطبيق بسيطة في Figma.", quiz: { q: "Figma أداة لـ؟", options: ["تصميم الواجهات", "المحاسبة", "البرمجة فقط"], answer: 0 } },
      { title: "التطبيق", outcome: "تصمم شيئًا أصيلًا", topics: ["إعادة تصميم", "تصميم أصيل"], practice: "صمّم ملصقًا لفعالية خيالية.", quiz: { q: "إعادة التصميم مفيدة لأنها؟", options: ["تعلّمك بالمقارنة", "سرقة", "بلا فائدة"], answer: 0 } },
    ],
    projects: [
      { size: "صغير", title: "إعادة تصميم ملصق", objective: "تطبيق المبادئ", skills: ["التباين", "الخطوط"], steps: ["اختر ملصقًا", "حدد المشاكل", "أعد تصميمه"], result: "قبل/بعد", tools: ["Canva", "Figma"], portfolio: "مقارنة قبل وبعد" },
      { size: "متوسط", title: "شاشة تطبيق", objective: "تصميم واجهة", skills: ["Figma", "التخطيط"], steps: ["حدد المستخدم", "ارسم مخططًا", "صمّم الشاشة"], result: "تصميم شاشة كامل", tools: ["Figma"], portfolio: "عرض الشاشة مع شرح القرارات" },
      { size: "واقعي", title: "هوية بصرية لمشروع صغير", objective: "عمل لعميل حقيقي", skills: ["الألوان", "الخطوط", "الشعار"], steps: ["افهم المشروع", "اقترح اتجاهين", "طوّر المختار"], result: "دليل هوية مختصر", tools: ["Figma"], portfolio: "دراسة حالة كاملة" },
    ],
    assess: [
      { q: "ما الـ Contrast؟", options: ["الفرق الواضح بين العناصر", "نوع خط", "لا أعرف"], answer: 0 },
      { q: "ما الـ Whitespace؟", options: ["مساحة فارغة مقصودة", "خطأ في التصميم", "لا أعرف"], answer: 0 },
      { q: "هل استخدمت Figma أو أداة مشابهة؟", options: ["نعم", "قليلًا", "لا"], answer: 0 },
    ],
    resources: [
      [
        { name: "Canva Design School", provider: "Canva", price: "مجاني", lang: "متعدد اللغات", level: "مبتدئ", learn: "مبادئ التصميم ببساطة", why: "مقدمة بسيطة وتطبيقية للمبتدئين.", url: "https://www.canva.com/designschool/" },
        { name: "Refactoring UI", provider: "Adam Wathan & Steve Schoger", price: "مدفوع", lang: "الإنجليزية", level: "متوسط", learn: "قرارات تصميم عملية", why: "كتاب مدفوع عملي جدًا لمن يريد التعمق.", url: "https://www.refactoringui.com/" },
      ],
      [
        { name: "Figma Learn", provider: "Figma", price: "مجاني", lang: "الإنجليزية", level: "مبتدئ", learn: "استخدام Figma", why: "مصدر رسمي من صانع الأداة.", url: "https://help.figma.com/hc/en-us/categories/360002051613" },
      ],
      [
        { name: "Google UX Design Certificate", provider: "Google / Coursera", price: "مدفوع", lang: "الإنجليزية", level: "مبتدئ", learn: "مسار UX منظم بمشاريع", why: "بديل مدفوع منظم. تحقق من السعر في الموقع.", url: "https://grow.google/certificates/ux-design/" },
        { name: "Canva Design School", provider: "Canva", price: "مجاني", lang: "متعدد اللغات", level: "مبتدئ", learn: "تطبيقات تصميم", why: "بديل مجاني للتطبيق.", url: "https://www.canva.com/designschool/" },
      ],
    ],
    career: { roles: ["مصمم واجهات مبتدئ", "مصمم جرافيك", "مصمم محتوى"], cv: ["Figma", "مبادئ التصميم", "ملف أعمال"], interview: ["اشرح قرارات تصميم في مشروع"] },
  },
  {
    id: "career", label: "الاستعداد لسوق العمل", keywords: ["عمل", "وظيف", "سوق", "مقابل", "cv"], codes: ["E", "S", "C"],
    have: ["خبرات دراسية أو حياتية"],
    needed: ["معرفة نقاط قوتك", "سيرة ذاتية واضحة", "التحضير للمقابلات", "مهارات التواصل"],
    stages: [
      { title: "اعرف نفسك مهنيًا", outcome: "تصيغ نقاط قوتك بوضوح", topics: ["نقاط القوة", "الأدوار المناسبة للاستكشاف"], practice: "اكتب 3 مواقف أظهرت فيها مهارة ما.", quiz: { q: "أفضل طريقة لإثبات مهارة؟", options: ["ذكرها فقط", "مثال من موقف حقيقي", "تجاهلها"], answer: 1 } },
      { title: "السيرة الذاتية", outcome: "سيرة ذاتية من صفحة واضحة", topics: ["هيكل السيرة", "صياغة الإنجازات"], practice: "أعد كتابة إنجاز واحد بصيغة: فعل + نتيجة.", quiz: { q: "صياغة أقوى؟", options: ["كنت مسؤولًا عن…", "زدت المبيعات 10% عبر…", "عملت هناك"], answer: 1 } },
      { title: "المقابلات", outcome: "تجيب بثقة عن الأسئلة الشائعة", topics: ["أسلوب STAR", "التدرب على الأسئلة"], practice: "أجب عن «حدثني عن نفسك» في دقيقة وسجّل إجابتك.", quiz: { q: "STAR تعني؟", options: ["موقف، مهمة، فعل، نتيجة", "اسم شركة", "نوع سيرة"], answer: 0 } },
    ],
    projects: [
      { size: "صغير", title: "سيرة ذاتية من صفحة", objective: "عرض نفسك بوضوح", skills: ["الصياغة"], steps: ["اجمع خبراتك", "اختر الأهم", "صُغها بالإنجازات"], result: "سيرة جاهزة", tools: ["مستند"], portfolio: "—" },
      { size: "متوسط", title: "مقابلة تجريبية", objective: "التدرب", skills: ["STAR", "التواصل"], steps: ["اختر 5 أسئلة", "حضّر قصصك", "تدرب مع صديق أو أداة"], result: "ثقة أكبر", tools: ["Interview Warmup"], portfolio: "—" },
      { size: "واقعي", title: "التقديم على 3 فرص", objective: "خطوة فعلية", skills: ["البحث", "التخصيص"], steps: ["اختر فرصًا مناسبة", "خصص السيرة", "قدّم وتابع"], result: "تجربة حقيقية وتعلّم", tools: ["LinkedIn"], portfolio: "—" },
    ],
    assess: [
      { q: "هل لديك سيرة ذاتية حالية؟", options: ["نعم ومحدثة", "قديمة", "لا"], answer: 0 },
      { q: "هل خضت مقابلة عمل؟", options: ["نعم", "مرة واحدة", "لا"], answer: 0 },
      { q: "هل تعرف أسلوب STAR؟", options: ["نعم", "سمعت به", "لا"], answer: 0 },
    ],
    resources: [
      [
        { name: "إدراك", provider: "Edraak", price: "مجاني", lang: "العربية", level: "مبتدئ", learn: "دورات مهارات العمل بالعربية", why: "مصدر عربي مجاني؛ ابحث فيه عن مهارات التوظيف.", url: "https://www.edraak.org/" },
      ],
      [
        { name: "LinkedIn Learning", provider: "LinkedIn", price: "تجربة مجانية", lang: "متعدد اللغات", level: "كل المستويات", learn: "كتابة السيرة والمهارات المهنية", why: "مكتبة واسعة؛ ابدأ بالتجربة المجانية إن رغبت.", url: "https://www.linkedin.com/learning/" },
        { name: "إدراك", provider: "Edraak", price: "مجاني", lang: "العربية", level: "مبتدئ", learn: "مهارات التوظيف", why: "بديل عربي مجاني.", url: "https://www.edraak.org/" },
      ],
      [
        { name: "Interview Warmup", provider: "Google", price: "مجاني", lang: "الإنجليزية", level: "كل المستويات", learn: "التدرب على أسئلة المقابلات", why: "أداة مجانية للتدرب بصوتك مباشرة.", url: "https://grow.google/certificates/interview-warmup/" },
      ],
    ],
    career: { roles: ["حسب اهتماماتك من الجزء الأول"], cv: ["التواصل", "حل المشكلات", "العمل الجماعي"], interview: ["حدثني عن نفسك", "موقف صعب وكيف تعاملت معه"] },
  },
];

export const GENERAL: Track = {
  id: "general", label: "هدف خاص", keywords: [], codes: [],
  have: ["فضولك ورغبتك في التعلم"], needed: ["فهم أساسيات المجال", "التطبيق العملي", "مشروع صغير"],
  stages: [
    { title: "استكشاف المجال", outcome: "تعرف المفاهيم الأساسية والمصطلحات", topics: ["المفاهيم الأساسية", "أهم المصطلحات"], practice: "اشرح المجال في 5 جمل كأنك تشرحه لصديق.", quiz: { q: "ما أفضل دليل على فهمك؟", options: ["أن تشرحه ببساطة", "أن تحفظ تعريفًا", "أن تشاهد فيديو"], answer: 0 } },
    { title: "التطبيق", outcome: "تطبق ما تعلمته في نشاط صغير", topics: ["تمرين عملي", "طلب ملاحظات"], practice: "نفّذ نشاطًا صغيرًا مرتبطًا بالمجال وشاركه مع شخص.", quiz: { q: "الملاحظات تفيد في؟", options: ["التحسين", "الإحباط", "لا شيء"], answer: 0 } },
    { title: "مشروع", outcome: "تنجز مشروعًا صغيرًا", topics: ["تخطيط المشروع", "التنفيذ والمراجعة"], practice: "اكتب خطة مشروع من 3 خطوات.", quiz: { q: "المشروع الجيد للبداية؟", options: ["صغير وواضح", "ضخم ومعقد", "بلا هدف"], answer: 0 } },
  ],
  projects: [{ size: "صغير", title: "مشروع تعلّم شخصي", objective: "تطبيق ما تعلمته", skills: ["التطبيق"], steps: ["حدد ناتجًا صغيرًا", "نفّذه", "اكتب ما تعلمته"], result: "ناتج ملموس", tools: ["حسب المجال"], portfolio: "اكتب دراسة حالة قصيرة" }],
  assess: [
    { q: "هل تعرف المصطلحات الأساسية في هذا المجال؟", options: ["نعم", "بعضها", "لا"], answer: 0 },
    { q: "هل جربت تطبيق شيء فيه؟", options: ["نعم", "قليلًا", "لا"], answer: 0 },
  ],
  resources: [
    [
      { name: "إدراك", provider: "Edraak", price: "مجاني", lang: "العربية", level: "مبتدئ", learn: "دورات عربية متنوعة", why: "منصة عربية مجانية؛ ابحث فيها عن مجالك.", url: "https://www.edraak.org/" },
      { name: "Khan Academy", provider: "Khan Academy", price: "مجاني", lang: "متعدد اللغات", level: "مبتدئ", learn: "أساسيات في مجالات كثيرة", why: "بديل مجاني موثوق إن كان مجالك علميًا.", url: "https://www.khanacademy.org/" },
      { name: "Coursera", provider: "Coursera", price: "مجاني جزئيًا", lang: "متعدد اللغات", level: "كل المستويات", learn: "دورات جامعية", why: "كثير من الدورات يمكن متابعتها مجانًا؛ الشهادات مدفوعة.", url: "https://www.coursera.org/" },
    ],
    [], [],
  ],
};

export const TRACKS = T;
export const PRESETS = [
  { goal: "أريد تعلم البرمجة", track: "code" },
  { goal: "أريد تحسين اللغة الإنجليزية", track: "english" },
  { goal: "أريد تعلم التسويق", track: "marketing" },
  { goal: "أريد تطوير مهارات Business Development", track: "marketing" },
  { goal: "أريد تعلم التصميم", track: "design" },
  { goal: "أريد الاستعداد لسوق العمل", track: "career" },
];

export function trackFor(goal: string, id?: string): Track {
  if (id) { const t = [...T, GENERAL].find((x) => x.id === id); if (t) return t; }
  const g = goal.toLowerCase();
  return T.find((t) => t.keywords.some((k) => g.includes(k))) ?? GENERAL;
}

export const allTopics = (t: Track) => t.stages.flatMap((s, si) => s.topics.map((name, ti) => ({ key: `${si}-${ti}`, name, si })));

/** Starting stage from self-reported level + quick check score (0..1). */
export function startStage(level: string, score: number | null, stages: number) {
  let st = 0;
  if (score !== null) st = score >= 0.99 ? 2 : score >= 0.6 ? 1 : 0;
  else if (level === "متوسط") st = 2; else if (level === "عندي أساسيات") st = 1;
  return Math.min(st, Math.max(0, stages - 2));
}

/** Topics per week from available time and workload. */
export function pace(time: string, load: "light" | "normal" | "more") {
  const base = time === "أكثر" ? 4 : time === "1–2 ساعة" ? 3 : time === "حوالي ساعة" ? 2 : 1;
  return Math.max(1, base + (load === "light" ? -1 : load === "more" ? 1 : 0));
}

export function filterByBudget(list: Res[], budget: string) {
  if (budget !== "مجاني فقط") return list;
  return list.filter((r) => r.price === "مجاني" || r.price === "مجاني جزئيًا");
}
