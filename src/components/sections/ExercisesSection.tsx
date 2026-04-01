import { useState, useRef } from "react";
import { Play, ChevronRight, AlertCircle, Lightbulb } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { HOME_EXERCISES, EXERCISES_CONTENT } from "../../constants";

export default function ExercisesSection() {
  const [selectedCategory, setSelectedCategory] = useState("Барлығы");
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  
  const categories = ["Барлығы", "Сенсорика", "Логопедия", "Физика", "Ойын", "Қарым-қатынас"];

  const filteredExercises = selectedCategory === "Барлығы" 
    ? HOME_EXERCISES 
    : HOME_EXERCISES.filter(ex => ex.category === selectedCategory);

  const handleWatch = (id: number) => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        // Pause all other videos first
        Object.values(videoRefs.current).forEach(v => {
          if (v && v !== video) v.pause();
        });
        video.play();
      } else {
        video.pause();
      }
      video.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <h2 className="text-4xl md:text-5xl font-serif font-black text-brand-olive tracking-tight uppercase">{EXERCISES_CONTENT.title}</h2>
      
      <div className="bg-brand-cream/30 p-8 rounded-[40px] border border-brand-olive/10 space-y-6">
        <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">{EXERCISES_CONTENT.intro}</p>
        <div className="space-y-4">
          <h4 className="font-black text-brand-olive text-xl md:text-2xl flex items-center gap-3">
            <Play size={24} className="fill-brand-olive" /> Қалай қолдану керек:
          </h4>
          <ul className="space-y-4 text-slate-700 text-lg md:text-xl">
            {EXERCISES_CONTENT.usage.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-brand-olive mt-1 font-bold">✔</span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="font-black text-brand-olive italic text-center py-6 border-y border-brand-olive/10 text-xl md:text-2xl leading-relaxed">
          {EXERCISES_CONTENT.motivation}
        </p>
      </div>

      <div className="bg-orange-50 p-8 rounded-[40px] border border-orange-100 flex flex-col sm:flex-row gap-6 items-start">
        <div className="bg-orange-500 text-white p-3 rounded-2xl shrink-0">
          <AlertCircle size={32} />
        </div>
        <div>
          <h4 className="font-black text-orange-900 text-xl md:text-2xl mb-3">{EXERCISES_CONTENT.importantNote.title}</h4>
          <ul className="text-orange-800 text-lg md:text-xl space-y-3 font-medium">
            {EXERCISES_CONTENT.importantNote.points.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-orange-400 mt-2.5 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-6 py-3 rounded-full text-base md:text-lg font-black whitespace-nowrap transition-all",
              selectedCategory === cat ? "bg-brand-olive text-white shadow-xl shadow-brand-olive/20" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExercises.map((ex, idx) => (
          <div key={ex.id} className="card-organic group hover:border-brand-olive transition-all overflow-hidden">
            <div className="w-full aspect-video bg-slate-100 relative">
              <video 
                ref={(el) => { videoRefs.current[ex.id] = el; }}
                src={`/video/${ex.id}.mp4`} 
                className="w-full h-full object-cover" 
                controls
                playsInline
                preload="none"
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = "absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center";
                    errorMsg.innerHTML = `
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2 opacity-50"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
                      <p class="text-xs font-bold">Видео табылмады</p>
                      <p class="text-[10px]">/video/${ex.id}.mp4 файлы жоқ</p>
                    `;
                    parent.appendChild(errorMsg);
                  }
                }}
              />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase text-brand-olive z-10">
                {ex.category}
              </span>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-black mb-3 text-brand-olive leading-tight">{ex.title}</h3>
              <p className="text-base md:text-lg text-slate-600 mb-6 font-medium leading-relaxed">{ex.desc}</p>
              
              <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                <p className="text-sm md:text-base font-bold text-slate-700 text-center italic leading-relaxed">
                  {EXERCISES_CONTENT.videoSubtitles[idx % EXERCISES_CONTENT.videoSubtitles.length]}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">15 минут • Орташа</span>
                <button 
                  onClick={() => handleWatch(ex.id)}
                  className="bg-brand-olive/10 text-brand-olive px-6 py-3 rounded-2xl font-black text-base md:text-lg flex items-center gap-2 hover:bg-brand-olive hover:text-white transition-all shadow-sm"
                >
                  Көру <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-8 mt-16">
        <h3 className="text-3xl md:text-4xl font-serif font-black text-brand-olive border-b-4 border-brand-olive/10 pb-4 uppercase tracking-tight">Үйде ойналатын ойындар</h3>
        <div className="grid grid-cols-1 gap-8">
          {EXERCISES_CONTENT.games.map((game, i) => (
            <div key={i} className="p-8 md:p-10 rounded-[40px] bg-white border border-slate-100 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <h4 className="font-black text-brand-olive text-2xl md:text-3xl leading-tight">{game.title}</h4>
                <span className="bg-brand-cream text-brand-olive text-sm px-4 py-2 rounded-xl font-black uppercase tracking-widest shrink-0">Ойын {i + 1}</span>
              </div>
              <p className="text-lg md:text-xl text-slate-700 bg-brand-cream/30 p-6 rounded-[32px] leading-relaxed font-medium border border-brand-olive/5">
                <strong className="text-brand-olive font-black block mb-2 text-xl">Мақсат:</strong> {game.goal}
              </p>
              <div className="space-y-4">
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Қалай ойнау керек:</p>
                <ol className="space-y-4">
                  {game.steps.map((step, j) => (
                    <li key={j} className="flex gap-4 text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-olive/10 text-brand-olive flex items-center justify-center text-sm font-black shadow-inner">
                        {j + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-olive text-white p-10 md:p-12 rounded-[50px] space-y-8 shadow-2xl shadow-brand-olive/20">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl shadow-inner">
            <Lightbulb size={32} />
          </div>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Пайдалы кеңестер</h3>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXERCISES_CONTENT.tips.map((tip, i) => (
            <li key={i} className="bg-white/10 p-6 rounded-3xl flex items-start gap-4 text-lg md:text-xl font-medium leading-relaxed backdrop-blur-sm">
              <span className="text-brand-cream mt-1 font-black text-2xl leading-none">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
