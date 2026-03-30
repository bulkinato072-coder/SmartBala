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
    <div className="space-y-8">
      <h2 className="section-title">{EXERCISES_CONTENT.title}</h2>
      
      <div className="bg-brand-cream/30 p-6 rounded-3xl border border-brand-olive/10 space-y-4">
        <p className="text-slate-600 leading-relaxed">{EXERCISES_CONTENT.intro}</p>
        <div className="space-y-2">
          <h4 className="font-bold text-brand-olive flex items-center gap-2">
            <Play size={18} className="fill-brand-olive" /> Қалай қолдану керек:
          </h4>
          <ul className="space-y-2 text-slate-600">
            {EXERCISES_CONTENT.usage.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-olive mt-1">✔</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-bold text-brand-olive italic text-center py-2 border-y border-brand-olive/10">
          {EXERCISES_CONTENT.motivation}
        </p>
      </div>

      <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 flex gap-4 items-start">
        <div className="bg-orange-500 text-white p-2 rounded-2xl">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-orange-900 mb-1">{EXERCISES_CONTENT.importantNote.title}</h4>
          <ul className="text-orange-800 text-sm space-y-1">
            {EXERCISES_CONTENT.importantNote.points.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              selectedCategory === cat ? "bg-brand-olive text-white shadow-lg shadow-brand-olive/20" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
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
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 text-brand-olive">{ex.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{ex.desc}</p>
              
              <div className="bg-slate-50 p-3 rounded-2xl mb-4">
                <p className="text-[11px] font-medium text-slate-600 text-center italic">
                  {EXERCISES_CONTENT.videoSubtitles[idx % EXERCISES_CONTENT.videoSubtitles.length]}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">15 минут • Орташа</span>
                <button 
                  onClick={() => handleWatch(ex.id)}
                  className="bg-brand-olive/10 text-brand-olive px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1 hover:bg-brand-olive hover:text-white transition-colors"
                >
                  Көру <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-6 mt-12">
        <h3 className="text-2xl font-bold text-brand-olive border-b border-brand-olive/10 pb-2">Үйде ойналатын ойындар</h3>
        <div className="grid grid-cols-1 gap-4">
          {EXERCISES_CONTENT.games.map((game, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-brand-olive text-lg">{game.title}</h4>
                <span className="bg-brand-cream text-brand-olive text-[10px] px-2 py-1 rounded-lg font-bold uppercase">Ойын {i + 1}</span>
              </div>
              <p className="text-sm text-slate-600 mb-4 bg-brand-cream/20 p-3 rounded-xl">
                <strong className="text-brand-olive">Мақсат:</strong> {game.goal}
              </p>
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Қалай ойнау керек:</p>
                <ol className="space-y-2">
                  {game.steps.map((step, j) => (
                    <li key={j} className="flex gap-3 text-sm text-slate-600">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-olive/10 text-brand-olive flex items-center justify-center text-[10px] font-bold">
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

      <div className="bg-brand-olive text-white p-8 rounded-[40px] space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-2xl">
            <Lightbulb size={24} />
          </div>
          <h3 className="text-2xl font-bold">Пайдалы кеңестер</h3>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXERCISES_CONTENT.tips.map((tip, i) => (
            <li key={i} className="bg-white/10 p-4 rounded-2xl flex items-start gap-3 text-sm">
              <span className="text-brand-cream mt-1">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
