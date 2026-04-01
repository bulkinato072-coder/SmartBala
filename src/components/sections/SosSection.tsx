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
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-serif font-black text-brand-olive tracking-tight uppercase">{SOS_CONTENT.title}</h2>
        
        <div className="bg-red-50 p-8 rounded-[40px] border-2 border-red-100 space-y-6 shadow-xl shadow-red-900/5">
          <div className="flex gap-4 items-center text-red-600">
            <AlertCircle size={32} />
            <h3 className="font-black text-2xl md:text-3xl leading-tight">{SOS_CONTENT.subtitle}</h3>
          </div>
          
          <div className="space-y-4">
            {SOS_CONTENT.principles.map((p, i) => (
              <p key={i} className="flex items-start gap-3 text-red-900 text-xl md:text-2xl font-black leading-tight">
                <span className="text-red-500 shrink-0">❗</span> {p}
              </p>
            ))}
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl space-y-6 border border-white/20">
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              {SOS_CONTENT.intro}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["жылай бастаса", "айқайласа", "тыңдамаса", "өзін ұстай алмаса"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-base md:text-lg text-slate-600 font-bold bg-white/40 p-3 rounded-2xl">
                  <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Situations List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Жағдайлар тізімі:</p>
          <div className="text-sm font-black text-brand-olive bg-brand-cream px-4 py-2 rounded-full shadow-sm">
            {usedIds.size} / {SOS_CONTENT.situations.length} қолданылды
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOS_CONTENT.situations.map((sit) => (
            <button
              key={sit.id}
              onClick={() => setSelectedId(sit.id)}
              className={cn(
                "w-full p-6 rounded-[32px] text-left transition-all flex items-center justify-between group bg-white border-2 border-slate-100 hover:border-brand-olive/30 shadow-md hover:shadow-xl active:scale-[0.98]"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 bg-brand-cream text-brand-olive group-hover:bg-brand-olive group-hover:text-white transition-all shadow-inner">
                  {sit.id}
                </div>
                <span className="font-black text-lg md:text-xl text-slate-700 leading-tight">{sit.title}</span>
              </div>
              <div className="flex items-center gap-3">
                {usedIds.has(sit.id) && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600 shadow-sm">
                    <CheckCircle2 size={20} />
                  </div>
                )}
                <ChevronDown size={24} className="-rotate-90 text-slate-300 group-hover:text-brand-olive transition-colors" />
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
              <div className="relative p-8 sm:p-10 overflow-y-auto space-y-12 custom-scrollbar flex-1">
                {/* What's happening */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 text-brand-accent px-2">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center">
                      <Info size={24} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.2em]">Не болып жатыр:</p>
                  </div>
                  <div className="bg-brand-cream/40 p-8 rounded-[40px] border-2 border-brand-cream relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Heart size={100} />
                    </div>
                    <p className="text-slate-700 leading-relaxed italic text-xl md:text-2xl font-medium relative z-10">
                      «{selectedSituation.happening}»
                    </p>
                  </div>
                </motion.div>

                {/* To Do */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-green-600 px-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <ThumbsUp size={24} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.2em]">Не істеу керек:</p>
                  </div>
                  <ul className="space-y-4">
                    {selectedSituation.todo.map((item, i) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        key={i} 
                        className="flex items-start gap-5 text-slate-700 bg-green-50/50 p-6 rounded-[32px] border-2 border-green-100/50 hover:bg-green-50 transition-all hover:translate-x-2 shadow-sm"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-green-200">
                          <CheckCircle2 size={24} />
                        </div>
                        <span className="font-black text-lg md:text-xl leading-snug">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Not To Do */}
                {selectedSituation.notodo && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-red-500 px-2">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle size={24} />
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.2em]">Болмайды:</p>
                    </div>
                    <ul className="space-y-4">
                      {selectedSituation.notodo.map((item, i) => (
                        <motion.li 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (selectedSituation.todo.length + i) * 0.1 }}
                          key={i} 
                          className="flex items-start gap-5 text-slate-700 bg-red-50/50 p-6 rounded-[32px] border-2 border-red-100/50 hover:bg-red-50 transition-all hover:translate-x-2 shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-red-200">
                            <XCircle size={24} />
                          </div>
                          <span className="font-black text-lg md:text-xl leading-snug">{item}</span>
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
      <div className="bg-brand-olive text-white p-10 md:p-12 rounded-[50px] space-y-10 relative overflow-hidden shadow-2xl shadow-brand-olive/20">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Sparkles size={160} />
        </div>
        
        <div className="space-y-6 relative z-10">
          <h3 className="text-3xl md:text-4xl font-serif font-black tracking-tight uppercase">SOS қорытындысы:</h3>
          <div className="space-y-4">
            {SOS_CONTENT.conclusion.principles.map((p, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 p-6 rounded-3xl border-2 border-white/5 backdrop-blur-sm">
                <span className="text-brand-cream text-3xl leading-none">❗</span>
                <p className="text-lg md:text-xl font-black leading-tight">{p}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border-2 border-white/5 space-y-6 relative z-10 shadow-inner">
          <p className="text-lg md:text-xl leading-relaxed italic text-white/90 font-medium">
            {SOS_CONTENT.conclusion.message}
          </p>
        </div>

        <div className="text-center space-y-4 pt-6 relative z-10">
          <p className="text-3xl md:text-4xl font-serif italic font-black">Сіз жалғыз емессіз!</p>
          <p className="text-lg md:text-xl text-white/70 font-bold tracking-wide uppercase">Әр қиын сәт – дамудың бір бөлігі!</p>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="space-y-8">
        <h3 className="text-3xl md:text-4xl font-serif font-black text-brand-olive px-4 uppercase tracking-tight">Көмек қажет болса:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SOS_CONTACTS.map((contact, idx) => (
            <div key={idx} className="card-organic p-8 flex flex-col sm:flex-row items-center gap-8 border-4 border-transparent hover:border-red-200 transition-all shadow-xl">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
                <PhoneCall size={40} />
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h4 className="font-black text-2xl text-slate-800 leading-tight">{contact.name}</h4>
                <p className="text-base text-slate-500 font-medium">{contact.desc}</p>
                <a href={`tel:${contact.phone}`} className="inline-block text-3xl md:text-4xl font-serif font-black text-red-600 hover:scale-105 transition-transform">{contact.phone}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
