import { motion } from "motion/react";
import { Award, BookOpen, Star, Heart, ShieldCheck, Target, TrendingUp, Users, Smartphone, CheckCircle2 } from "lucide-react";

export default function HomeSection() {
  return (
    <div className="space-y-8 pb-32">
      {/* Author Card */}
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

      {/* Header & Concept */}
      <div className="px-2 space-y-4">
        <div>
          <h2 className="text-4xl font-serif font-bold text-brand-olive mb-2">
            Smart Bala Autism
          </h2>
          <p className="text-base text-slate-600 font-medium leading-relaxed">
            Аутизмі бар балаларға арналған инклюзивті цифрлық қолдау жүйесі.
          </p>
        </div>
        
        <div className="p-5 rounded-3xl bg-brand-olive/5 border border-brand-olive/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-olive/10 rounded-bl-full -mr-4 -mt-4" />
          <p className="text-sm text-slate-700 leading-relaxed font-medium relative z-10">
            <span className="font-bold text-brand-olive">Smart Bala Autism</span> - бұл тек даму қосымшасы емес. Бұл баланы түсінуге арналған жүйе. Бұл - ата-анаға сенімді серіктес, баланың кішкентай қадамдарын үлкен нәтижеге айналдыратын ақылды және бағыттаушы жүйе.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="mx-2 p-6 md:p-8 rounded-[32px] bg-brand-olive text-white space-y-4 relative overflow-hidden shadow-xl shadow-brand-olive/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-sm">
            <Target className="text-white" size={24} />
          </div>
          <h4 className="font-bold text-white text-xl mb-3">Миссиясы</h4>
          <p className="text-sm md:text-base text-white/90 leading-relaxed font-medium">
            Әрбір ерекше баланың әлеуетін ашу арқылы ата-ана мен бала арасындағы байланысты күшейтіп, даму жолын қарапайым, түсінікті және қолжетімді ету.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mx-2 space-y-4">
        <h3 className="text-xl font-serif font-bold text-brand-olive px-2">Негізгі құндылықтары</h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {[
            { title: "Қамқорлық", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
            { title: "Даму және түзету", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
            { title: "Нақты прогресс", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
            { title: "Қолдау", icon: Users, color: "text-purple-500", bg: "bg-purple-50" }
          ].map((v, i) => (
            <div key={i} className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-full ${v.bg} flex items-center justify-center`}>
                <v.icon size={20} className={v.color} />
              </div>
              <span className="text-xs md:text-sm font-bold text-slate-700">{v.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Features */}
      <div className="mx-2 p-6 md:p-8 rounded-[32px] bg-brand-cream border border-slate-100 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <Smartphone className="text-brand-accent" size={24} />
          </div>
          <h4 className="font-serif font-bold text-brand-olive text-xl">Платформа қамтиды:</h4>
        </div>
        <div className="space-y-4">
          {[
            "Аутизм спектрі бар балаларға бейімделген тапсырмаларды",
            "30 күндік даму сценарийлерін",
            "Мінез-аударма жүйесін",
            "SOS жедел көмекті",
            "Ата-анаға психологиялық қолдауды",
            "Прогресс бақылауды"
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-olive/20 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={14} className="text-brand-olive" />
              </div>
              <span className="text-sm md:text-base font-medium text-slate-700 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
