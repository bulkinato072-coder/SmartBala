import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Search, 
  ChevronRight, 
  Loader2, 
  BarChart3, 
  History,
  TrendingUp,
  Check,
  X,
  ArrowLeft
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
import { UserProfile, CompletedDays } from "../../types";
import { cn } from "../../lib/utils";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { handleFirestoreError, OperationType } from "../../lib/error-handler";

export default function SpecialistProgressView() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<CompletedDays>({});
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"weekly" | "history">("weekly");
  const [expandedWeeklyDay, setExpandedWeeklyDay] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "user"));
        const snapshot = await getDocs(q);
        const usersData = snapshot.docs.map(doc => doc.data() as UserProfile);
        setUsers(usersData);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSelectUser = async (user: UserProfile) => {
    setSelectedUser(user);
    setIsProgressLoading(true);
    setActiveTab("weekly");
    setExpandedWeeklyDay(null);
    try {
      const progressRef = doc(db, "progress", user.uid);
      const progressSnap = await getDoc(progressRef);
      if (progressSnap.exists()) {
        setUserProgress(progressSnap.data().completedDays || {});
      } else {
        setUserProgress({});
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `progress/${user.uid}`);
    } finally {
      setIsProgressLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.childName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate currentDay based on userProgress
  const completedKeys = Object.keys(userProgress).map(Number);
  const lastCompleted = completedKeys.length > 0 ? Math.max(...completedKeys) : 0;
  const currentDay = Math.min(lastCompleted + 1, 30);

  const getChartData = () => {
    const days = ["Дүй", "Сей", "Сәр", "Бей", "Жұм", "Сен", "Жек"];
    const currentWeek = Math.ceil(currentDay / 7);
    const weekStart = (currentWeek - 1) * 7 + 1;
    
    return days.map((name, i) => {
      const dayNum = weekStart + i;
      const dayData = userProgress[dayNum];
      
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
      
      const progress = Math.round((score / 8) * 100);
      return { name, progress };
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-brand-olive" size={32} />
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="space-y-6 pb-32">
        {/* Header */}
        <div className="px-2 space-y-4">
          <button 
            onClick={() => setSelectedUser(null)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-olive transition-colors"
          >
            <ArrowLeft size={16} /> Артқа қайту
          </button>
          
          <div>
            <h2 className="text-2xl font-serif font-bold text-brand-olive">{selectedUser.childName}</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ата-ана: {selectedUser.displayName}</p>
          </div>
        </div>

        {isProgressLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-brand-olive" size={32} />
          </div>
        ) : (
          <>
            {/* Sub Navigation */}
            <div className="sticky top-4 z-40 mx-2 flex bg-white/80 backdrop-blur-md p-1.5 rounded-[24px] shadow-lg border border-white/20">
              <button
                onClick={() => setActiveTab("weekly")}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl transition-all",
                  activeTab === "weekly" ? "bg-brand-olive text-white shadow-md" : "text-slate-400 hover:bg-slate-50"
                )}
              >
                <BarChart3 size={18} />
                <span className="text-[10px] font-bold tracking-tight">Апталық</span>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl transition-all",
                  activeTab === "history" ? "bg-brand-olive text-white shadow-md" : "text-slate-400 hover:bg-slate-50"
                )}
              >
                <History size={18} />
                <span className="text-[10px] font-bold tracking-tight">Тарих</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "weekly" && (
                <motion.div
                  key="weekly"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 px-2"
                >
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
                        const dayData = userProgress[dayNum] || {};
                        const isExpanded = expandedWeeklyDay === dayNum;
                        
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
                                      <div
                                        key={key}
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
                                      </div>
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
                          if ((userProgress[d] as any)?.[stat.field]) count++;
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
                    {Object.entries(userProgress).reverse().slice(0, 5).map(([day, data]) => (
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
                    {Object.keys(userProgress).length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-4">Әзірге жазбалар жоқ.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      <div className="px-2 space-y-1">
        <h2 className="text-3xl font-serif font-bold text-brand-olive">Балалар прогресі</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Барлық балалардың нәтижелері</p>
      </div>

      <div className="px-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Баланың немесе ата-ананың атымен іздеу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-brand-olive shadow-sm text-sm"
          />
        </div>
      </div>

      <div className="space-y-3 px-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <Users size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">Балалар табылмады</p>
          </div>
        ) : (
          filteredUsers.map((u) => (
            <button
              key={u.uid}
              onClick={() => handleSelectUser(u)}
              className="w-full bg-white p-5 rounded-3xl border border-slate-100 hover:border-brand-olive/30 hover:shadow-md transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-olive/10 text-brand-olive flex items-center justify-center font-serif font-bold text-lg group-hover:scale-105 transition-transform">
                  {u.childName?.[0] || u.displayName?.[0] || "Б"}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">{u.childName || "Бала"}</p>
                  <p className="text-xs text-slate-500 font-medium">Ата-ана: {u.displayName}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-olive group-hover:text-white transition-colors text-slate-400">
                <ChevronRight size={18} />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
