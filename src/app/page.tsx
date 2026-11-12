import Link from "next/link";
import { ArrowRight, Store, Zap, ShieldCheck, TrendingUp, Package, Truck, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              S
            </div>
            <span className="text-2xl font-black tracking-tight text-white">Sougify</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">المميزات</a>
            <a href="#solutions" className="hover:text-emerald-400 transition-colors">الحلول</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">الأسعار</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group"
            >
              ابدأ مجاناً
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-8">
            <Zap className="w-3.5 h-3.5" /> المنصة المتكاملة للتجارة والبيع بالتجزئة
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-8">
            أدر متجرك، مبيعاتك، وتوصيلك <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              من منصة واحدة وبكل احترافية
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Sougify يمنحك القوة لإدارة المتجر الإلكتروني، نقاط البيع (POS)، تتبع المخزون، وشحنات الدفع عند الاستلام بسلاسة تامة.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/auth/signup" 
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 text-base group"
            >
              أنشئ متجرك الآن مجاناً
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/admin" 
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-base"
            >
              لوحة التحكم
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              كل ما تحتاجه لتنمية نشاطك التجاري
            </h2>
            <p className="text-slate-400">أدوات متطورة صُممت خصيصاً لتسهيل عمليات البيع والتحكم بالمخزون بدقة.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-3xl hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">متجر إلكتروني متكامل</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                اعرض منتجاتك، نظم الأقسام، وخصص تصميم متجرك لعرض السلع بأفضل شكل ممكن لجذب الزبائن.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-3xl hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">نقطة بيع POS سريعة</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                إدارة مبيعات المحلات الفعلية، تسجيل المبيعات النقدية والدفع الإلكتروني بكل سهولة وربطها بالمخزون المباشر.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-3xl hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">إدارة التوصيل والشحن</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                تتبع مناطق التوصيل، المناديل، وتتبع مبالغ الدفع عند الاستلام (COD) وحساب أرباحك بدقة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Sougify. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
