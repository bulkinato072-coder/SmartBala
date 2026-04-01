import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Heart, MessageSquare, Hand, Mic2, Zap, AlertCircle, 
  CheckCircle2, Play, Loader2, Sparkles, ShieldCheck,
  Calendar, XCircle, Circle, ChevronRight
} from "lucide-react";
import { cn } from "../../lib/utils";
import { DAILY_SCENARIOS } from "../../constants";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { handleFirestoreError, OperationType } from "../../lib/error-handler";
import { UserProfile, CompletedDays } from "../../types";

interface ScenarioSectionProps {
  currentDay: number;
  completedDays: CompletedDays;
  setCompletedDays: (days: CompletedDays) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  setSelectedDay: (day: number) => void;
}

export default function ScenarioSection({
  currentDay,
  completedDays,
  setCompletedDays,
  userProfile,
  setUserProfile,
  setSelectedDay
}: ScenarioSectionProps) {
  const [dayNote, setDayNote] = useState("");
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);

  useEffect(() => {
    if (completedDays[currentDay]) {
      setDayNote(completedDays[currentDay].note || "");
    } else {
      setDayNote("");
    }
  }, [currentDay, completedDays]);

  // Auto-save note logic
  useEffect(() => {
    if (!userProfile) return;
    
    const timer = setTimeout(async () => {
      // Only auto-save if the note has changed and is different from what's stored
      const currentStoredNote = completedDays[currentDay]?.note || "";
      if (dayNote !== currentStoredNote) {
        setIsAutoSaving(true);
        try {
          const progressRef = doc(db, "progress", userProfile.uid);
          const newCompleted = {
            ...completedDays,
            [currentDay]: { 
              ...completedDays[currentDay],
              note: dayNote,
              completed: completedDays[currentDay]?.completed || false 
            }
          };
          
          await setDoc(progressRef, {
            completedDays: newCompleted,
            lastUpdated: serverTimestamp()
          }, { merge: true });
          
          setCompletedDays(newCompleted);
        } catch (error) {
          console.error("Auto-save failed:", error);
        } finally {
          setIsAutoSaving(false);
        }
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [dayNote, currentDay, userProfile, completedDays, setCompletedDays]);

  const handleComplete = async () => {
    if (!userProfile) return;
    setIsSavingProgress(true);
    try {
      const progressRef = doc(db, "progress", userProfile.uid);
      const newCompleted = {
        ...completedDays,
        [currentDay]: { completed: true, note: dayNote, completedAt: new Date().toISOString() }
      };
      
      const updateData: any = {
        completedDays: newCompleted,
        lastUpdated: serverTimestamp()
      };

      await setDoc(progressRef, updateData, { merge: true });
      setCompletedDays(newCompleted);
      // App.tsx will handle setSelectedDay via useEffect
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "progress");
    } finally {
      setIsSavingProgress(false);
    }
  };

  const scenario = DAILY_SCENARIOS.find(s => s.day === currentDay);

  const isCompleted = completedDays[currentDay]?.completed || false;

  if (isCompleted) {
    return (
      <div className="space-y-8">
        {/* Day Navigation */}
        <div className="bg-white rounded-[32px] p-6 shadow-md border-2 border-slate-100 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 min-w-max px-2">
            {[...Array(30)].map((_, i) => {
              const dayNum = i + 1;
              const isCompleted = completedDays[dayNum]?.completed;
              const isSelected = currentDay === dayNum;
              
              const completedKeys = Object.keys(completedDays).map(Number);
              const lastCompleted = completedKeys.length > 0 ? Math.max(...completedKeys) : 0;
              const nextAvailableDay = Math.min(lastCompleted + 1, 30);
              const isFuture = dayNum > nextAvailableDay;
              
              return (
                <button
                  key={dayNum}
                  disabled={isFuture}
                  onClick={() => setSelectedDay(dayNum)}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all shrink-0 relative border-2",
                    isSelected 
                      ? "bg-brand-olive text-white border-brand-olive shadow-xl shadow-brand-olive/20 scale-110 z-10" 
                      : isFuture
                        ? "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed"
                        : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  <span className="text-sm font-black leading-none mb-1">{dayNum}</span>
                  {isCompleted && (
                    <CheckCircle2 size={14} className={isSelected ? "text-white" : "text-green-500"} />
                  )}
                  {isSelected && (
                    <motion.div 
                      layoutId="activeDay"
                      className="absolute -bottom-1 w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-xl border-2 border-slate-100 text-center space-y-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-olive/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={40} className="text-brand-olive" />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl sm:text-4xl font-serif font-black text-brand-olive leading-tight">Бүгінгі тапсырма орындалды!</h3>
            <p className="text-lg sm:text-2xl text-slate-600 leading-relaxed font-medium">
              Сіз бүгінгі тапсырманы сәтті аяқтадыңыз. Ертең жаңа тапсырма ашылады.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6 text-left">
            {scenario?.support && (
              <div className="px-5 py-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-brand-olive/5 border-2 border-brand-olive/10 flex items-start gap-4 sm:gap-6 shadow-sm">
                <Heart size={28} className="text-brand-olive shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-sm font-black text-brand-olive uppercase tracking-[0.2em]">Қолдау:</p>
                  <p className="text-lg sm:text-2xl text-slate-600 italic font-medium leading-relaxed">
                    {scenario.support}
                  </p>
                </div>
              </div>
            )}

            {scenario?.motivation && (
              <div className="px-5 py-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-brand-accent/5 border-2 border-brand-accent/10 flex items-start gap-4 sm:gap-6 shadow-sm">
                <Sparkles size={28} className="text-brand-accent shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-sm font-black text-brand-accent uppercase tracking-[0.2em]">Мотивация:</p>
                  <p className="text-lg sm:text-2xl text-slate-600 italic font-medium leading-relaxed">
                    {scenario.motivation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Progress Section - BIG AND LOUD */}
        <div className="px-4 py-8 sm:p-10 rounded-[40px] sm:rounded-[50px] bg-brand-cream border-4 border-brand-olive/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-olive/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-accent/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-olive text-white flex items-center justify-center shadow-lg shadow-brand-olive/20">
                  <Calendar size={24} sm:size={32} />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-brand-olive uppercase tracking-tight">Апталық прогресс</h4>
              </div>
              {(() => {
                const currentWeek = Math.ceil(currentDay / 7);
                const weekStart = (currentWeek - 1) * 7 + 1;
                const weekEnd = Math.min(currentWeek * 7, 30);
                let completedInWeek = 0;
                for (let d = weekStart; d <= weekEnd; d++) {
                  if (completedDays[d]?.completed) completedInWeek++;
                }
                const percentage = Math.round((completedInWeek / (weekEnd - weekStart + 1)) * 100);
                return (
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-brand-olive bg-white px-4 sm:px-6 py-1 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm border-2 border-brand-olive/10">
                      {completedInWeek}/{weekEnd - weekStart + 1}
                    </span>
                    <p className="text-[10px] sm:text-sm font-black text-brand-olive/60 uppercase tracking-widest">{percentage}% ОРЫНДАЛДЫ</p>
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {(() => {
                const currentWeek = Math.ceil(currentDay / 7);
                const weekStart = (currentWeek - 1) * 7 + 1;
                const weekEnd = Math.min(currentWeek * 7, 30);
                const weekRows = [];

                for (let d = weekStart; d <= weekEnd; d++) {
                  const isCompleted = completedDays[d]?.completed;
                  const dayScenario = DAILY_SCENARIOS.find(s => s.day === d);
                  const isCurrent = d === currentDay;
                  
                  weekRows.push(
                    <div 
                      key={d} 
                      className={cn(
                        "grid grid-cols-[60px_1fr_40px] sm:grid-cols-[80px_1fr_60px] items-center p-3 sm:p-5 rounded-[20px] sm:rounded-[28px] transition-all border-2",
                        isCurrent 
                          ? "bg-brand-olive text-white border-brand-olive shadow-xl scale-[1.02] z-10" 
                          : isCompleted
                            ? "bg-white text-slate-700 border-green-100 shadow-sm"
                            : "bg-white/50 text-slate-400 border-slate-100"
                      )}
                    >
                      <span className={cn("text-[10px] sm:text-xs font-black uppercase tracking-widest", isCurrent ? "text-white/80" : "text-slate-400")}>
                        {d}-күн
                      </span>
                      <span className={cn("text-base sm:text-lg font-black px-2 sm:px-4 leading-tight", isCurrent ? "text-white" : "text-slate-700")}>
                        {dayScenario?.category || "-"}
                      </span>
                      <div className="flex justify-center">
                        {isCompleted ? (
                          <CheckCircle2 size={24} sm:size={28} className={isCurrent ? "text-white" : "text-green-500"} />
                        ) : d < currentDay ? (
                          <XCircle size={24} sm:size={28} className={isCurrent ? "text-white/50" : "text-red-400"} />
                        ) : (
                          <Circle size={24} sm:size={28} className={isCurrent ? "text-white/30" : "text-slate-200"} />
                        )}
                      </div>
                    </div>
                  );
                }

                return weekRows;
              })()}
            </div>

            <div className="pt-4 sm:pt-6 border-t-2 border-brand-olive/10">
              {(() => {
                const currentWeek = Math.ceil(currentDay / 7);
                const weekStart = (currentWeek - 1) * 7 + 1;
                const weekEnd = Math.min(currentWeek * 7, 30);
                let completedInWeek = 0;
                for (let d = weekStart; d <= weekEnd; d++) {
                  if (completedDays[d]?.completed) completedInWeek++;
                }
                return (
                  <div className="text-center space-y-1 sm:space-y-2">
                    <p className="text-xl sm:text-2xl font-serif italic font-black text-brand-olive">
                      Апта ішінде барлығы {completedInWeek}/{weekEnd - weekStart + 1} тапсырма орындалды
                    </p>
                    <p className="text-[10px] sm:text-sm font-black text-brand-olive/50 uppercase tracking-[0.3em]">Сіз кереметсіз!</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Day Navigation */}
      <div className="bg-white rounded-[32px] p-6 shadow-md border-2 border-slate-100 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 min-w-max px-2">
          {[...Array(30)].map((_, i) => {
            const dayNum = i + 1;
            const isCompleted = completedDays[dayNum]?.completed;
            const isSelected = currentDay === dayNum;
            
            const completedKeys = Object.keys(completedDays).map(Number);
            const lastCompleted = completedKeys.length > 0 ? Math.max(...completedKeys) : 0;
            const nextAvailableDay = Math.min(lastCompleted + 1, 30);
            const isFuture = dayNum > nextAvailableDay;
            
            return (
              <button
                key={dayNum}
                disabled={isFuture}
                onClick={() => setSelectedDay(dayNum)}
                className={cn(
                  "w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all shrink-0 relative border-2",
                  isSelected 
                    ? "bg-brand-olive text-white border-brand-olive shadow-xl shadow-brand-olive/20 scale-110 z-10" 
                    : isFuture
                      ? "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed"
                      : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                )}
              >
                <span className="text-sm font-black leading-none mb-1">{dayNum}</span>
                {isCompleted && (
                  <CheckCircle2 size={14} className={isSelected ? "text-white" : "text-green-500"} />
                )}
                {isSelected && (
                  <motion.div 
                    layoutId="activeDay"
                    className="absolute -bottom-1 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Welcome & Intro Text */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-xl border-2 border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Heart size={160} className="text-brand-olive" />
        </div>
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <h3 className="text-3xl sm:text-4xl font-serif font-black text-brand-olive leading-tight">Құрметті ата-ана!</h3>
          <p className="text-lg sm:text-2xl text-slate-600 leading-relaxed font-medium">
            Бұл бөлімде сізге 30 күнге 30 қарапайым тапсырма дайындалды. Барлық тапсырмаларды үйде оңай көрсетуге болады, әр күнді орындау балаңыздың дамуына нақты үлес қосады.
          </p>
          <div className="space-y-4 sm:space-y-6">
            <p className="font-black text-brand-olive text-lg sm:text-xl uppercase tracking-tight">Балаңызбен бірге орындайсыз:</p>
            {[
              { icon: MessageSquare, text: "Қарым-қатынас – сөйлесуді, назар аударуды дамытасыз", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: Hand, text: "Сенсорика – заттармен ойнап, сезімдерін дамытасыз", color: "text-purple-500", bg: "bg-purple-50" },
              { icon: Mic2, text: "Сөйлеу – сөздерді, қимылдарды түсінуге көмектесесіз", color: "text-green-500", bg: "bg-green-50" },
              { icon: Zap, text: "Мінез-құлық – эмоцияларын бақылауға үйретесіз", color: "text-pink-500", bg: "bg-pink-50" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-50/50 border border-slate-100">
                <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-sm", item.bg, item.color)}>
                  <item.icon size={20} sm:size={24} />
                </div>
                <span className="text-base sm:text-xl text-slate-700 font-bold leading-tight">{item.text}</span>
              </div>
            ))}
          </div>
          <p className="text-brand-olive font-black text-lg sm:text-2xl leading-tight border-l-4 border-brand-olive pl-4 sm:pl-6 py-2">
            Үйде жасаңыз, күн сайын 1 тапсырма орындаңыз – оның дамуын нақты көресіз!
          </p>
          
          <div className="p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-red-50 border-2 border-red-100 space-y-4 sm:space-y-6 shadow-lg shadow-red-900/5">
            <p className="text-[10px] sm:text-sm font-black text-red-600 uppercase tracking-[0.2em] flex items-center gap-2 sm:gap-3">
              <AlertCircle size={16} sm:size={20} /> ЕСКЕРТУ!
            </p>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xl sm:text-2xl font-black text-red-800">Құрметті ата-ана!</p>
              <p className="text-lg sm:text-xl text-red-700/90 font-bold">Бұл 30 күн – тек бағыт.</p>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-3 sm:gap-4 text-base sm:text-lg text-red-700/90 font-bold leading-tight">
                  <CheckCircle2 size={20} sm:size={24} className="shrink-0 mt-1" /> 
                  <span>Бала бір тапсырманы бірнеше күнде меңгеруі мүмкін.</span>
                </li>
                <li className="flex items-start gap-3 sm:gap-4 text-base sm:text-lg text-red-700/90 font-bold leading-tight">
                  <CheckCircle2 size={20} sm:size={24} className="shrink-0 mt-1" /> 
                  <span>Бұл – қалыпты жағдай.</span>
                </li>
              </ul>
              <div className="pt-2 sm:pt-4 space-y-3 sm:space-y-4">
                <p className="text-xl sm:text-2xl font-black text-red-800">Асықпаңыз!</p>
                <p className="text-base sm:text-lg text-red-700/90 font-medium leading-relaxed">Бала түсінбейінше, тапсырманы қайталай беріңіз. Маңыздысы – күн саны емес, баланың дамуы.</p>
                <p className="text-xl sm:text-2xl font-black text-red-800 uppercase tracking-widest pt-2">СӘТТІЛІК ТІЛЕЙМІН!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-xl border-2 border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-brand-olive flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-xl shadow-brand-olive/20">
              {currentDay}
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-black text-brand-accent uppercase tracking-[0.2em]">Күн №</p>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-olive">Бүгінгі тапсырма</h2>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 sm:bg-transparent sm:p-0 sm:border-0">
            <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Категория</p>
            <div className="flex items-center gap-2 text-brand-olive font-black text-lg sm:text-xl">
              {scenario?.category === "Қарым-қатынас" && <MessageSquare size={18} sm:size={20} />}
              {scenario?.category === "Сенсорика" && <Hand size={18} sm:size={20} />}
              {scenario?.category === "Сөйлеу" && <Mic2 size={18} sm:size={20} />}
              {scenario?.category === "Мінез-құлық" && <Zap size={18} sm:size={20} />}
              {scenario?.category}
            </div>
          </div>
        </div>

        {scenario && (
          <div className="space-y-8 sm:space-y-10">
            <div className="w-full h-64 sm:h-96 overflow-hidden rounded-[32px] sm:rounded-[40px] mb-8 sm:mb-10 bg-slate-100 shadow-inner border-2 sm:border-4 border-white">
              <img 
                src={`/${currentDay}.jpg`} 
                alt={scenario.title} 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="px-5 py-8 sm:p-10 rounded-[40px] sm:rounded-[48px] bg-brand-cream/30 border-2 border-brand-olive/10 space-y-8 sm:space-y-10 shadow-sm">
              <h3 className="text-2xl sm:text-4xl font-black text-brand-olive leading-tight">
                {scenario.title}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <p className="text-[10px] sm:text-sm font-black text-brand-accent uppercase tracking-[0.2em] px-2">Тапсырма:</p>
                <ul className="space-y-3 sm:space-y-4">
                  {scenario.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-4 sm:gap-5 text-lg sm:text-2xl text-slate-700 font-bold leading-tight bg-white/40 p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-white/60">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-brand-olive text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-brand-olive/20 font-black text-base sm:text-lg">
                        {i + 1}
                      </div>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <p className="text-[10px] sm:text-sm font-black text-brand-accent uppercase tracking-[0.2em] px-2">Нұсқау:</p>
                <div className="text-lg sm:text-2xl text-slate-600 leading-relaxed italic bg-white/60 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border-2 border-slate-100 shadow-inner">
                  {scenario.instruction}
                </div>
              </div>

              <div className="px-5 py-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-brand-olive/5 border-2 border-brand-olive/10 flex items-start gap-4 sm:gap-6 shadow-sm">
                <Heart size={28} sm:size={32} className="text-brand-olive shrink-0 mt-1" />
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-[10px] sm:text-sm font-black text-brand-olive uppercase tracking-[0.2em]">Қолдау:</p>
                  <p className="text-lg sm:text-2xl text-slate-600 italic font-medium leading-relaxed">
                    {scenario.support}
                  </p>
                </div>
              </div>

              {scenario.motivation && (
                <div className="px-5 py-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-brand-accent/5 border-2 border-brand-accent/10 flex items-start gap-4 sm:gap-6 shadow-sm">
                  <Sparkles size={28} sm:size={32} className="text-brand-accent shrink-0 mt-1" />
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-[10px] sm:text-sm font-black text-brand-accent uppercase tracking-[0.2em]">Мотивация:</p>
                    <p className="text-lg sm:text-2xl text-slate-600 italic font-medium leading-relaxed">
                      {scenario.motivation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="relative space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="block text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Бүгін не үйрендік?</label>
                  {isAutoSaving && (
                    <span className="text-[10px] sm:text-sm font-black text-brand-olive animate-pulse flex items-center gap-2">
                      <Loader2 size={12} sm:size={14} className="animate-spin" /> Сақталуда...
                    </span>
                  )}
                </div>
                <textarea
                  value={dayNote}
                  onChange={(e) => setDayNote(e.target.value)}
                  placeholder="Баланың жетістіктерін қысқаша жазыңыз..."
                  className="w-full h-32 sm:h-40 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-slate-50 border-2 border-slate-100 focus:ring-4 focus:ring-brand-olive/20 focus:border-brand-olive transition-all resize-none text-lg sm:text-xl font-medium shadow-inner"
                />
              </div>

              <button
                onClick={handleComplete}
                disabled={isSavingProgress || completedDays[currentDay]?.completed}
                className={cn(
                  "w-full py-6 sm:py-8 rounded-[32px] sm:rounded-[40px] shadow-2xl flex items-center justify-center gap-3 sm:gap-4 font-black text-xl sm:text-2xl transition-all active:scale-95",
                  completedDays[currentDay]?.completed 
                    ? "bg-green-500 text-white shadow-green-200" 
                    : "bg-brand-olive text-white shadow-brand-olive/30 hover:bg-brand-olive/90"
                )}
              >
                {isSavingProgress ? <Loader2 className="animate-spin" size={24} sm:size={28} /> : <CheckCircle2 size={28} sm:size={32} />}
                {completedDays[currentDay]?.completed ? "Орындалды" : "Орындадым"}
              </button>

              {/* Weekly Progress Section - CRITICAL: BIG AND LOUD */}
              <div className="mt-8 sm:mt-12 px-4 py-8 sm:p-10 rounded-[40px] sm:rounded-[50px] bg-brand-cream border-4 border-brand-olive/20 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-olive/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-accent/5 rounded-full blur-3xl" />
                
                <div className="relative z-10 space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-olive text-white flex items-center justify-center shadow-lg shadow-brand-olive/20">
                        <Calendar size={24} sm:size={32} />
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-brand-olive uppercase tracking-tight">Апталық прогресс</h4>
                    </div>
                    {(() => {
                      const currentWeek = Math.ceil(currentDay / 7);
                      const weekStart = (currentWeek - 1) * 7 + 1;
                      const weekEnd = Math.min(currentWeek * 7, 30);
                      let completedInWeek = 0;
                      for (let d = weekStart; d <= weekEnd; d++) {
                        if (completedDays[d]?.completed) completedInWeek++;
                      }
                      const percentage = Math.round((completedInWeek / (weekEnd - weekStart + 1)) * 100);
                      return (
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-brand-olive bg-white px-4 sm:px-6 py-1 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm border-2 border-brand-olive/10">
                            {completedInWeek}/{weekEnd - weekStart + 1}
                          </span>
                          <p className="text-[10px] sm:text-sm font-black text-brand-olive/60 uppercase tracking-widest">{percentage}% ОРЫНДАЛДЫ</p>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    {(() => {
                      const currentWeek = Math.ceil(currentDay / 7);
                      const weekStart = (currentWeek - 1) * 7 + 1;
                      const weekEnd = Math.min(currentWeek * 7, 30);
                      const weekRows = [];

                      for (let d = weekStart; d <= weekEnd; d++) {
                        const isCompleted = completedDays[d]?.completed;
                        const dayScenario = DAILY_SCENARIOS.find(s => s.day === d);
                        const isCurrent = d === currentDay;
                        
                        weekRows.push(
                          <div 
                            key={d} 
                            className={cn(
                              "grid grid-cols-[60px_1fr_40px] sm:grid-cols-[80px_1fr_60px] items-center p-3 sm:p-5 rounded-[20px] sm:rounded-[28px] transition-all border-2",
                              isCurrent 
                                ? "bg-brand-olive text-white border-brand-olive shadow-xl scale-[1.02] z-10" 
                                : isCompleted
                                  ? "bg-white text-slate-700 border-green-100 shadow-sm"
                                  : "bg-white/50 text-slate-400 border-slate-100"
                            )}
                          >
                            <span className={cn("text-[10px] sm:text-xs font-black uppercase tracking-widest", isCurrent ? "text-white/80" : "text-slate-400")}>
                              {d}-күн
                            </span>
                            <span className={cn("text-base sm:text-lg font-black px-2 sm:px-4 leading-tight", isCurrent ? "text-white" : "text-slate-700")}>
                              {dayScenario?.category || "-"}
                            </span>
                            <div className="flex justify-center">
                              {isCompleted ? (
                                <CheckCircle2 size={24} sm:size={28} className={isCurrent ? "text-white" : "text-green-500"} />
                              ) : d < currentDay ? (
                                <XCircle size={24} sm:size={28} className={isCurrent ? "text-white/50" : "text-red-400"} />
                              ) : (
                                <Circle size={24} sm:size={28} className={isCurrent ? "text-white/30" : "text-slate-200"} />
                              )}
                            </div>
                          </div>
                        );
                      }

                      return weekRows;
                    })()}
                  </div>

                  <div className="pt-4 sm:pt-6 border-t-2 border-brand-olive/10">
                    {(() => {
                      const currentWeek = Math.ceil(currentDay / 7);
                      const weekStart = (currentWeek - 1) * 7 + 1;
                      const weekEnd = Math.min(currentWeek * 7, 30);
                      let completedInWeek = 0;
                      for (let d = weekStart; d <= weekEnd; d++) {
                        if (completedDays[d]?.completed) completedInWeek++;
                      }
                      return (
                        <div className="text-center space-y-1 sm:space-y-2">
                          <p className="text-xl sm:text-2xl font-serif italic font-black text-brand-olive">
                            Апта ішінде барлығы {completedInWeek}/{weekEnd - weekStart + 1} тапсырма орындалды
                          </p>
                          <p className="text-[10px] sm:text-sm font-black text-brand-olive/50 uppercase tracking-[0.3em]">Сіз кереметсіз!</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Motivational Banner */}
      {Object.keys(completedDays).length >= 7 && (
        <div className="p-10 rounded-[40px] bg-gradient-to-br from-brand-olive to-brand-olive/80 text-white shadow-2xl border-2 border-white/20">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <Sparkles size={32} />
            </div>
            <h3 className="text-3xl font-black leading-tight">7 күн қатарынан орындадыңыз!</h3>
          </div>
          <p className="text-xl text-white/80 font-bold">Сіз кереметсіз, балаңыздың дамуына үлес қосып жатырсыз!</p>
        </div>
      )}

      {/* Conclusion Message */}
      {currentDay === 30 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-olive text-white rounded-[50px] p-12 shadow-2xl border-4 border-white/10"
        >
          <div className="flex items-center gap-6 mb-10">
            <div className="w-20 h-20 rounded-full bg-white text-brand-olive flex items-center justify-center shadow-xl">
              <ShieldCheck size={40} />
            </div>
            <h3 className="text-4xl font-serif font-black leading-tight">Құрметті ата-ана! Сіз 30 күнді аяқтадыңыз!</h3>
          </div>
          <p className="mb-6 font-black text-brand-cream text-2xl uppercase tracking-tight">Бұл жолда СІЗ:</p>
          <ul className="space-y-6 mb-12">
            {[
              "Балаңызбен қарым-қатынасты жақсарттыңыз",
              "Баланың сенсорлық қабілеттерін дамыттыңыз",
              "Сөйлеу дағдыларын қолдадыңыз",
              "Баланың мінезін бақылауды үйрендіңіз"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-5 text-xl md:text-2xl font-bold">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 size={20} />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <div className="p-10 rounded-[40px] bg-white/10 backdrop-blur-sm border-2 border-white/5 shadow-inner">
            <p className="text-xl md:text-2xl leading-relaxed italic font-medium">
              Енді сізде баланың күнделікті дамуын бақылау үшін толық база бар. Күнделікті кішкене қадамдар арқылы үлкен нәтижеге жетуге болады!
              <br /><br />
              Есіңізде болсын: әрбір жасалған қадам – баланың дамуына нақты үлес қосады. Сізбен бірге жасаған әр минут – оның болашағына инвестиция.
              <br /><br />
              <span className="font-black not-italic text-white text-2xl md:text-3xl block mt-4">Сіз жақсы анасыз! Баяу жүрсеңіз де — дұрыс жолдасыз.</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
