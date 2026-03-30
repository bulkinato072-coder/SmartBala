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
      <div className="space-y-6">
        {/* Day Navigation */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max px-2">
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
                    "w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all shrink-0 relative",
                    isSelected 
                      ? "bg-brand-olive text-white shadow-lg shadow-brand-olive/20 scale-110 z-10" 
                      : isFuture
                        ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  )}
                >
                  <span className="text-[10px] font-bold leading-none mb-0.5">{dayNum}</span>
                  {isCompleted && (
                    <CheckCircle2 size={10} className={isSelected ? "text-white" : "text-green-500"} />
                  )}
                  {isSelected && (
                    <motion.div 
                      layoutId="activeDay"
                      className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 text-center">
          <div className="w-20 h-20 bg-brand-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-brand-olive" />
          </div>
          <h3 className="text-2xl font-serif text-brand-olive mb-4">Бүгінгі тапсырма орындалды!</h3>
          <p className="text-slate-600 mb-8">
            Сіз бүгінгі тапсырманы сәтті аяқтадыңыз. Ертең жаңа тапсырма ашылады.
          </p>

          <div className="space-y-4 text-left">
            {scenario?.support && (
              <div className="p-6 rounded-3xl bg-brand-olive/5 border border-brand-olive/10 flex items-start gap-4">
                <Heart size={24} className="text-brand-olive shrink-0" />
                <div>
                  <p className="text-xs font-bold text-brand-olive uppercase tracking-widest mb-1">Қолдау:</p>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    {scenario.support}
                  </p>
                </div>
              </div>
            )}

            {scenario?.motivation && (
              <div className="p-6 rounded-3xl bg-brand-accent/5 border border-brand-accent/10 flex items-start gap-4">
                <Sparkles size={24} className="text-brand-accent shrink-0" />
                <div>
                  <p className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-1">Мотивация:</p>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    {scenario.motivation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Progress Section */}
        <div className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm">
          <button 
            onClick={() => setShowWeeklyProgress(!showWeeklyProgress)}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-brand-olive" />
              <h4 className="text-xs font-bold text-brand-olive uppercase tracking-widest">Апталық прогресс</h4>
            </div>
            <div className="flex items-center gap-2">
              {(() => {
                const currentWeek = Math.ceil(currentDay / 7);
                const weekStart = (currentWeek - 1) * 7 + 1;
                const weekEnd = Math.min(currentWeek * 7, 30);
                let completedInWeek = 0;
                for (let d = weekStart; d <= weekEnd; d++) {
                  if (completedDays[d]?.completed) completedInWeek++;
                }
                return (
                  <span className="text-[10px] font-bold bg-brand-cream text-brand-olive px-3 py-1 rounded-full">
                    {completedInWeek}/{weekEnd - weekStart + 1}
                  </span>
                );
              })()}
              <ChevronRight size={16} className={cn("text-brand-olive transition-transform", showWeeklyProgress && "rotate-90")} />
            </div>
          </button>

          {showWeeklyProgress && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
            >
              <div className="space-y-1 pt-4">
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
                          "grid grid-cols-[60px_1fr_40px] items-center p-3 rounded-xl transition-colors",
                          isCurrent ? "bg-brand-olive text-white" : "hover:bg-slate-50 border-b border-slate-50 last:border-0"
                        )}
                      >
                        <span className={cn("text-[10px] font-bold uppercase", isCurrent ? "text-white/70" : "text-slate-400")}>
                          {d}-күн
                        </span>
                        <span className={cn("text-xs font-medium truncate px-2", isCurrent ? "text-white" : "text-slate-600")}>
                          {dayScenario?.category || "-"}
                        </span>
                        <div className="flex justify-center">
                          {isCompleted ? (
                            <CheckCircle2 size={16} className={isCurrent ? "text-white" : "text-green-500"} />
                          ) : d < currentDay ? (
                            <XCircle size={16} className={isCurrent ? "text-white/50" : "text-red-400"} />
                          ) : (
                            <Circle size={16} className={isCurrent ? "text-white/30" : "text-slate-200"} />
                          )}
                        </div>
                      </div>
                    );
                  }

                  return weekRows;
                })()}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Day Navigation */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max px-2">
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
                  "w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all shrink-0 relative",
                  isSelected 
                    ? "bg-brand-olive text-white shadow-lg shadow-brand-olive/20 scale-110 z-10" 
                    : isFuture
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                )}
              >
                <span className="text-[10px] font-bold leading-none mb-0.5">{dayNum}</span>
                {isCompleted && (
                  <CheckCircle2 size={10} className={isSelected ? "text-white" : "text-green-500"} />
                )}
                {isSelected && (
                  <motion.div 
                    layoutId="activeDay"
                    className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Welcome & Intro Text */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Heart size={120} className="text-brand-olive" />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-serif text-brand-olive mb-4">Құрметті ата-ана!</h3>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Бұл бөлімде сізге 30 күнге 30 қарапайым тапсырма дайындалды. Барлық тапсырмаларды үйде оңай көрсетуге болады, әр күнді орындау балаңыздың дамуына нақты үлес қосады.
          </p>
          <div className="space-y-3 mb-8">
            <p className="font-bold text-brand-olive text-sm mb-2">Балаңызбен бірге орындайсыз:</p>
            {[
              { icon: MessageSquare, text: "Қарым-қатынас – сөйлесуді, назар аударуды дамытасыз", color: "text-blue-500" },
              { icon: Hand, text: "Сенсорика – заттармен ойнап, сезімдерін дамытасыз", color: "text-purple-500" },
              { icon: Mic2, text: "Сөйлеу – сөздерді, қимылдарды түсінуге көмектесесіз", color: "text-green-500" },
              { icon: Zap, text: "Мінез-құлық – эмоцияларын бақылауға үйретесіз", color: "text-pink-500" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center bg-slate-50", item.color)}>
                  <item.icon size={14} />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <p className="text-brand-olive font-bold text-sm mb-8">Үйде жасаңыз, күн сайын 1 тапсырма орындаңыз – оның дамуын нақты көресіз!</p>
          
          <div className="p-6 rounded-3xl bg-red-50 border border-red-100">
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertCircle size={14} /> ЕСКЕРТУ!
            </p>
            <p className="text-sm text-red-800 font-bold mb-2">Құрметті ата-ана!</p>
            <p className="text-sm text-red-700/80 mb-4">Бұл 30 күн – тек бағыт.</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-xs text-red-700/80">
                <CheckCircle2 size={12} /> Бала бір тапсырманы бірнеше күнде меңгеруі мүмкін.
              </li>
              <li className="flex items-center gap-2 text-xs text-red-700/80">
                <CheckCircle2 size={12} /> Бұл – қалыпты жағдай.
              </li>
            </ul>
            <p className="text-sm font-bold text-red-800 mb-2">Асықпаңыз!</p>
            <p className="text-xs text-red-700/80 mb-4">Бала түсінбейінше, тапсырманы қайталай беріңіз. Маңыздысы – күн саны емес, баланың дамуы.</p>
            <p className="text-sm font-bold text-red-800 uppercase tracking-widest">СӘТТІЛІК ТІЛЕЙМІН!</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-olive flex items-center justify-center text-white text-xl font-serif shadow-lg shadow-brand-olive/20">
              {currentDay}
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Күн №</p>
              <h2 className="text-xl font-bold text-brand-olive">Бүгінгі тапсырма</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Категория</p>
            <div className="flex items-center gap-1 text-brand-olive font-bold text-sm">
              {scenario?.category === "Қарым-қатынас" && <MessageSquare size={14} />}
              {scenario?.category === "Сенсорика" && <Hand size={14} />}
              {scenario?.category === "Сөйлеу" && <Mic2 size={14} />}
              {scenario?.category === "Мінез-құлық" && <Zap size={14} />}
              {scenario?.category}
            </div>
          </div>
        </div>

        {scenario && (
          <div className="space-y-6">
            <div className="w-full h-64 overflow-hidden rounded-3xl mb-6 bg-slate-100">
              <img 
                src={`/${currentDay}.jpg`} 
                alt={scenario.title} 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 rounded-3xl bg-brand-cream/30 border border-brand-olive/10">
              <h3 className="text-lg font-bold text-brand-olive mb-3">
                {scenario.title}
              </h3>
              
              <div className="mb-6">
                <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-2">Тапсырма:</p>
                <ul className="space-y-2">
                  {scenario.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-brand-olive/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-brand-olive">{i + 1}</span>
                      </div>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-2">Нұсқау:</p>
                <p className="text-sm text-slate-600 leading-relaxed italic bg-white/50 p-4 rounded-2xl border border-slate-100">
                  {scenario.instruction}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-olive/5 border border-brand-olive/10 flex items-start gap-3">
                <Heart size={18} className="text-brand-olive shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-brand-olive uppercase tracking-widest mb-1">Қолдау:</p>
                  <p className="text-sm text-slate-600 italic">
                    {scenario.support}
                  </p>
                </div>
              </div>

              {scenario.motivation && (
                <div className="p-4 rounded-2xl bg-brand-accent/5 border border-brand-accent/10 flex items-start gap-3">
                  <Sparkles size={18} className="text-brand-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-1">Мотивация:</p>
                    <p className="text-sm text-slate-600 italic">
                      {scenario.motivation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Бүгін не үйрендік?</label>
                  {isAutoSaving && (
                    <span className="text-[10px] text-brand-olive animate-pulse flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin" /> Сақталуда...
                    </span>
                  )}
                </div>
                <textarea
                  value={dayNote}
                  onChange={(e) => setDayNote(e.target.value)}
                  placeholder="Баланың жетістіктерін қысқаша жазыңыз..."
                  className="w-full h-24 p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-olive resize-none text-sm"
                />
              </div>

              <button
                onClick={handleComplete}
                disabled={isSavingProgress || completedDays[currentDay]?.completed}
                className={cn(
                  "w-full py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold transition-all",
                  completedDays[currentDay]?.completed 
                    ? "bg-green-500 text-white shadow-green-200" 
                    : "bg-brand-olive text-white shadow-brand-olive/20"
                )}
              >
                {isSavingProgress ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                {completedDays[currentDay]?.completed ? "Орындалды" : "Орындадым"}
              </button>

              {/* Weekly Progress Section */}
              <div className="mt-8 p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm">
                <button 
                  onClick={() => setShowWeeklyProgress(!showWeeklyProgress)}
                  className="w-full flex items-center justify-between mb-2"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-brand-olive" />
                    <h4 className="text-xs font-bold text-brand-olive uppercase tracking-widest">Апталық прогресс</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const currentWeek = Math.ceil(currentDay / 7);
                      const weekStart = (currentWeek - 1) * 7 + 1;
                      const weekEnd = Math.min(currentWeek * 7, 30);
                      let completedInWeek = 0;
                      for (let d = weekStart; d <= weekEnd; d++) {
                        if (completedDays[d]?.completed) completedInWeek++;
                      }
                      return (
                        <span className="text-[10px] font-bold bg-brand-cream text-brand-olive px-3 py-1 rounded-full">
                          {completedInWeek}/{weekEnd - weekStart + 1}
                        </span>
                      );
                    })()}
                    <ChevronRight size={16} className={cn("text-brand-olive transition-transform", showWeeklyProgress && "rotate-90")} />
                  </div>
                </button>

                {showWeeklyProgress && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 pt-4">
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
                                "grid grid-cols-[60px_1fr_40px] items-center p-3 rounded-xl transition-colors",
                                isCurrent ? "bg-brand-olive text-white" : "hover:bg-slate-50 border-b border-slate-50 last:border-0"
                              )}
                            >
                              <span className={cn("text-[10px] font-bold uppercase", isCurrent ? "text-white/70" : "text-slate-400")}>
                                {d}-күн
                              </span>
                              <span className={cn("text-xs font-medium truncate px-2", isCurrent ? "text-white" : "text-slate-600")}>
                                {dayScenario?.category || "-"}
                              </span>
                              <div className="flex justify-center">
                                {isCompleted ? (
                                  <CheckCircle2 size={16} className={isCurrent ? "text-white" : "text-green-500"} />
                                ) : d < currentDay ? (
                                  <XCircle size={16} className={isCurrent ? "text-white/50" : "text-red-400"} />
                                ) : (
                                  <Circle size={16} className={isCurrent ? "text-white/30" : "text-slate-200"} />
                                )}
                              </div>
                            </div>
                          );
                        }

                        return weekRows;
                      })()}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      {(() => {
                        const currentWeek = Math.ceil(currentDay / 7);
                        const weekStart = (currentWeek - 1) * 7 + 1;
                        const weekEnd = Math.min(currentWeek * 7, 30);
                        let completedInWeek = 0;
                        for (let d = weekStart; d <= weekEnd; d++) {
                          if (completedDays[d]?.completed) completedInWeek++;
                        }
                        return (
                          <p className="text-center text-xs font-serif italic text-brand-olive">
                            Апта ішінде барлығы {completedInWeek}/{weekEnd - weekStart + 1} тапсырма орындалды
                          </p>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Motivational Banner */}
      {Object.keys(completedDays).length >= 7 && (
        <div className="p-6 rounded-[32px] bg-gradient-to-br from-brand-olive to-brand-olive/80 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold">7 күн қатарынан орындадыңыз!</h3>
          </div>
          <p className="text-xs text-white/80">Сіз кереметсіз, балаңыздың дамуына үлес қосып жатырсыз!</p>
        </div>
      )}

      {/* Conclusion Message */}
      {currentDay === 30 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-olive text-white rounded-[32px] p-8 shadow-xl border border-white/10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-white text-brand-olive flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-2xl font-serif">Құрметті ата-ана! Сіз 30 күнді аяқтадыңыз!</h3>
          </div>
          <p className="mb-4 font-bold text-brand-cream">Бұл жолда СІЗ:</p>
          <ul className="space-y-3 mb-8">
            {[
              "Балаңызбен қарым-қатынасты жақсарттыңыз",
              "Баланың сенсорлық қабілеттерін дамыттыңыз",
              "Сөйлеу дағдыларын қолдадыңыз",
              "Баланың мінезін бақылауды үйрендіңіз"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={12} />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/5">
            <p className="text-sm leading-relaxed italic">
              Енді сізде баланың күнделікті дамуын бақылау үшін толық база бар. Күнделікті кішкене қадамдар арқылы үлкен нәтижеге жетуге болады!
              <br /><br />
              Есіңізде болсын: әрбір жасалған қадам – баланың дамуына нақты үлес қосады. Сізбен бірге жасаған әр минут – оның болашағына инвестиция.
              <br /><br />
              <span className="font-bold not-italic">Сіз жақсы анасыз! Баяу жүрсеңіз де — дұрыс жолдасыз.</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
