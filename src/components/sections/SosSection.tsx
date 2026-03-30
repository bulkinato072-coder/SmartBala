import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  XCircle, 
  Heart, 
  Sparkles, 
  ThumbsUp,
  Info,
  PhoneCall
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { SOS_CONTENT, SOS_CONTACTS } from "../../constants";

export default function SosSection() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const [helpedIds, setHelpedIds] = useState<Set<number>>(new Set());

  const selectedSituation = SOS_CONTENT.situations.find(s => s.id === selectedId);

  const toggleUsed = (id: number) => {
    const newUsed = new Set(usedIds);
    if (newUsed.has(id)) newUsed.delete(id);
    else newUsed.add(id);
    setUsedIds(newUsed);
  };

  const toggleHelped = (id: number) => {
    const newHelped = new Set(helpedIds);
    if (newHelped.has(id)) newHelped.delete(id);
    else newHelped.add(id);
    setHelpedIds(newHelped);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="space-y-6">
        <h2 className="section-title">{SOS_CONTENT.title}</h2>
        
        <div className="bg-red-50 p-6 rounded-[32px] border border-red-100 space-y-4">
          <div className="flex gap-3 items-center text-red-600">
            <AlertCircle size={24} />
            <h3 className="font-bold text-lg">{SOS_CONTENT.subtitle}</h3>
          </div>
          
          <div className="space-y-2">
            {SOS_CONTENT.principles.map((p, i) => (
              <p key={i} className="flex items-center gap-2 text-red-900 font-medium">
                <span className="text-red-500">❗</span> {p}
              </p>
            ))}
          </div>

          <div className="bg-white/50 p-4 rounded-2xl space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              {SOS_CONTENT.intro}
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {["жылай бастаса", "айқайласа", "тыңдамаса", "өзін ұстай алмаса"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-1 h-1 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Situations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Жағдайлар тізімі:</p>
          <div className="text-[10px] font-bold text-brand-olive bg-brand-cream px-3 py-1 rounded-full">
            {usedIds.size} / {SOS_CONTENT.situations.length} қолданылды
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SOS_CONTENT.situations.map((sit) => (
            <button
              key={sit.id}
              onClick={() => setSelectedId(sit.id)}
              className={cn(
                "w-full p-4 rounded-[24px] text-left transition-all flex items-center justify-between group bg-white border border-slate-100 hover:border-brand-olive/30 shadow-sm hover:shadow-md active:scale-[0.98]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 bg-brand-cream text-brand-olive group-hover:bg-brand-olive group-hover:text-white transition-colors">
                  {sit.id}
                </div>
                <span className="font-bold text-sm text-slate-700 line-clamp-1">{sit.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {usedIds.has(sit.id) && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                    <CheckCircle2 size={12} />
                  </div>
                )}
                <ChevronDown size={14} className="-rotate-90 text-slate-300 group-hover:text-brand-olive transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedId && selectedSituation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg bg-white rounded-[48px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col border border-white/20"
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cream/40 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-olive/10 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />
              
              {/* Hand-drawn Doodles (SVG) */}
              <svg className="absolute top-10 right-10 w-24 h-24 text-brand-olive/10 pointer-events-none rotate-12" viewBox="0 0 100 100">
                <path d="M20,50 Q40,20 60,50 T100,50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="30" r="5" fill="currentColor" />
                <circle cx="70" cy="40" r="3" fill="currentColor" />
              </svg>
              <svg className="absolute bottom-20 left-10 w-32 h-32 text-brand-accent/10 pointer-events-none -rotate-12" viewBox="0 0 100 100">
                <path d="M10,90 Q50,10 90,90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M30,70 L70,30 M30,30 L70,70" stroke="currentColor" strokeWidth="2" />
              </svg>

              {/* Modal Header */}
              <div className="relative p-8 sm:p-10 border-b border-slate-50 flex items-start justify-between gap-6 bg-white/40 backdrop-blur-md">
                <div className="flex items-center gap-5">
                  <motion.div 
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 3, scale: 1 }}
                    className="w-16 h-16 rounded-[24px] bg-brand-olive text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg shadow-brand-olive/20"
                  >
                    {selectedSituation.id}
                  </motion.div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-brand-olive uppercase tracking-[0.2em] opacity-60">Жағдай №{selectedSituation.id}</p>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 leading-tight">
                      {selectedSituation.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-12 h-12 rounded-2xl bg-slate-100/50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shrink-0 active:scale-90"
                >
                  <XCircle size={28} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="relative p-8 sm:p-10 overflow-y-auto space-y-10 custom-scrollbar flex-1">
                {/* What's happening */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 text-brand-accent">
                    <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
                      <Info size={18} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest">Не болып жатыр:</p>
                  </div>
                  <div className="bg-brand-cream/40 p-6 rounded-[32px] border border-brand-cream relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Heart size={80} />
                    </div>
                    <p className="text-slate-700 leading-relaxed italic text-lg relative z-10">
                      «{selectedSituation.happening}»
                    </p>
                  </div>
                </motion.div>

                {/* To Do */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 text-green-600 px-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <ThumbsUp size={18} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest">Не істеу керек:</p>
                  </div>
                  <ul className="space-y-3">
                    {selectedSituation.todo.map((item, i) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        key={i} 
                        className="flex items-start gap-4 text-slate-700 bg-green-50/50 p-5 rounded-[28px] border border-green-100/50 hover:bg-green-50 transition-all hover:translate-x-1"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-green-200">
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="font-medium text-base leading-snug">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Not To Do */}
                {selectedSituation.notodo && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 text-red-500 px-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle size={18} />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest">Болмайды:</p>
                    </div>
                    <ul className="space-y-3">
                      {selectedSituation.notodo.map((item, i) => (
                        <motion.li 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (selectedSituation.todo.length + i) * 0.1 }}
                          key={i} 
                          className="flex items-start gap-4 text-slate-700 bg-red-50/50 p-5 rounded-[28px] border border-red-100/50 hover:bg-red-50 transition-all hover:translate-x-1"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-red-200">
                            <XCircle size={16} />
                          </div>
                          <span className="font-medium text-base leading-snug">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="relative p-8 sm:p-10 bg-white border-t border-slate-100 grid grid-cols-2 gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                <button
                  onClick={() => toggleUsed(selectedSituation.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-4 rounded-[28px] font-bold transition-all active:scale-95 border-2",
                    usedIds.has(selectedSituation.id)
                      ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200"
                      : "bg-white border-slate-100 text-slate-500 hover:border-green-200 hover:text-green-600"
                  )}
                >
                  <CheckCircle2 size={20} />
                  <span className="text-[10px] uppercase tracking-widest">{usedIds.has(selectedSituation.id) ? "Қолданылды" : "Қолдандым"}</span>
                </button>
                <button
                  onClick={() => toggleHelped(selectedSituation.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-4 rounded-[28px] font-bold transition-all active:scale-95 border-2",
                    helpedIds.has(selectedSituation.id)
                      ? "bg-brand-olive border-brand-olive text-white shadow-lg shadow-brand-olive/20"
                      : "bg-white border-slate-100 text-slate-500 hover:border-brand-olive/20 hover:text-brand-olive"
                  )}
                >
                  <ThumbsUp size={20} />
                  <span className="text-[10px] uppercase tracking-widest">{helpedIds.has(selectedSituation.id) ? "Көмектесті" : "Көмектесті ме?"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Conclusion */}
      <div className="bg-brand-olive text-white p-8 rounded-[40px] space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Sparkles size={120} />
        </div>
        
        <div className="space-y-4 relative z-10">
          <h3 className="text-2xl font-serif">SOS қорытындысы:</h3>
          <div className="space-y-3">
            {SOS_CONTENT.conclusion.principles.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/5">
                <span className="text-brand-cream">❗</span>
                <p className="text-sm font-medium">{p}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/5 space-y-4 relative z-10">
          <p className="text-sm leading-relaxed italic text-white/90">
            {SOS_CONTENT.conclusion.message}
          </p>
        </div>

        <div className="text-center space-y-2 pt-4 relative z-10">
          <p className="text-xl font-serif italic">Сіз жалғыз емессіз!</p>
          <p className="text-sm text-white/70">Әр қиын сәт – дамудың бір бөлігі!</p>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif text-brand-olive px-2">Көмек қажет болса:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOS_CONTACTS.map((contact, idx) => (
            <div key={idx} className="card-organic flex items-center gap-6 border-2 border-transparent hover:border-red-200 transition-all">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                <PhoneCall size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{contact.name}</h4>
                <p className="text-xs text-slate-500 mb-2">{contact.desc}</p>
                <a href={`tel:${contact.phone}`} className="text-xl font-serif font-bold text-red-600">{contact.phone}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
