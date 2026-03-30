import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, X, CheckCircle2, HelpCircle } from "lucide-react";
import { BEHAVIOR_TRANSLATIONS } from "../../constants";
import { cn } from "../../lib/utils";

export default function TranslatorSection() {
  const [selectedBehavior, setSelectedBehavior] = useState<typeof BEHAVIOR_TRANSLATIONS[0] | null>(null);

  return (
    <div className="space-y-12 pb-12">
      {/* Intro Section */}
      <div className="text-center space-y-4 px-2">
        <p className="text-brand-accent font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mb-2">2-БӨЛІМ: МІНЕЗ - АУДАРМА</p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-olive leading-tight">Баланың мінезін “тілге аудару”</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
          Құрметті ата-ана! Сізге толық база: <br />
          <span className="font-bold text-brand-olive">✔ 30 мінез-құлық | ✔ 30 түсіндірме | ✔ 30 шешім</span> дайындадым. 
        </p>
        <div className="card-organic bg-brand-olive/5 border-brand-olive/10 max-w-3xl mx-auto p-4 sm:p-6">
          <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed">
            “Бұл бөлімде сіз балаңыздың мінез-құлқын түсінуді үйренесіз. Төменнен балаңыздың қазіргі әрекетін таңдаңыз. Біз оның себебін түсіндіріп, не істеу керектігін көрсетеміз. Әр мінез — бұл сигнал. Бала жаман емес. Ол тек өзін басқаша жеткізеді.”
          </p>
        </div>
      </div>

      {/* Selection Grid */}
      <div className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-brand-olive flex items-center gap-2">
          <HelpCircle className="text-brand-accent" /> Бала не істеп жатыр?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BEHAVIOR_TRANSLATIONS.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedBehavior(item)}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-olive/30 transition-all text-left flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-cream flex items-center justify-center text-brand-olive font-bold group-hover:bg-brand-olive group-hover:text-white transition-colors shrink-0 text-xs sm:text-base">
                {item.id}
              </div>
              <span className="font-medium text-slate-700 group-hover:text-brand-olive transition-colors text-xs sm:text-sm md:text-base line-clamp-2">{item.behavior}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Popup Modal */}
      <AnimatePresence>
        {selectedBehavior && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBehavior(null)}
              className="absolute inset-0 bg-brand-olive/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-[32px] shadow-2xl overflow-y-auto flex flex-col scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header/Image */}
              <div className="relative h-72 sm:h-80 bg-brand-cream/30 overflow-hidden shrink-0 flex items-center justify-center">
                <img 
                  src={`/${selectedBehavior.id}.jpg`} 
                  alt={selectedBehavior.behavior}
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    // Fallback if image doesn't exist or wrong extension
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedBehavior.id}/600/400`;
                  }}
                />
                <button 
                  onClick={() => setSelectedBehavior(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-brand-olive hover:bg-white transition-colors z-10"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-1">Әрекеті</h4>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-olive">{selectedBehavior.behavior}</p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-cream/50 border border-brand-olive/10">
                  <h4 className="text-[10px] font-bold text-brand-olive uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Brain size={14} /> Шын мәні
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{selectedBehavior.meaning}</p>
                </div>

                <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                  <h4 className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CheckCircle2 size={14} /> Не істеу керек
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{selectedBehavior.action}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-center">
                  <p className="text-brand-olive font-serif italic text-base sm:text-lg">
                    “Бала жаман емес. Ол сізге бір нәрсе айтып тұр.”
                  </p>
                </div>

                <button 
                  onClick={() => setSelectedBehavior(null)}
                  className="w-full btn-olive py-4 rounded-2xl text-sm sm:text-base"
                >
                  Түсіндім
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
