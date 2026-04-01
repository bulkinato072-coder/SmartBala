import { motion } from "motion/react";
import { Award, BookOpen, Star, Heart, ShieldCheck, Target, TrendingUp, Users, Smartphone, CheckCircle2 } from "lucide-react";

export default function HomeSection() {
  return (
    <div className="space-y-12 md:space-y-8 pb-32 md:pb-12 h-full">
      {/* Author Card */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 rounded-[40px] bg-white p-6 md:p-8 relative overflow-hidden shadow-xl shadow-brand-olive/5 border border-slate-100">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          
          {/* Author Photo */}
          <div className="relative shrink-0">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-brand-cream shadow-lg relative z-10">
              <img 
                src="/author.jpeg" 
                alt="Садрадинова Майра Садрадинқызы" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Майра+Садрадинова&background=5A5A40&color=fff&size=200";
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center shadow-lg z-20 animate-bounce-slow">
              <Star className="text-white" size={24} fill="currentColor" />
            </div>
          </div>

          {/* Author Info */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div>
              <h3 className="text-2xl font-serif font-bold text-brand-olive mb-1">
                САДРАДИНОВА МАЙРА САДРАДИНҚЫЗЫ
              </h3>
              <p className="text-sm font-bold text-brand-accent uppercase tracking-widest">
                ПЕДАГОГ-САРАПШЫ
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-brand-olive/10 flex items-center justify-center shrink-0 mt-1">
                  <BookOpen size={16} className="text-brand-olive" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  ҚЫЗЫЛОРДА ОБЛЫСЫНЫҢ БІЛІМ БАСҚАРМАСЫНЫҢ "ҚАЗАЛЫ АУДАНЫНЫҢ ПСИХОЛОГИЯЛЫҚ -ПЕДАГОГИКАЛЫҚ ТҮЗЕТУ КАБИНЕТІ" КММ, ПЕДАГОГ - ПСИХОЛОГ МАМАНЫ.
                </p>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-brand-olive/10 flex items-center justify-center shrink-0 mt-1">
                  <ShieldCheck size={16} className="text-brand-olive" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Балалардың психологиялық және педагогикалық дамуына бағытталған көп жылдық тәжірибесі бар білікті маман.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Header & Concept */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="px-2 space-y-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-brand-olive mb-4 tracking-tight">
              Smart Bala Autism
            </h2>
            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
              Аутизм спектрі бар балаларға арналған инклюзивті цифрлық қолдау жүйесі.
            </p>
          </div>
          
          <div className="p-6 md:p-8 rounded-3xl bg-brand-olive/5 border border-brand-olive/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-olive/10 rounded-bl-full -mr-4 -mt-4" />
            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium relative z-10">
              <span className="font-black text-brand-olive text-xl">Smart Bala Autism</span> - бұл тек даму қосымшасы емес. Бұл баланы түсінуге арналған жүйе. Бұл - ата-анаға сенімді серіктес, баланың кішкентай қадамдарын үлкен нәтижеге айналдыратын ақылды және бағыттаушы жүйе.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 p-8 md:p-10 rounded-[40px] bg-brand-olive text-white space-y-6 relative overflow-hidden shadow-2xl shadow-brand-olive/30">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner">
              <Target className="text-white" size={32} />
            </div>
            <h4 className="font-black text-white text-4xl md:text-5xl mb-6 tracking-tight uppercase">Миссиясы</h4>
            <p className="text-xl md:text-2xl text-white/95 leading-relaxed font-medium">
              Әрбір ерекше баланың әлеуетін ашу арқылы ата-ана мен бала арасындағы байланысты күшейтіп, даму жолын қарапайым, түсінікті және қолжетімді ету.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 space-y-8">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-brand-olive px-2 tracking-tighter uppercase">
            Құндылықтары
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              { title: "Қамқорлық", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
              { title: "Даму және түзету", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Нақты прогресс", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
              { title: "Қолдау", icon: Users, color: "text-purple-500", bg: "bg-purple-50" }
            ].map((v, i) => (
              <div key={i} className="p-6 md:p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-lg transition-all">
                <div className={`w-16 h-16 shrink-0 rounded-2xl ${v.bg} flex items-center justify-center shadow-inner`}>
                  <v.icon size={32} className={v.color} />
                </div>
                <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{v.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform & Sections */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 p-6 md:p-8 rounded-[32px] bg-brand-cream border border-slate-100 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <Smartphone className="text-brand-accent" size={24} />
          </div>
          <h4 className="font-serif font-black text-brand-olive text-2xl md:text-3xl">Платформа және бөлімдер:</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h5 className="font-black text-brand-olive text-lg md:text-xl uppercase tracking-wider">Негізгі функциялар:</h5>
            {[
              "Аутизм спектрі бар балаларға бейімделген тапсырмалар",
              "30 күндік даму сценарийлері",
              "Мінез-аударма жүйесі",
              "SOS жедел көмек жүйесі",
              "Ата-анаға психологиялық қолдау",
              "Прогресс бақылау макеті"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-olive/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={12} className="text-brand-olive" />
                </div>
                <span className="text-sm font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h5 className="font-black text-brand-olive text-lg md:text-xl uppercase tracking-wider">Дамыту жаттығулары:</h5>
            {[
              "Үйде орындалатын дамыту жаттығулары",
              "Сенсорлық интеграция",
              "Коммуникацияны дамыту",
              "Әлеуметтік дағдылар",
              "Өзіне-өзі қызмет көрсету"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={12} className="text-brand-accent" />
                </div>
                <span className="text-sm font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* 30-Day Scenarios */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 p-6 md:p-8 rounded-[32px] bg-white border border-slate-100 space-y-4">
        <h4 className="font-serif font-black text-brand-olive text-2xl md:text-3xl">30 күндік даму сценарийлері</h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          Әр күнге арналған арнайы жоспар баланың жүйелі дамуын қамтамасыз етеді. Тақырыптар келесі бағыттарды қамтиды:
        </p>
        <div className="flex flex-wrap gap-2">
          {["Зейін қою", "Еліктеу дағдылары", "Тілдік қарым-қатынас", "Ойын әрекеті", "Эмоционалды реттеу"].map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-brand-cream text-brand-olive text-xs font-bold rounded-full border border-brand-olive/10">
              {tag}
            </span>
          ))}
        </div>
        </div>
      </section>

      {/* SOS Emergency Help */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 p-6 md:p-8 rounded-[32px] bg-red-50 border border-red-100 space-y-4">
        <div className="flex items-center gap-3 text-red-600">
          <ShieldCheck size={32} />
          <h4 className="font-serif font-black text-2xl md:text-3xl">SOS жедел көмек</h4>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-2xl border border-red-100">
            <h5 className="font-black text-lg text-red-700 mb-1">SOS тізімі:</h5>
            <p className="text-sm text-slate-600">Күрделі мінез-құлық кезіндегі алгоритмдер, қауіпсіздік шаралары және жедел әрекет ету жоспары.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-red-100">
            <h5 className="font-black text-lg text-red-700 mb-1">SOS қорытынды:</h5>
            <p className="text-sm text-slate-600">Оқиғадан кейінгі талдау, баланың күйін тұрақтандыру және болашақта алдын алу шаралары.</p>
          </div>
        </div>
        </div>
      </section>

      {/* Progress & Q&A */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-[32px] bg-white border border-slate-100 space-y-3">
            <h4 className="font-serif font-black text-brand-olive text-2xl md:text-3xl">Прогресс макеті</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Баланың даму динамикасын визуалды түрде бақылауға арналған макет. Әрбір жетістік пен өзгеріс тіркеліп отырады.
            </p>
          </div>
          <div className="p-6 rounded-[32px] bg-white border border-slate-100 space-y-3">
            <h4 className="font-serif font-black text-brand-olive text-2xl md:text-3xl">Сұрақ-жауап</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ата-аналар жиі қоятын сұрақтарға мамандардың жауаптары. Тәжірибелік кеңестер мен нұсқаулықтар жинағы.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
