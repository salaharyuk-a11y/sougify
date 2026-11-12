"use client";

import Link from "next/link";
import {
  ArrowLeft, ArrowUpLeft, BarChart3, Bell, Boxes, Check, ChevronDown,
  ClipboardList, Globe2, LayoutDashboard, Menu, Package, Search, Settings2,
  ShieldCheck, ShoppingBag, Sparkles, Truck, Wallet, X,
} from "lucide-react";
import { useState } from "react";

const features = [
  { icon: ShoppingBag, no: "01", title: "متجرك في الواجهة", desc: "اعرض منتجاتك بطريقة مرتبة واجعل تجربة الشراء واضحة من أول زيارة." },
  { icon: ClipboardList, no: "02", title: "الطلبات تحت السيطرة", desc: "تابع الطلبات وحالاتها من الاستقبال إلى التجهيز والتسليم." },
  { icon: Boxes, no: "03", title: "مخزون أكثر تنظيماً", desc: "راقب الكميات المتاحة وتعرّف على المنتجات التي تحتاج إلى متابعة." },
  { icon: Truck, no: "04", title: "متابعة التوصيل", desc: "اجمع تفاصيل الشحن والطلبات المرسلة في مساحة واحدة." },
  { icon: Wallet, no: "05", title: "الدفع عند الاستلام", desc: "نظّم مبالغ الطلبات وسجّل حالة التحصيل بوضوح." },
  { icon: BarChart3, no: "06", title: "قراءة أداء نشاطك", desc: "شاهد مؤشرات نشاطك التجاري واتخذ قرارات مبنية على بياناتك." },
];

const steps = [
  ["01", "جهّز مساحة عملك", "أنشئ حسابك وأضف المعلومات الأساسية لنشاطك التجاري."],
  ["02", "أضف منتجاتك", "رتّب المنتجات والأسعار والمخزون في مكان واحد."],
  ["03", "تابع عملياتك", "استقبل الطلبات وراقب مراحل معالجتها من لوحة التحكم."],
];

const orders = [
  { id: "#SO-1048", customer: "محمد ب.", item: "سماعات لاسلكية", amount: "4,500 دج", status: "طلب جديد", tone: "green" },
  { id: "#SO-1047", customer: "سارة ك.", item: "حقيبة يومية", amount: "3,200 دج", status: "قيد التجهيز", tone: "amber" },
  { id: "#SO-1046", customer: "ياسين م.", item: "مصباح مكتبي", amount: "2,800 دج", status: "تم التأكيد", tone: "blue" },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="Sougify الصفحة الرئيسية" className="inline-flex items-center gap-2.5">
      <span className={`grid h-10 w-10 place-items-center rounded-[13px] ${light ? "bg-white text-[#164C38]" : "bg-[#174D3A] text-white"}`}>
        <ShoppingBag size={19} strokeWidth={2.3} />
      </span>
      <span className={`text-[23px] font-extrabold tracking-[-1.1px] ${light ? "text-white" : "text-[#172D25]"}`}>
        Sougi<span className={light ? "text-[#B9DCC5]" : "text-[#398064]"}>fy</span>
      </span>
    </Link>
  );
}

