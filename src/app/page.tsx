
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  BarChart3,
  Boxes,
  Check,
  ChevronDown,
  ClipboardList,
  Globe2,
  LayoutDashboard,
  Package,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    number: "01",
    title: "المتجر الإلكتروني",
    description:
      "اعرض منتجاتك ونظّم تصنيفاتك وأسعارك، وامنح عملاءك تجربة تسوق واضحة وسهلة.",
  },
  {
    icon: ClipboardList,
    number: "02",
    title: "إدارة الطلبات",
    description:
      "اجمع طلباتك في مكان واحد وتابع مراحل تجهيزها ومعالجتها وتسليمها.",
  },
  {
    icon: Boxes,
    number: "03",
    title: "المخزون والمنتجات",
    description:
      "راقب حركة منتجاتك والكميات المتاحة، وحافظ على تنظيم مخزونك.",
  },
  {
    icon: Truck,
    number: "04",
    title: "الشحن والتوصيل",
    description:
      "نظّم عمليات التوصيل وتابع حالة الشحنات والطلبات المرسلة.",
  },
  {
    icon: Wallet,
    number: "05",
    title: "الدفع عند الاستلام",
    description:
      "تابع المبالغ المحصلة والمستحقة وسجّل عمليات الدفع المرتبطة بطلباتك.",
  },
  {
    icon: BarChart3,
    number: "06",
    title: "التقارير والأداء",
    description:
      "افهم أداء نشاطك من خلال بيانات المبيعات والطلبات وحركة المنتجات.",
  },
];

const workflow = [
  {
    number: "01",
    title: "أنشئ مساحة عملك",
    description:
      "ابدأ بإنشاء حسابك وحدد طبيعة نشاطك التجاري لإعداد بيئة العمل.",
  },
  {
    number: "02",
    title: "نظّم عملياتك",
    description:
      "أضف المنتجات ونظّم المخزون واضبط طريقة استقبال الطلبات.",
  },
  {
    number: "03",
    title: "تابع كل شيء",
    description:
      "راقب الطلبات والمبيعات والتوصيل من لوحة تحكم موحدة.",
  },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#174D3A] text-xl font-black text-white">
        S
      </div>
      <span className="text-[23px] font-extrabold tracking-[-1px] text-[#172D25]">
        Sougi<span className="text-[#398064]">fy</span>
      </span>
    </Link>
  );
}

