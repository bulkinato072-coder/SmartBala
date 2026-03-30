import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Quote,
  MessageCircleHeart,
  ChevronDown,
  Check
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { SUPPORT_CONTENT } from "../../constants";

export default function SupportSection() {
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [dailyThought, setDailyThought] = useState(SUPPORT_CONTENT.items[0]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem("support_likes");
    const savedSaves = localStorage.getItem("support_saves");
    
    if (savedLikes) {
      try {
        setLikedIds(new Set(JSON.parse(savedLikes)));
      } catch (e) {
        console.error("Error parsing likes", e);
      }
    }
    
    if (savedSaves) {
      try {
        setSavedIds(new Set(JSON.parse(savedSaves)));
      } catch (e) {
        console.error("Error parsing saves", e);
      }
    }

    // Daily thought logic
    const dayOfMonth = new Date().getDate();
    const index = (dayOfMonth - 1) % SUPPORT_CONTENT.items.length;
    setDailyThought(SUPPORT_CONTENT.items[index]);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("support_likes", JSON.stringify(Array.from(likedIds)));
  }, [likedIds]);

  useEffect(() => {
    localStorage.setItem("support_saves", JSON.stringify(Array.from(savedIds)));
  }, [savedIds]);

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedIds);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedIds(newLiked);
  };

  const toggleSave = (id: number) => {
    const newSaved = new Set(savedIds);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedIds(newSaved);
  };

  const filteredItems = showOnlySaved 
    ? SUPPORT_CONTENT.items.filter(item => savedIds.has(item.id))
    : SUPPORT_CONTENT.items;

  return (
    <div className="space-y-10 pb-24">
      {/* Header & Intro */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="section-title text-pink-600">{SUPPORT_CONTENT.title}</h2>
          <p className="text-sm font-bold text-pink-400 uppercase tracking-widest px-1">
            {SUPPORT_CONTENT.subtitle}
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pink-50/50 p-8 rounded-[40px] border border-pink-100 space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 text-pink-600">
            <Quote size={80} />
          </div>
          
          <div className="space-y-4 relative z-10">
            <h3 className="text-2xl font-serif text-pink-800">{SUPPORT_CONTENT.intro.greeting}</h3>
            <p className="text-pink-900/80 leading-relaxed">
              {SUPPORT_CONTENT.intro.message}
            </p>
            <ul className="space-y-2">
              {SUPPORT_CONTENT.intro.thoughts.map((t, i) => (
                <li key={i} className="flex items-center gap-3 text-pink-700 font-medium italic">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-pink-900/80 leading-relaxed pt-2">
              {SUPPORT_CONTENT.intro.conclusion}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Daily Support Card */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Sparkles size={18} className="text-pink-500" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Бүгінгі қолдау</h3>
        </div>
        
        <motion.div 
          layoutId="daily-card"
          className="bg-white p-8 rounded-[40px] border-2 border-pink-100 shadow-xl shadow-pink-100/20 space-y-6 relative overflow-hidden group"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-50 rounded-full blur-3xl group-hover:bg-pink-100 transition-colors" />
          
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold uppercase tracking-wider">
              Күн сайын жаңа ой
            </div>
            <div className="space-y-4">
              <p className="text-xl font-serif text-slate-800 italic leading-tight">
                {dailyThought.thought}
              </p>
              <div className="h-px w-12 bg-pink-200" />
              <p className="text-lg text-pink-700 font-medium leading-relaxed">
                {dailyThought.answer}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 relative z-10">
            <button 
              onClick={() => toggleLike(dailyThought.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95",
                likedIds.has(dailyThought.id) 
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-200" 
                  : "bg-pink-50 text-pink-600 hover:bg-pink-100"
              )}
            >
              <Heart size={18} fill={likedIds.has(dailyThought.id) ? "currentColor" : "none"} />
              <span className="text-sm">Маған дәл осы керек болды</span>
            </button>
            
            <button 
              onClick={() => toggleSave(dailyThought.id)}
              className={cn(
                "p-3 rounded-2xl transition-all active:scale-95",
                savedIds.has(dailyThought.id)
                  ? "bg-slate-800 text-white"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              )}
            >
              <Bookmark size={20} fill={savedIds.has(dailyThought.id) ? "currentColor" : "none"} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Full List of Thoughts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {showOnlySaved ? "Сақталған ойлар" : "Барлық ойлар мен жауаптар"}
            </h3>
            <p className="text-[10px] font-bold text-pink-500">
              {filteredItems.length} {showOnlySaved ? "сақталған" : "терапиялық"} жауап
            </p>
          </div>
          
          <button
            onClick={() => setShowOnlySaved(!showOnlySaved)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all",
              showOnlySaved 
                ? "bg-slate-800 text-white" 
                : "bg-pink-50 text-pink-600 hover:bg-pink-100"
            )}
          >
            <Bookmark size={14} fill={showOnlySaved ? "currentColor" : "none"} />
            {showOnlySaved ? "Барлығын көрсету" : "Сақталғандар"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "bg-white rounded-[32px] border border-slate-100 overflow-hidden transition-all",
                  expandedId === item.id ? "ring-2 ring-pink-100 shadow-lg" : "hover:border-pink-100"
                )}
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                      <MessageCircleHeart size={20} />
                    </div>
                    <span className="font-bold text-slate-700 leading-tight">{item.thought}</span>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={cn(
                      "text-slate-300 transition-transform duration-300",
                      expandedId === item.id && "rotate-180 text-pink-500"
                    )} 
                  />
                </button>

                <AnimatePresence>
                  {expandedId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 space-y-6">
                        <div className="bg-pink-50/30 p-6 rounded-3xl border border-pink-50">
                          <p className="text-pink-800 font-medium leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleLike(item.id)}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all",
                              likedIds.has(item.id)
                                ? "bg-pink-500 text-white"
                                : "bg-slate-50 text-slate-500 hover:bg-pink-50 hover:text-pink-600"
                            )}
                          >
                            <Heart size={16} fill={likedIds.has(item.id) ? "currentColor" : "none"} />
                            Маған керек
                          </button>
                          <button 
                            onClick={() => toggleSave(item.id)}
                            className={cn(
                              "p-3 rounded-xl transition-all",
                              savedIds.has(item.id)
                                ? "bg-slate-800 text-white"
                                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                            )}
                          >
                            <Bookmark size={18} fill={savedIds.has(item.id) ? "currentColor" : "none"} />
                          </button>
                          <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all">
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Bookmark size={24} className="text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-bold">Әзірге сақталған ойлар жоқ</p>
                <p className="text-xs text-slate-400">Өзіңізге ұнаған ойларды бетбелгіге қосыңыз</p>
              </div>
              <button 
                onClick={() => setShowOnlySaved(false)}
                className="text-xs font-bold text-pink-500 hover:underline"
              >
                Барлық ойларды көру
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conclusion Footer */}
      <div className="bg-slate-900 text-white p-10 rounded-[48px] space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-pink-500">
          <Heart size={120} fill="currentColor" />
        </div>
        
        <div className="space-y-6 relative z-10">
          <div className="space-y-4">
            {SUPPORT_CONTENT.conclusion.points.map((p, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex items-start gap-4"
              >
                <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center shrink-0 mt-1">
                  <Check size={14} className="text-white" />
                </div>
                <p className={cn(
                  "text-lg font-serif italic",
                  i === 3 || i === 4 ? "text-pink-400 font-bold not-italic" : "text-white/90"
                )}>
                  {p}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center pt-6 border-t border-white/10 relative z-10">
          <p className="text-sm text-white/50 uppercase tracking-widest font-bold">Сіз кереметсіз</p>
        </div>
      </div>
    </div>
  );
}