function DashboardVisual() {
  return (
    <div className="sougify-visual relative mx-auto w-full max-w-[760px]" dir="rtl">
      <div className="absolute -inset-8 rounded-[50%] bg-[#B9D8C1]/35 blur-[75px]" />
      <div className="sougify-dashboard relative overflow-hidden rounded-[23px] border border-[#E4EAE3] bg-white shadow-[0_35px_100px_-35px_rgba(17,55,37,.34)]">
        <div className="flex h-12 items-center justify-between border-b border-[#EEF1ED] bg-[#FBFCFA] px-4">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#E7B7AC]" /><span className="h-2.5 w-2.5 rounded-full bg-[#E9D49A]" /><span className="h-2.5 w-2.5 rounded-full bg-[#B9D1B9]" /></div>
          <div className="flex items-center gap-2 rounded-md border border-[#E9EDE8] bg-white px-3 py-1 text-[9px] text-[#7B897E]"><ShieldCheck size={11} /> app.sougify.com</div>
          <span className="text-[9px] font-semibold text-[#87948A]">معاينة المنصة</span>
        </div>
        <div className="grid min-h-[430px] grid-cols-[minmax(0,1fr)_148px] sm:grid-cols-[minmax(0,1fr)_182px]" dir="ltr">
          <div className="min-w-0 p-4 sm:p-6" dir="rtl">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-[9px] text-[#98A39A]">مساحة العمل / الرئيسية</p><h3 className="mt-1.5 text-[18px] font-extrabold text-[#1D3528]">صباح الخير 👋</h3><p className="mt-1 text-[10px] text-[#87938A]">إليك ملخص نشاط متجرك اليوم</p></div>
              <button className="relative rounded-xl border border-[#E9EEE8] p-2 text-[#6F7F73]" aria-label="الإشعارات"><Bell size={15}/><i className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E18B63]"/></button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {[["إجمالي الطلبات","248","+12.8%"],["قيمة المبيعات","186,400","دج"],["منتجات نشطة","64","منتج"]].map(([label,value,sub],i)=><div key={label} className="rounded-[13px] border border-[#E9EEE8] bg-[#FEFFFE] p-2.5 sm:p-3.5"><span className="text-[8px] text-[#89958B] sm:text-[9px]">{label}</span><div className="mt-2 flex flex-wrap items-baseline gap-1"><b className="text-[15px] font-extrabold tracking-tight text-[#20392B] sm:text-[20px]">{value}</b><small className={i===0?"text-[8px] font-bold text-[#398064]":"text-[8px] text-[#A0AAA1]"}>{sub}</small></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-[#EDF2ED]"><div className="h-full rounded-full bg-[#70A887]" style={{width: i===0?"76%":i===1?"61%":"84%"}}/></div></div>)}
            </div>
            <div className="mt-3.5 rounded-[14px] border border-[#E9EEE8] p-3.5 sm:p-4">
              <div className="flex items-center justify-between"><div><b className="text-[10px] text-[#2B4032] sm:text-[11px]">نظرة على المبيعات</b><p className="mt-1 text-[8px] text-[#9AA49B]">الأداء خلال آخر 7 أيام</p></div><span className="rounded-md bg-[#F1F5F0] px-2 py-1 text-[8px] text-[#718174]">هذا الأسبوع⌄</span></div>
              <div className="relative mt-4 flex h-[105px] items-end gap-2 border-b border-[#EEF1ED] px-1">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-1"><i className="border-t border-dashed border-[#EEF1ED]"/><i className="border-t border-dashed border-[#EEF1ED]"/><i className="border-t border-dashed border-[#EEF1ED]"/></div>
                {[38,57,43,75,61,88,69].map((h,i)=><div key={i} className="relative z-10 flex-1 rounded-t-[5px] bg-[#BBD8C4] transition-all duration-700 hover:bg-[#398064]" style={{height:`${h}%`,animation:`bar-rise .8s ease-out ${i*.08}s both`}}>{i===5&&<span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#174D3A] px-1.5 py-1 text-[7px] text-white">32.4k</span>}</div>)}
              </div>
              <div className="mt-2 flex justify-between text-[8px] text-[#A0AAA2]"><span>السبت</span><span>الأحد</span><span>الإثنين</span><span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span><span>الجمعة</span></div>
            </div>
            <div className="mt-3.5 overflow-hidden rounded-[14px] border border-[#E9EEE8]">
              <div className="flex items-center justify-between px-3.5 py-3"><b className="text-[10px] text-[#2B4032]">آخر الطلبات</b><span className="text-[8px] font-bold text-[#398064]">عرض الكل ←</span></div>
              {orders.map((o,i)=><div key={o.id} className="grid grid-cols-[1fr_auto] items-center gap-2 border-t border-[#F0F2EF] px-3.5 py-2.5" style={{animation:`fade-up .5s ease-out ${i*.12}s both`}}><div><b className="block text-[8px] text-[#435448]">{o.id} <span className="font-normal text-[#A0AAA2]">· {o.customer}</span></b><span className="mt-1 block text-[8px] text-[#98A198]">{o.item}</span></div><div className="text-left"><b className="block text-[8px] text-[#394B3D]">{o.amount}</b><span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[7px] ${o.tone==="green"?"bg-[#EAF4EC] text-[#34734C]":o.tone==="amber"?"bg-[#FBF2E2] text-[#A9782E]":"bg-[#EAF1F8] text-[#54799D]"}`}>{o.status}</span></div></div>)}
            </div>
          </div>
          <aside className="border-r border-[#E9EEE8] bg-[#FAFCF9] p-3 sm:p-4" dir="rtl">
            <div className="mb-7 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#174D3A] text-white"><ShoppingBag size={13}/></span><b className="text-[11px] text-[#233B2D]">Sougify</b></div>
            <p className="mb-2 px-2 text-[8px] font-bold text-[#A0AAA1]">القائمة الرئيسية</p>
            {[
              { icon: LayoutDashboard, label: "لوحة التحكم", active: true },
              { icon: ClipboardList, label: "الطلبات", active: false },
              { icon: Package, label: "المنتجات", active: false },
              { icon: Boxes, label: "المخزون", active: false },
              { icon: Truck, label: "التوصيل", active: false },
              { icon: BarChart3, label: "التقارير", active: false },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label} className={`mb-1 flex items-center gap-2 rounded-lg px-2 py-2.5 text-[8px] font-semibold sm:text-[9px] ${active ? "bg-[#EAF2EB] text-[#225A3F]" : "text-[#839087]"}`}>
                <Icon size={13} />
                {label}
              </div>
            ))}
            <div className="mt-8 border-t border-[#E9EEE8] pt-4"><p className="mb-3 text-[8px] font-bold text-[#A0AAA1]">المتجر</p><div className="flex items-center gap-2 text-[8px] text-[#839087]"><Globe2 size={12}/> إعدادات المتجر</div></div>
            <div className="mt-16 rounded-xl bg-[#174D3A] p-3 text-white"><Sparkles size={15}/><p className="mt-3 text-[9px] font-bold">مساحة واحدة</p><p className="mt-1 text-[8px] leading-5 text-[#D2E5D8]">لتفاصيل تجارتك اليومية</p></div>
          </aside>
        </div>
        <div className="border-t border-[#EEF1ED] bg-[#FBFCFA] px-4 py-2 text-center text-[8px] text-[#9AA49B]">واجهة تجريبية توضيحية — الأرقام والطلبات ليست بيانات حقيقية</div>
      </div>
      <div className="sougify-float-card absolute -right-4 top-[18%] hidden items-center gap-3 rounded-2xl border border-[#E7ECE6] bg-white p-3.5 shadow-[0_18px_50px_-20px_rgba(17,55,37,.25)] sm:flex">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#EAF4EC] text-[#398064]"><Package size={17}/></span><span><b className="block text-[10px] text-[#294332]">طلب جديد وصل</b><small className="mt-1 block text-[8px] text-[#89958B]">تمت إضافة طلب للمتجر</small></span><span className="h-2 w-2 rounded-full bg-[#56A276]"/>
      </div>
      <div className="sougify-float-card-two absolute -bottom-5 -left-4 hidden rounded-2xl border border-[#E7ECE6] bg-white px-4 py-3 shadow-[0_18px_50px_-20px_rgba(17,55,37,.25)] sm:block"><p className="text-[8px] text-[#929D94]">إدارة من مكان واحد</p><div className="mt-1 flex items-center gap-2"><span className="text-[17px] font-black text-[#1D4E37]">Sougify</span><span className="rounded-full bg-[#EDF5EE] px-2 py-1 text-[8px] text-[#398064]">منظّم</span></div></div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#FBFCF9] text-[#172D25]">
      <style jsx global>{`
        @keyframes float-card { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float-card-reverse { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(9px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bar-rise { from{height:0;opacity:.4} to{opacity:1} }
        @keyframes soft-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(91,157,112,.2)} 50%{box-shadow:0 0 0 9px rgba(91,157,112,0)} }
        .sougify-float-card{animation:float-card 5s ease-in-out infinite}
        .sougify-float-card-two{animation:float-card-reverse 6s ease-in-out infinite}
        .sougify-dashboard{animation:fade-up .75s ease-out both}
        .sougify-visual:after{content:"";position:absolute;z-index:-1;inset:12% 8%;border-radius:50%;background:#DDECE0;filter:blur(55px)}
        @media(prefers-reduced-motion:reduce){.sougify-float-card,.sougify-float-card-two,.sougify-dashboard{animation:none!important}*{scroll-behavior:auto!important;transition:none!important}}
      `}</style>
      <header className="sticky top-0 z-50 border-b border-[#E9EDE7] bg-[#FBFCF9]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 md:px-9">
          <Brand/>
          <nav className="hidden items-center gap-9 text-[13px] font-semibold text-[#68766C] md:flex"><a href="#platform" className="transition hover:text-[#174D3A]">المنصة</a><a href="#features" className="transition hover:text-[#174D3A]">المميزات</a><a href="#how" className="transition hover:text-[#174D3A]">كيف تعمل</a><a href="#faq" className="transition hover:text-[#174D3A]">الأسئلة الشائعة</a></nav>
          <div className="hidden items-center gap-5 sm:flex"><Link href="/login" className="text-[13px] font-bold text-[#526358] transition hover:text-[#174D3A]">تسجيل الدخول</Link><Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#174D3A] px-5 py-3 text-[12px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#236348]">ابدأ الآن <ArrowUpLeft size={15}/></Link></div>
          <button onClick={()=>setMenuOpen(v=>!v)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#E5EAE3] text-[#294332] sm:hidden" aria-label={menuOpen?"إغلاق القائمة":"فتح القائمة"}>{menuOpen?<X size={19}/>:<Menu size={19}/>}</button>
        </div>
        {menuOpen&&<nav className="border-t border-[#E9EDE7] bg-[#FBFCF9] px-5 py-4 sm:hidden"><div className="flex flex-col gap-4 text-sm font-semibold text-[#526358]"><a onClick={()=>setMenuOpen(false)} href="#platform">المنصة</a><a onClick={()=>setMenuOpen(false)} href="#features">المميزات</a><a onClick={()=>setMenuOpen(false)} href="#how">كيف تعمل</a><a onClick={()=>setMenuOpen(false)} href="#faq">الأسئلة الشائعة</a><Link href="/login">تسجيل الدخول</Link><Link href="/signup" className="rounded-lg bg-[#174D3A] px-4 py-3 text-center text-white">إنشاء حساب</Link></div></nav>}
      </header>

      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-[-120px] -z-10 h-[520px] w-[520px] rounded-full bg-[#E5F0E7] blur-[100px]"/>
        <div className="mx-auto grid max-w-[1320px] items-center gap-14 px-5 pb-20 pt-16 md:px-9 md:pb-28 md:pt-24 lg:grid-cols-[.86fr_1.14fr] lg:gap-12">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#DCE9DE] bg-white/80 px-3.5 py-2 text-[11px] font-bold text-[#397453]"><span className="h-2 w-2 rounded-full bg-[#5C9B72] shadow-[0_0_0_4px_#E7F2E9]"/> مساحة عمل للتجارة الإلكترونية</div>
            <h1 className="max-w-[620px] text-[42px] font-black leading-[1.35] tracking-[-1.7px] text-[#172D25] sm:text-5xl lg:text-[65px]">تجارتك تستحق<br/><span className="relative inline-block text-[#398064]">إدارة أذكى<span className="absolute -bottom-1 right-0 h-[5px] w-[72%] rounded-full bg-[#D4E7D8]"/></span></h1>
            <p className="mt-7 max-w-[520px] text-[14px] leading-[2.15] text-[#6F7D72] sm:text-[16px]">من عرض المنتجات إلى متابعة الطلبات والمخزون والتوصيل. اجمع تفاصيل عملك في مساحة واحدة، وخلّي يومك التجاري أكثر وضوحاً وتنظيماً.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3"><Link href="/signup" className="group inline-flex items-center gap-5 rounded-xl bg-[#174D3A] px-6 py-4 text-[13px] font-bold text-white shadow-[0_12px_30px_-14px_rgba(23,77,58,.65)] transition hover:-translate-y-1 hover:bg-[#236348]">أنشئ متجرك الآن <ArrowLeft size={17} className="transition group-hover:-translate-x-1"/></Link><a href="#platform" className="inline-flex items-center gap-2 rounded-xl px-5 py-4 text-[13px] font-bold text-[#526358] transition hover:bg-white">اكتشف المنصة <ArrowUpLeft size={16}/></a></div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#E7ECE5] pt-6 text-[11px] font-medium text-[#7B887E]"><span className="flex items-center gap-2"><Check size={14} className="text-[#398064]"/> واجهة عربية</span><span className="flex items-center gap-2"><Check size={14} className="text-[#398064]"/> تنظيم من مكان واحد</span><span className="flex items-center gap-2"><Check size={14} className="text-[#398064]"/> تجربة بسيطة</span></div>
          </div>
          <div id="platform" className="relative py-4 sm:px-3"><DashboardVisual/></div>
        </div>
        <div className="border-y border-[#E9EDE7] bg-white/70"><div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-center gap-x-12 gap-y-4 px-5 py-5 text-[11px] font-semibold text-[#87938A] md:justify-between md:px-9"><span>كل ما تحتاجه لإدارة متجرك</span><span className="flex items-center gap-2"><ShoppingBag size={15} className="text-[#6C9A78]"/> المنتجات</span><span className="flex items-center gap-2"><ClipboardList size={15} className="text-[#6C9A78]"/> الطلبات</span><span className="flex items-center gap-2"><Boxes size={15} className="text-[#6C9A78]"/> المخزون</span><span className="flex items-center gap-2"><Truck size={15} className="text-[#6C9A78]"/> التوصيل</span><span className="flex items-center gap-2"><BarChart3 size={15} className="text-[#6C9A78]"/> التقارير</span></div></div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-24 md:px-9 md:py-32">
        <div className="grid gap-10 md:grid-cols-[1fr_.75fr] md:items-end"><div><span className="text-[11px] font-extrabold tracking-[.15em] text-[#398064]">مساحة واحدة. رؤية أوضح.</span><h2 className="mt-5 max-w-[660px] text-3xl font-black leading-[1.5] tracking-tight text-[#1B3326] md:text-[43px]">بدل ما تتشتت بين الأدوات،<br/>خلّي عملياتك في مكان واحد.</h2></div><p className="max-w-[440px] text-[13px] leading-8 text-[#78847A]">إدارة التجارة اليومية فيها تفاصيل كثيرة. Sougify يساعدك على ترتيب هذه التفاصيل ومتابعة ما يحدث في نشاطك دون الحاجة إلى التنقل بين شاشات وأدوات متفرقة.</p></div>
      </section>

      <section id="features" className="border-y border-[#E8EDE6] bg-white">
        <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-9 md:py-28">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><span className="text-[11px] font-extrabold tracking-[.15em] text-[#398064]">إمكانيات المنصة</span><h2 className="mt-4 text-3xl font-black tracking-tight text-[#1B3326] md:text-[42px]">كل جزء من تجارتك،<br className="hidden sm:block"/> في مكانه الصحيح.</h2></div><p className="max-w-sm text-[13px] leading-8 text-[#7C887E]">أدوات عملية تساعدك على تنظيم دورة العمل اليومية من أول منتج إلى آخر طلب.</p></div>
          <div className="grid border-l border-t border-[#E9EDE8] sm:grid-cols-2 lg:grid-cols-3">{features.map(({icon:Icon,no,title,desc})=><article key={no} className="group min-h-[250px] border-b border-r border-[#E9EDE8] p-7 transition duration-300 hover:bg-[#F8FBF7] md:p-9"><div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-[15px] bg-[#EDF4EE] text-[#398064] transition duration-300 group-hover:-translate-y-1 group-hover:bg-[#174D3A] group-hover:text-white"><Icon size={21}/></span><span className="text-[11px] font-bold text-[#B5BEB5]">{no}</span></div><h3 className="mt-8 text-[17px] font-extrabold text-[#263D2E]">{title}</h3><p className="mt-3 max-w-[330px] text-[12px] leading-8 text-[#7C887E]">{desc}</p></article>)}</div>
        </div>
      </section>

      <section id="how" className="relative overflow-hidden bg-[#F2F6F0]">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-white blur-[90px]"/>
        <div className="relative mx-auto grid max-w-[1320px] gap-14 px-5 py-24 md:px-9 md:py-28 lg:grid-cols-[.8fr_1.2fr]"><div><span className="text-[11px] font-extrabold tracking-[.15em] text-[#398064]">بداية سهلة</span><h2 className="mt-5 max-w-md text-3xl font-black leading-[1.5] tracking-tight text-[#1B3326] md:text-[43px]">ابدأ بخطوات بسيطة.<br/>وتابع كل شيء بوضوح.</h2><p className="mt-5 max-w-md text-[13px] leading-8 text-[#78847A]">لا تحتاج إلى تعقيد الأمور. جهّز متجرك ونظّم منتجاتك ثم تابع سير العمل من لوحة واحدة.</p><Link href="/signup" className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#174D3A] px-5 py-3.5 text-[12px] font-bold text-white transition hover:bg-[#236348]">ابدأ إعداد حسابك <ArrowLeft size={16}/></Link></div><div className="border-t border-[#DCE5DA]">{steps.map(([n,t,d])=><div key={n} className="grid grid-cols-[60px_1fr] gap-5 border-b border-[#DCE5DA] py-8 md:grid-cols-[86px_1fr]"><span className="pt-1 text-[25px] font-black text-[#9BB7A0]">{n}</span><div><h3 className="text-[17px] font-extrabold text-[#263D2E]">{t}</h3><p className="mt-2 max-w-lg text-[12px] leading-8 text-[#78847A]">{d}</p></div></div>)}</div></div>
      </section>

      <section className="bg-[#174D3A]"><div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 px-5 py-16 md:flex-row md:items-center md:px-9 md:py-20"><div><span className="text-[11px] font-bold tracking-[.14em] text-[#B9D9C1]">وقتك لإدارة تجارتك</span><h2 className="mt-4 max-w-2xl text-3xl font-black leading-[1.5] text-white md:text-[40px]">رتّب عملياتك. وركّز على نمو عملك.</h2><p className="mt-3 text-[13px] leading-8 text-[#D0E1D4]">ابدأ ببناء مساحة عمل تناسب نشاطك التجاري.</p></div><Link href="/signup" className="inline-flex shrink-0 items-center justify-center gap-4 rounded-xl bg-white px-7 py-4 text-[13px] font-extrabold text-[#174D3A] transition hover:-translate-y-1 hover:bg-[#EEF5EF]">أنشئ حسابك الآن <ArrowLeft size={17}/></Link></div></section>

      <section id="faq" className="mx-auto max-w-[1320px] px-5 py-24 md:px-9 md:py-28"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><span className="text-[11px] font-extrabold tracking-[.15em] text-[#398064]">أسئلة شائعة</span><h2 className="mt-4 text-3xl font-black leading-[1.5] text-[#1B3326] md:text-[40px]">قبل أن تبدأ.</h2><p className="mt-4 max-w-sm text-[13px] leading-8 text-[#78847A]">بعض الإجابات التي تساعدك على فهم فكرة Sougify.</p></div><div className="border-t border-[#E5EAE3]">{[["ما هو Sougify؟","Sougify منصة لإدارة التجارة الإلكترونية تهدف إلى جمع تفاصيل المنتجات والطلبات والمخزون والتوصيل ضمن مساحة عمل موحدة."],["لمن صُممت المنصة؟","لأصحاب المتاجر والأنشطة التجارية الذين يريدون تنظيماً أوضح لعمليات البيع ومتابعة الطلبات."],["هل يمكنني استخدام المنصة باللغة العربية؟","هذه الصفحة التعريفية مصممة باللغة العربية. وتختلف اللغات المتاحة داخل وظائف المنصة بحسب ما هو مفعّل في حسابك."],["كيف أبدأ؟","يمكنك إنشاء حساب من زر ابدأ الآن، ثم متابعة خطوات إعداد مساحة العمل المتاحة داخل المنصة."]].map(([q,a])=><details key={q} className="group border-b border-[#E5EAE3] py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-[13px] font-bold text-[#293E31]">{q}<ChevronDown size={17} className="shrink-0 text-[#398064] transition group-open:rotate-180"/></summary><p className="mt-4 max-w-2xl text-[12px] leading-8 text-[#7B877D]">{a}</p></details>)}</div></div></section>

      <footer className="border-t border-[#E7ECE5] bg-white"><div className="mx-auto max-w-[1320px] px-5 py-12 md:px-9"><div className="flex flex-col justify-between gap-9 md:flex-row"><div className="max-w-sm"><Brand/><p className="mt-5 text-[12px] leading-8 text-[#849087]">مساحة عمل تساعدك على تنظيم تجارتك ومتابعة عملياتك اليومية بوضوح.</p></div><div className="flex flex-wrap gap-x-12 gap-y-7 text-[12px]"><div className="flex flex-col gap-4"><b className="text-[#263D2E]">استكشف</b><a href="#features" className="text-[#7B877D] hover:text-[#398064]">المميزات</a><a href="#how" className="text-[#7B877D] hover:text-[#398064]">كيف تعمل</a><a href="#faq" className="text-[#7B877D] hover:text-[#398064]">الأسئلة الشائعة</a></div><div className="flex flex-col gap-4"><b className="text-[#263D2E]">حسابك</b><Link href="/login" className="text-[#7B877D] hover:text-[#398064]">تسجيل الدخول</Link><Link href="/signup" className="text-[#7B877D] hover:text-[#398064]">إنشاء حساب</Link></div></div></div><div className="mt-10 flex flex-col justify-between gap-3 border-t border-[#E9EDE8] pt-6 text-[10px] text-[#9AA39B] sm:flex-row"><p>© {new Date().getFullYear()} Sougify. جميع الحقوق محفوظة.</p><p>تجارة أكثر تنظيماً. رؤية أوضح.</p></div></div></footer>
    </main>
  );
}