function SectionTitle({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="text-xs font-bold tracking-wide text-[#398064]">
        {label}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold leading-[1.4] tracking-tight text-[#172D25] md:text-[42px]">
        {title}
      </h2>
      <p className="mt-5 text-sm leading-8 text-[#737D76] md:text-base">
        {description}
      </p>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[650px]">
      <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-[#DCEBE1] blur-3xl" />

      <div className="relative overflow-hidden rounded-[18px] border border-[#E3E8E2] bg-white shadow-[0_30px_90px_-35px_rgba(27,61,43,0.23)]">
        {/* Browser bar */}
        <div className="flex h-12 items-center justify-between border-b border-[#EDF0EB] bg-[#FAFBF9] px-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5B9AE]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E8D5A2]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#B5CEB9]" />
          </div>
          <span className="text-[9px] font-medium text-[#A0AAA2]">
            app.sougify.com
          </span>
          <Globe2 size={13} className="text-[#9CA69E]" />
        </div>

        <div className="grid grid-cols-[1fr_150px] sm:grid-cols-[1fr_175px]" dir="ltr">
          {/* Main dashboard */}
          <div className="min-w-0 p-4 sm:p-6" dir="rtl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] text-[#929D95]">
                  مساحة العمل / الرئيسية
                </p>
                <h3 className="mt-2 text-base font-extrabold text-[#20372C] sm:text-xl">
                  نظرة عامة
                </h3>
              </div>
              <div className="rounded-lg border border-[#E7ECE6] px-2 py-1.5 text-[9px] text-[#66766A]">
                آخر 30 يوماً
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { label: "إجمالي الطلبات", value: "128", icon: ClipboardList },
                { label: "المنتجات", value: "64", icon: Package },
                { label: "قيد المعالجة", value: "12", icon: Truck },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#E9EEE8] bg-[#FCFDFC] p-3"
                >
                  <item.icon size={15} className="text-[#398064]" />
                  <p className="mt-4 text-[9px] text-[#87938A]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-[#20372C]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="mt-4 rounded-xl border border-[#E9EEE8] p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-[#314638]">
                  حركة الطلبات
                </p>
                <span className="text-[9px] text-[#87938A]">
                  عرض توضيحي
                </span>
              </div>

              <div className="mt-5 flex h-28 items-end gap-2">
                {[30, 45, 36, 62, 48, 75, 57, 86, 67, 78, 58, 92].map(
                  (height, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-t-sm ${
                        index === 11
                          ? "bg-[#174D3A]"
                          : "bg-[#B9D4C3]"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>
              <div className="mt-3 flex justify-between text-[8px] text-[#A1AAA3]">
                <span>01</span>
                <span>07</span>
                <span>14</span>
                <span>21</span>
                <span>30</span>
              </div>
            </div>

            {/* Recent orders */}
            <div className="mt-4 rounded-xl border border-[#E9EEE8] p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-bold text-[#314638]">
                  أحدث الطلبات
                </p>
                <span className="text-[9px] text-[#398064]">
                  جميع الطلبات
                </span>
              </div>

              {[
                ["#1024", "جديد"],
                ["#1023", "قيد المعالجة"],
                ["#1022", "تم التجهيز"],
              ].map(([id, status]) => (
                <div
                  key={id}
                  className="flex items-center justify-between border-t border-[#F0F2EF] py-2.5"
                >
                  <span className="text-[9px] font-semibold text-[#58665C]">
                    {id}
                  </span>
                  <span className="rounded-md bg-[#EDF5EF] px-2 py-1 text-[8px] font-semibold text-[#347354]">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="border-r border-[#E9EEE8] bg-[#FAFBF9] p-3 sm:p-4" dir="rtl">
            <div className="mb-7 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#174D3A] text-xs font-black text-white">
                S
              </div>
              <span className="text-xs font-extrabold text-[#263D30]">
                Sougify
              </span>
            </div>

            <p className="mb-3 text-[8px] font-bold text-[#A1AAA3]">
              مساحة العمل
            </p>

            {[
              { icon: LayoutDashboard, title: "الرئيسية", active: true },
              { icon: ShoppingBag, title: "الطلبات" },
              { icon: Package, title: "المنتجات" },
              { icon: Boxes, title: "المخزون" },
              { icon: Truck, title: "التوصيل" },
              { icon: BarChart3, title: "التقارير" },
            ].map((item) => (
              <div
                key={item.title}
                className={`mb-1 flex items-center gap-2 rounded-lg px-2 py-2.5 text-[9px] font-semibold ${
                  item.active
                    ? "bg-[#E8F1EA] text-[#20583F]"
                    : "text-[#7F8A81]"
                }`}
              >
                <item.icon size={13} />
                {item.title}
              </div>
            ))}

            <div className="mt-8 border-t border-[#E9EEE8] pt-4">
              <p className="text-[8px] leading-5 text-[#A1AAA3]">
                مساحة عملك التجارية
              </p>
            </div>
          </aside>
        </div>

        <div className="border-t border-[#EDF0EB] bg-[#FAFBF9] px-4 py-2.5 text-center text-[9px] text-[#8C988E]">
          نموذج توضيحي للواجهة — البيانات المعروضة تجريبية
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F8F9F6] font-sans text-[#172D25] selection:bg-[#D7E8DC] selection:text-[#174D3A]"
    >
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#E8ECE6] bg-[#F8F9F6]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 md:px-8">
          <Brand />

          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-[#69776D] md:flex">
            <Link href="#features" className="transition hover:text-[#174D3A]">
              المميزات
            </Link>
            <Link href="#platform" className="transition hover:text-[#174D3A]">
              المنصة
            </Link>
            <Link href="#how" className="transition hover:text-[#174D3A]">
              كيف تعمل
            </Link>
            <Link href="#faq" className="transition hover:text-[#174D3A]">
              الأسئلة الشائعة
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden px-3 py-2 text-sm font-bold text-[#526358] transition hover:text-[#174D3A] sm:block"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 rounded-lg bg-[#174D3A] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#236348]"
            >
              ابدأ الآن
              <ArrowUpLeft size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E8ECE6]">
        <div className="absolute left-0 top-0 h-full w-[42%] bg-[#EEF3EC] opacity-60" />

        <div className="relative mx-auto grid max-w-[1240px] items-center gap-16 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 text-xs font-bold text-[#398064]">
              <span className="h-2 w-2 rounded-full bg-[#398064]" />
              منصة لإدارة التجارة والأعمال
            </div>

            <h1 className="max-w-xl text-[39px] font-black leading-[1.4] tracking-tight text-[#172D25] sm:text-5xl lg:text-[59px]">
              كل تفاصيل تجارتك
              <br />
              <span className="text-[#398064]">
                في مكان واحد.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-9 text-[#727D74] md:text-base">
              من المنتجات والمخزون إلى الطلبات والتوصيل. يمنحك Sougify
              مساحة عمل منظمة لإدارة عملياتك التجارية ومتابعة تفاصيلها
              من لوحة تحكم واحدة.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/auth/signup"
                className="group flex items-center gap-4 rounded-lg bg-[#174D3A] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#236348]"
              >
                أنشئ مساحة عملك
                <ArrowLeft
                  size={17}
                  className="transition group-hover:-translate-x-1"
                />
              </Link>
              <Link
                href="#features"
                className="flex items-center gap-2 px-3 py-3 text-sm font-bold text-[#58685D] transition hover:text-[#174D3A]"
              >
                اكتشف المميزات
                <ArrowUpLeft size={16} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#E4E9E2] pt-6 text-[11px] font-medium text-[#7D897F]">
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#398064]" />
                إدارة مركزية
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#398064]" />
                واجهة عربية
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#398064]" />
                تجربة استخدام واضحة
              </span>
            </div>
          </div>

          <div id="platform" className="relative">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <SectionTitle
            label="إدارة متكاملة"
            title="الأعمال اليومية تحتاج إلى نظام يجمع تفاصيلها."
            description="عندما تتوزع بيانات المنتجات والطلبات والمخزون بين أدوات مختلفة، يصبح تتبع العمليات أكثر صعوبة. يجمع Sougify هذه الجوانب ضمن تجربة عمل موحدة."
          />

          <div className="border-r-2 border-[#A5C5AC] pr-6 md:mr-auto md:max-w-sm">
            <p className="text-sm leading-9 text-[#78837A]">
              ليس الهدف إضافة أدوات أكثر إلى يومك، بل تنظيم الأدوات
              والعمليات التي تحتاجها فعلاً حتى تكون الصورة أوضح
              والقرارات أسهل.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-[#E8ECE6] bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-24 md:px-8">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              label="إمكانيات المنصة"
              title="كل عملية لها مكانها."
              description="الأدوات الأساسية لتنظيم نشاطك التجاري، مصممة لتعمل ضمن مساحة واحدة."
            />
            <span className="hidden pb-2 text-xs font-semibold text-[#929D94] md:block">
              06 أدوات لإدارة عملياتك
            </span>
          </div>

          <div className="grid border-l border-t border-[#E8ECE6] sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group min-h-[245px] border-b border-r border-[#E8ECE6] p-7 transition-colors hover:bg-[#F8FAF7] md:p-9"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF4EE] text-[#398064] transition group-hover:bg-[#174D3A] group-hover:text-white">
                    <feature.icon size={21} />
                  </div>
                  <span className="text-xs font-semibold text-[#B0BAB0]">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-extrabold text-[#263B2E]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[13px] leading-8 text-[#7B867D]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="how" className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionTitle
              label="طريقة العمل"
              title="من الإعداد إلى الإدارة. بخطوات واضحة."
              description="ابدأ بتجهيز نشاطك، ثم انتقل إلى إدارة تفاصيله اليومية من خلال مساحة عمل واحدة."
            />
            <Link
              href="/auth/signup"
              className="mt-8 inline-flex items-center gap-3 border-b border-[#398064] pb-2 text-sm font-bold text-[#286044] transition hover:gap-5"
            >
              ابدأ إعداد حسابك
              <ArrowLeft size={17} />
            </Link>
          </div>

          <div className="border-t border-[#DDE5DC]">
            {workflow.map((item) => (
              <div
                key={item.number}
                className="grid grid-cols-[65px_1fr] gap-5 border-b border-[#DDE5DC] py-8 md:grid-cols-[90px_1fr]"
              >
                <span className="pt-1 text-2xl font-black text-[#9BB5A0]">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-[#243A2D]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-8 text-[#7B867D]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#174D3A]">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 px-5 py-16 md:flex-row md:items-center md:px-8 md:py-20">
          <div>
            <span className="text-xs font-bold text-[#B6D9C1]">
              ابدأ مع Sougify
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-black leading-relaxed text-white md:text-4xl">
              نظّم تجارتك. وامنح عملك مساحة للنمو.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-8 text-[#D0E1D4]">
              أنشئ حسابك وابدأ بإعداد مساحة العمل الخاصة بنشاطك التجاري.
            </p>
          </div>

          <Link
            href="/auth/signup"
            className="flex shrink-0 items-center gap-4 rounded-lg bg-white px-7 py-4 text-sm font-extrabold text-[#174D3A] transition hover:bg-[#EEF4EF]"
          >
            ابدأ الآن
            <ArrowLeft size={18} />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-[1240px] px-5 py-24 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionTitle
            label="معلومات مهمة"
            title="أسئلة قد تدور في ذهنك."
            description="إجابات مختصرة تساعدك على التعرف على فكرة المنصة وطريقة استخدامها."
          />

          <div className="border-t border-[#E5EAE3]">
            {[
              {
                q: "ما هو Sougify؟",
                a: "Sougify منصة لإدارة الأنشطة التجارية تجمع أدوات إدارة المنتجات والطلبات والمخزون والتوصيل ضمن مساحة عمل واحدة.",
              },
              {
                q: "من يمكنه استخدام المنصة؟",
                a: "يمكن أن تناسب المنصة أصحاب المتاجر والأنشطة التجارية التي تحتاج إلى تنظيم عمليات البيع وإدارة الطلبات والمخزون.",
              },
              {
                q: "هل يمكنني إدارة طلبات الدفع عند الاستلام؟",
                a: "تتضمن رؤية المنصة تنظيم الطلبات ومتابعة مبالغ الدفع عند الاستلام وحالات التحصيل والتسليم.",
              },
              {
                q: "كيف أبدأ باستخدام Sougify؟",
                a: "ابدأ بإنشاء حساب، ثم اختر نوع نشاطك التجاري واتبع خطوات إعداد مساحة العمل.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group border-b border-[#E5EAE3] py-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold text-[#293D30]">
                  {item.q}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-[#398064] transition group-open:rotate-180"
                  />
                </summary>
                <p className="mt-5 max-w-2xl text-[13px] leading-8 text-[#7B867D]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5EAE3] bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-12 md:px-8">
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <div className="max-w-sm">
              <Brand />
              <p className="mt-5 text-sm leading-8 text-[#879187]">
                مساحة عمل موحدة لإدارة تجارتك وتنظيم عملياتك اليومية
                بصورة أكثر وضوحاً.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 text-sm">
              <div>
                <h3 className="font-extrabold text-[#263B2E]">
                  استكشف
                </h3>
                <div className="mt-5 flex flex-col gap-4 text-[#79847B]">
                  <Link href="#features" className="hover:text-[#398064]">
                    المميزات
                  </Link>
                  <Link href="#platform" className="hover:text-[#398064]">
                    المنصة
                  </Link>
                  <Link href="#how" className="hover:text-[#398064]">
                    طريقة العمل
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-[#263B2E]">
                  حسابك
                </h3>
                <div className="mt-5 flex flex-col gap-4 text-[#79847B]">
                  <Link href="/auth/login" className="hover:text-[#398064]">
                    تسجيل الدخول
                  </Link>
                  <Link href="/auth/signup" className="hover:text-[#398064]">
                    إنشاء حساب
                  </Link>
                  <Link href="#faq" className="hover:text-[#398064]">
                    الأسئلة الشائعة
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-[#E9EDE8] pt-7 text-xs text-[#9AA39B] sm:flex-row">
            <p>
              © {new Date().getFullYear()} Sougify. جميع الحقوق محفوظة.
            </p>
            <p>إدارة أفضل. رؤية أوضح.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
