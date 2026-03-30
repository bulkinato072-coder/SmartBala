import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Hand, 
  Mic2, 
  Zap, 
  Sparkles, 
  BarChart3,
  Calendar,
  Trophy,
  History,
  Bell,
  ChevronRight,
  Loader2,
  Check,
  X,
  TrendingUp,
  Brain,
  Users
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { DAILY_SCENARIOS, progressData } from "../../constants";
import { CompletedDays, UserProfile } from "../../types";
import { cn } from "../../lib/utils";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import SpecialistProgressView from "./SpecialistProgressView";

interface ProgressSectionProps {
  completedDays: CompletedDays;
  setCompletedDays: (days: CompletedDays) => void;
  currentDay: number;
  userProfile: UserProfile;
}

type TabType = "daily" | "weekly" | "history" | "reward" | "notifications";

export default function ProgressSection({
  completedDays,
  setCompletedDays,
  currentDay,
  userProfile
}: ProgressSectionProps) {
  if (userProfile.role === "specialist") {
    return <SpecialistProgressView />;
  }

  const [activeTab, setActiveTab] = useState<TabType>("daily");
  const [dayNote, setDayNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>("default");
  const [reminderTime, setReminderTime] = useState("20:00");
  const [expandedWeeklyDay, setExpandedWeeklyDay] = useState<number | null>(null);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);
    if (permission === "granted") {
      new Notification("Рахмет!", {
        body: "Енді сіз күнделікті жаттығулар туралы ескертулер аласыз.",
        icon: "/logo.png"
      });
    }
  };

  useEffect(() => {
    if (completedDays[currentDay]) {
      setDayNote(completedDays[currentDay].note || "");
    }
  }, [currentDay, completedDays]);

  // Check for 7-day streak
  useEffect(() => {
    const currentWeek = Math.ceil(currentDay / 7);
    const weekStart = (currentWeek - 1) * 7 + 1;
    const weekEnd = Math.min(currentWeek * 7, 30);
    let completedInWeek = 0;
    for (let d = weekStart; d <= weekEnd; d++) {
      if (completedDays[d]?.completed) completedInWeek++;
    }
    if (completedInWeek >= 7) {
      setShowReward(true);
    }
  }, [completedDays, currentDay]);

  const handleSaveDaily = async () => {
    if (!userProfile) return;
    setIsSaving(true);
    try {
      const progressRef = doc(db, "progress", userProfile.uid);
      const newCompleted = {
        ...completedDays,
        [currentDay]: { 
          ...completedDays[currentDay],
          completed: true, 
          note: dayNote, 
          completedAt: new Date().toISOString() 
        }
      };
      
      await setDoc(progressRef, {
        completedDays: newCompleted,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      setCompletedDays(newCompleted);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleWeeklyField = async (day: number, field: string) => {
    if (!userProfile) return;
    const newCompleted = {
      ...completedDays,
      [day]: {
        ...completedDays[day],
        [field]: !((completedDays[day] as any)?.[field])
      }
    };

    try {
      const progressRef = doc(db, "progress", userProfile.uid);
      await setDoc(progressRef, {
        completedDays: newCompleted,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      setCompletedDays(newCompleted);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Calculate real chart data
  const getChartData = () => {
    const days = ["Дүй", "Сей", "Сәр", "Бей", "Жұм", "Сен", "Жек"];
    const currentWeek = Math.ceil(currentDay / 7);
    const weekStart = (currentWeek - 1) * 7 + 1;
    
    return days.map((name, i) => {
      const dayNum = weekStart + i;
      const dayData = completedDays[dayNum];
      
      if (!dayData) return { name, progress: 0 };
      
      let score = 0;
      if (dayData.completed) score += 1;
      
      const milestones = [
        "languageUnderstanding", "fineMotor", "grossMotor", "attention",
        "reactionToQuestions", "instructorGesture", "socialSkills"
      ];
      
      milestones.forEach(m => {
        if ((dayData as any)[m]) score += 1;
      });
      
      // Normalize to 0-100 (max score is 8)
      const progress = Math.round((score / 8) * 100);
      
      return { name, progress };
    });
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "daily", label: "Күнделікті", icon: Calendar },
    { id: "weekly", label: "Апталық", icon: BarChart3 },
    { id: "history", label: "Тарих", icon: History },
    { id: "notifications", label: "Ескерту", icon: Bell },
  ];

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="px-2 space-y-1">
        <h2 className="text-3xl font-serif font-bold text-brand-olive">Даму прогрестері</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">“Кіші прогресс — үлкен нәтиже”</p>
      </div>

      {/* Intro Card - Mobile Optimized */}
      <div className="mx-2 rounded-[40px] bg-[#5A5A40] text-white p-7 relative overflow-hidden shadow-2xl shadow-brand-olive/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <p className="text-lg font-bold text-white">Құрметті ата-ана!</p>
          </div>
          
          <p className="text-sm text-white/90 leading-relaxed font-medium">
            Балаңыздың күнделікті және апталық жетістіктерін бақылап, нақты прогресті көре аласыз.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Күнделікті жетістіктерді жазу",
              "Жаттығуларды белгілеу",
              "Апталық статистика",
              "Мотивациялық марапаттар"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E67E22] flex items-center justify-center shrink-0 shadow-lg shadow-brand-accent/20">
                  <Check size={12} className="text-white" strokeWidth={4} />
                </div>
                <span className="text-xs font-bold text-white">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub Navigation - Sticky-like on mobile */}
      <div className="sticky top-4 z-40 mx-2 flex bg-white/80 backdrop-blur-md p-1.5 rounded-[24px] shadow-lg border border-white/20 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl transition-all min-w-[80px]",
              activeTab === tab.id 
                ? "bg-brand-olive text-white shadow-md" 
                : "text-slate-400 hover:bg-slate-50"
            )}
          >
            <tab.icon size={18} />
            <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* SCREEN 1: DAILY PROGRESS */}
        {activeTab === "daily" && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="card-organic space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-olive/10 flex items-center justify-center text-brand-olive">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Бүгін не үйрендік?</h3>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={dayNote}
                    onChange={(e) => setDayNote(e.target.value)}
                    placeholder="Мысалы: Жаттығуды жақсы орындады, жаңа дыбыс шығарды..."
                    className="w-full h-32 p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-olive resize-none text-sm"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-bold">
                    {dayNote.length} таңба
                  </div>
                </div>

                <button
                  onClick={handleSaveDaily}
                  disabled={isSaving}
                  className={cn(
                    "w-full py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold transition-all",
                    completedDays[currentDay]?.completed 
                      ? "bg-green-500 text-white shadow-green-200" 
                      : "bg-brand-olive text-white shadow-brand-olive/20"
                  )}
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                  {completedDays[currentDay]?.completed ? "Бүгінгі жаттығулар орындалды ✔" : "Орындалды деп белгілеу"}
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 flex items-start gap-4">
              <Sparkles size={24} className="text-blue-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-blue-800 mb-1">Кішкентай қадам – үлкен нәтиже!</p>
                <p className="text-xs text-blue-700/70 italic">
                  Бала кеше істей алмаған нәрсені бүгін істесе – бұл үлкен жеңіс.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN 2: WEEKLY STATISTICS - Mobile Optimized Cards */}
        {activeTab === "weekly" && (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 px-2"
          >
            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Апталық жетістіктер</h3>
              <p className="text-xs text-slate-500">Әр күннің жетістіктерін белгілеу үшін күнді басыңыз.</p>
            </div>

            <div className="space-y-3">
              {(() => {
                const days = ["Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма", "Сенбі", "Жексенбі"];
                const currentWeek = Math.ceil(currentDay / 7);
                const weekStart = (currentWeek - 1) * 7 + 1;
                
                const milestoneLabels: Record<string, string> = {
                  languageUnderstanding: "Тіл түсіну",
                  fineMotor: "Ұсақ моторика",
                  grossMotor: "Ірі моторика",
                  attention: "Назар және зейін",
                  reactionToQuestions: "Сұраққа реакция",
                  instructorGesture: "Нұсқаушы жесті",
                  socialSkills: "Әлеуметтік дағдылар"
                };

                return days.map((dayName, i) => {
                  const dayNum = weekStart + i;
                  const dayData = completedDays[dayNum] || {};
                  const isExpanded = expandedWeeklyDay === dayNum;
                  
                  // Calculate daily score
                  let completedCount = 0;
                  Object.keys(milestoneLabels).forEach(key => {
                    if ((dayData as any)[key]) completedCount++;
                  });

                  return (
                    <div 
                      key={dayName}
                      className={cn(
                        "bg-white rounded-[24px] border transition-all overflow-hidden",
                        isExpanded ? "border-brand-olive ring-1 ring-brand-olive/10 shadow-lg" : "border-slate-100"
                      )}
                    >
                      <button
                        onClick={() => setExpandedWeeklyDay(isExpanded ? null : dayNum)}
                        className="w-full p-5 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                            completedCount > 0 ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"
                          )}>
                            {dayNum}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{dayName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              {completedCount}/7 жетістік
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1">
                            {[...Array(7)].map((_, idx) => (
                              <div 
                                key={idx} 
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full border border-white",
                                  idx < completedCount ? "bg-green-500" : "bg-slate-200"
                                )} 
                              />
                            ))}
                          </div>
                          <ChevronRight size={16} className={cn("text-slate-300 transition-transform", isExpanded && "rotate-90 text-brand-olive")} />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-slate-50/50"
                          >
                            <div className="p-5 pt-0 grid grid-cols-1 gap-2">
                              {Object.entries(milestoneLabels).map(([key, label]) => (
                                <button
                                  key={key}
                                  onClick={() => toggleWeeklyField(dayNum, key)}
                                  className={cn(
                                    "flex items-center justify-between p-3 rounded-xl border transition-all",
                                    (dayData as any)[key] 
                                      ? "bg-white border-green-200 text-green-700 shadow-sm" 
                                      : "bg-white/50 border-slate-100 text-slate-500"
                                  )}
                                >
                                  <span className="text-xs font-medium">{label}</span>
                                  <div className={cn(
                                    "w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                                    (dayData as any)[key] ? "bg-green-500 text-white" : "bg-slate-100 text-slate-300"
                                  )}>
                                    {(dayData as any)[key] ? <Check size={14} strokeWidth={4} /> : <X size={14} />}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="card-organic bg-brand-cream/30 border-brand-olive/10">
              <p className="text-xs font-bold text-brand-olive uppercase tracking-widest mb-4">Жиыны (7 күн)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Тіл түсіну", field: "languageUnderstanding" },
                  { label: "Ұсақ моторика", field: "fineMotor" },
                  { label: "Ірі моторика", field: "grossMotor" },
                  { label: "Назар", field: "attention" }
                ].map(stat => {
                  const currentWeek = Math.ceil(currentDay / 7);
                  const weekStart = (currentWeek - 1) * 7 + 1;
                  let count = 0;
                  for (let d = weekStart; d < weekStart + 7; d++) {
                    if ((completedDays[d] as any)?.[stat.field]) count++;
                  }
                  return (
                    <div key={stat.field} className="p-4 rounded-2xl bg-white border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
                      <p className="text-xl font-serif font-bold text-brand-olive">{count}/7</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN 4: PROGRESS HISTORY */}
        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="card-organic">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Апталық динамика</h3>
                <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                  <TrendingUp size={14} /> 
                  {(() => {
                    const data = getChartData();
                    const last = data[data.length - 1].progress;
                    const prev = data[data.length - 2]?.progress || 0;
                    const diff = last - prev;
                    return diff >= 0 ? `+${diff}% прогресс` : `${diff}% прогресс`;
                  })()}
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#5A5A40" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`${value}%`, 'Прогресс']}
                    />
                    <Area type="monotone" dataKey="progress" stroke="#5A5A40" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Соңғы жазбалар</h3>
              {Object.entries(completedDays).reverse().slice(0, 5).map(([day, data]) => (
                <div key={day} className="card-organic hover:border-brand-olive/20 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-brand-olive/10 text-brand-olive text-[10px] font-bold flex items-center justify-center">
                        {day}
                      </span>
                      <span className="text-xs font-bold text-slate-700">Күн жетістігі</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(data.completedAt || "").toLocaleDateString('kk-KZ')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    "{data.note || "Жазба қалдырылмады"}"
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SCREEN 5: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm flex items-start gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Bell size={60} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-olive/10 text-brand-olive flex items-center justify-center shrink-0">
                  <Bell size={24} />
                </div>
                <div className="space-y-1 relative z-10">
                  <p className="font-bold text-slate-800">Жаттығуларды бүгін орындадыңыз ба?</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Күнделікті жаттығулар балаңыздың дамуына нақты үлес қосады. Еске салуды ұмытпаңыз!
                  </p>
                  <div className="pt-3">
                    <button 
                      onClick={() => setActiveTab("daily")}
                      className="text-xs font-bold text-brand-olive hover:underline flex items-center gap-1"
                    >
                      Орындауға өту <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-[32px] bg-brand-accent/5 border border-brand-accent/10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0">
                  <Sparkles size={24} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-brand-accent">Кішкентай қадам – үлкен нәтиже!</p>
                  <p className="text-xs text-brand-accent/70 leading-relaxed italic">
                    “Бүгінгі 15 минуттық жаттығу — ертеңгі үлкен жетістіктің бастауы.”
                  </p>
                </div>
              </div>
            </div>

            <div className="card-organic space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Хабарламалар параметрлері</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Bell size={18} className="text-slate-400" />
                    <div className="space-y-0.5">
                      <span className="text-sm font-medium text-slate-700 block">Push-хабарламалар</span>
                      <span className="text-[10px] text-slate-400 block">
                        {notificationStatus === "granted" ? "Қосылған" : "Өшірілген"}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={requestNotificationPermission}
                    className={cn(
                      "w-12 h-6 rounded-full relative transition-colors",
                      notificationStatus === "granted" ? "bg-brand-olive" : "bg-slate-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                      notificationStatus === "granted" ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-brand-olive/5 border border-brand-olive/10">
                  <p className="text-[10px] font-bold text-brand-olive uppercase tracking-widest mb-2">Мобильді нұсқа үшін:</p>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    Push-хабарламаларды алу үшін қолданбаны телефонның басты экранына қосыңыз (Add to Home Screen). Осылайша қолданба нақты мобильді қосымша ретінде жұмыс істейді.
                  </p>
                </div>

                {notificationStatus === "granted" && (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-slate-400" />
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium text-slate-700 block">Еске салу уақыты</span>
                        <span className="text-[10px] text-slate-400 block">Күнделікті хабарлама</span>
                      </div>
                    </div>
                    <input 
                      type="time" 
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="bg-white border-none rounded-lg px-2 py-1 text-sm font-bold text-brand-olive focus:ring-1 focus:ring-brand-olive"
                    />
                  </div>
                )}
              </div>
              
              {notificationStatus === "denied" && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                  <p className="text-[10px] text-red-600 leading-relaxed">
                    <span className="font-bold block mb-1">Хабарламалар бұғатталған</span>
                    Браузер параметрлеріне өтіп, осы сайт үшін хабарламаларға рұқсат беріңіз.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REWARD MODAL / SECTION */}
      {showReward && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className="bg-white rounded-[48px] p-10 max-w-sm w-full text-center space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-olive/5 rounded-full" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-accent/5 rounded-full" />
            
            <button 
              onClick={() => setShowReward(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>

            <div className="space-y-6 relative z-10">
              <div className="w-24 h-24 bg-brand-olive rounded-full flex items-center justify-center mx-auto shadow-xl shadow-brand-olive/20 animate-bounce">
                <Trophy size={48} className="text-white" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-brand-olive">Бәрекелді!</h3>
                <p className="text-lg font-bold text-slate-800">7 күн қатарынан орындадыңыз!</p>
              </div>

              <div className="space-y-4">
                {[
                  "Жарайсыз!",
                  "Сіздің қолыңыздан бәрі келеді!",
                  "Сіз мықтысыз!",
                  "Сіз керемет жұмыс жасап жатырсыз!",
                  "Балаңызда прогресс бар!"
                ].map((text, i) => (
                  <motion.p 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="text-sm text-slate-600 italic"
                  >
                    {text}
                  </motion.p>
                ))}
              </div>

              <button 
                onClick={() => setShowReward(false)}
                className="btn-olive w-full py-4 rounded-2xl shadow-lg"
              >
                Жалғастыру
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Conclusion Footer */}
      <div className="text-center space-y-4 pt-10 border-t border-slate-100">
        <div className="flex justify-center gap-4">
          <div className="w-2 h-2 rounded-full bg-brand-olive" />
          <div className="w-2 h-2 rounded-full bg-brand-accent" />
          <div className="w-2 h-2 rounded-full bg-brand-olive/30" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-brand-olive">Сіз дұрыс жолдасыз</p>
          <p className="text-xs text-slate-400">Сіздің еңбегіңіз көрініп жатыр • Балаңыз дамып келеді</p>
        </div>
      </div>
    </div>
  );
}
