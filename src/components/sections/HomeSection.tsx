import { motion } from "motion/react";
import { Award, BookOpen, Star, Heart, ShieldCheck, Target, TrendingUp, Users, Smartphone, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { SOS_CONTENT } from "../../constants";

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
                <div className="w-6 h-6 rounded-full bg-brand-olive/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-brand-olive" />
                </div>
                <span className="text-base md:text-lg font-medium text-slate-700">{item}</span>
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
                <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-brand-accent" />
                </div>
                <span className="text-base md:text-lg font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* 30-Day Scenarios */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 p-8 md:p-10 rounded-[40px] bg-white border-2 border-brand-olive/5 shadow-xl space-y-6">
          <h4 className="font-serif font-black text-brand-olive text-3xl md:text-4xl leading-tight">
            30 күндік даму сценарийлері
          </h4>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
            Әр күнге арналған арнайы жоспар баланың жүйелі дамуын қамтамасыз етеді. Тақырыптар келесі бағыттарды қамтиды:
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {[
              "Зейін қою",
              "Еліктеу дағдылары",
              "Тілдік қарым-қатынас",
              "Ойын әрекеті",
              "Эмоционалды реттеу"
            ].map((tag, i) => (
              <span 
                key={i} 
                className="px-6 py-3 bg-brand-cream text-brand-olive text-lg md:text-xl font-black rounded-2xl border-2 border-brand-olive/10 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SOS Situations - Detailed */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 space-y-6">
          <div className="flex items-center gap-4 text-red-600 px-4">
            <AlertCircle size={40} />
            <h4 className="font-serif font-black text-3xl md:text-4xl leading-tight">SOS: Қазір не істеу керек?</h4>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-4 no-scrollbar">
            {SOS_CONTENT.situations.map((situation) => (
              <div 
                key={situation.id} 
                className="snap-center shrink-0 w-[85vw] md:w-[400px] p-8 rounded-[40px] bg-white border-2 border-red-100 shadow-xl flex flex-col gap-6"
              >
                <div className="space-y-2">
                  <span className="text-red-500 font-black text-lg">Жағдай {situation.id}:</span>
                  <h5 className="font-black text-2xl md:text-3xl text-slate-800 leading-tight">
                    {situation.title}
                  </h5>
                </div>
                
                <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100">
                  <p className="text-lg md:text-xl text-slate-700 font-bold italic">
                    "{situation.happening}"
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 size={24} />
                    <span className="font-black text-xl">НЕ ІСТЕУ КЕРЕК:</span>
                  </div>
                  <ul className="space-y-3">
                    {situation.todo.map((item, i) => (
                      <li key={i} className="flex gap-3 text-lg md:text-xl text-slate-600 font-medium leading-tight">
                        <span className="text-green-500 shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {situation.notodo && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 text-red-500">
                      <XCircle size={24} />
                      <span className="font-black text-xl">НЕ ІСТЕУГЕ БОЛМАЙДЫ:</span>
                    </div>
                    <ul className="space-y-3">
                      {situation.notodo.map((item, i) => (
                        <li key={i} className="flex gap-3 text-lg md:text-xl text-slate-600 font-medium leading-tight opacity-80">
                          <span className="text-red-400 shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="px-6 text-center">
            <p className="text-slate-400 font-medium animate-pulse">
              Оңға қарай жылжытыңыз →
            </p>
          </div>
        </div>
      </section>

      {/* SOS Conclusion */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 p-8 md:p-10 rounded-[40px] bg-red-600 border-2 border-red-700 shadow-2xl space-y-8 text-white">
          <div className="flex items-center gap-4">
            <ShieldCheck size={48} />
            <h4 className="font-serif font-black text-3xl md:text-4xl leading-tight">SOS қорытынды</h4>
          </div>
          
          <div className="space-y-6">
            {SOS_CONTENT.conclusion.principles.map((principle, i) => (
              <div key={i} className="flex gap-4 items-start bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20">
                <CheckCircle2 className="shrink-0 mt-1" size={28} />
                <p className="text-xl md:text-2xl font-black leading-tight">
                  {principle}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 bg-white rounded-[32px] shadow-inner">
            <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-black text-center">
              {SOS_CONTENT.conclusion.message}
            </p>
          </div>
        </div>
      </section>

      {/* Progress Tracking */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 p-8 md:p-10 rounded-[40px] bg-white border-2 border-brand-olive/5 shadow-xl space-y-6">
          <h4 className="font-serif font-black text-brand-olive text-3xl md:text-4xl leading-tight">
            Прогресс макеті
          </h4>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
            Баланың даму динамикасын визуалды түрде бақылауға арналған макет. Әрбір жетістік пен өзгеріс тіркеліп отырады.
          </p>
        </div>
      </section>

      {/* Q&A */}
      <section className="snap-start scroll-mt-20 md:scroll-mt-0 min-h-[85vh] md:min-h-0 flex flex-col justify-center">
        <div className="mx-2 p-8 md:p-10 rounded-[40px] bg-white border-2 border-brand-olive/5 shadow-xl space-y-6">
          <h4 className="font-serif font-black text-brand-olive text-3xl md:text-4xl leading-tight">
            Сұрақ-жауап
          </h4>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
            Ата-аналар жиі қоятын сұрақтарға мамандардың жауаптары. Тәжірибелік кеңестер мен нұсқаулықтар жинағы.
          </p>
        </div>
      </section>
    </div>
  );
}
