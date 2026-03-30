import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageCircle, 
  Send, 
  AlertTriangle, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Camera, 
  ChevronRight,
  HelpCircle,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  User as UserIcon,
  Clock,
  ShieldCheck
} from "lucide-react";
import { cn } from "../../lib/utils";
import { UserProfile } from "../../types";
import { db } from "../../firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  orderBy,
  Timestamp
} from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../../lib/error-handler";

interface FeedbackSectionProps {
  setActiveSection: (section: string) => void;
  userProfile: UserProfile;
  mode?: "parent" | "specialist";
}

type ProblemType = "Мінез" | "Сөйлеу" | "Сенсорика" | "Әлеуметтік";

interface Question {
  id: string;
  userId: string;
  userName: string;
  age: string;
  type: ProblemType;
  description: string;
  status: "pending" | "answered";
  answer?: string;
  specialistId?: string;
  specialistName?: string;
  createdAt: any;
  answeredAt?: any;
  isSaved?: boolean;
  helped?: boolean | null;
}

export default function FeedbackSection({ setActiveSection, userProfile, mode = "parent" }: FeedbackSectionProps) {
  const [age, setAge] = useState("");
  const [problemType, setProblemType] = useState<ProblemType>("Мінез");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Specialist answer state
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  const isSpecialist = mode === "specialist";

  useEffect(() => {
    const q = isSpecialist 
      ? query(collection(db, "feedback"), orderBy("createdAt", "desc"))
      : query(collection(db, "feedback"), where("userId", "==", userProfile.uid), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Question[];
      setQuestions(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "feedback");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile.uid, isSpecialist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "feedback"), {
        userId: userProfile.uid,
        userName: userProfile.displayName,
        age,
        type: problemType,
        description,
        status: "pending",
        createdAt: serverTimestamp()
      });
      
      setSubmitted(true);
      setAge("");
      setDescription("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = async (questionId: string) => {
    if (!answerText.trim()) return;
    
    try {
      await updateDoc(doc(db, "feedback", questionId), {
        status: "answered",
        answer: answerText,
        specialistId: userProfile.uid,
        specialistName: userProfile.displayName,
        answeredAt: serverTimestamp()
      });
      setAnsweringId(null);
      setAnswerText("");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `feedback/${questionId}`);
    }
  };

  const toggleSave = async (id: string, currentSaved: boolean) => {
    try {
      await updateDoc(doc(db, "feedback", id), {
        isSaved: !currentSaved
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `feedback/${id}`);
    }
  };

  const setHelped = async (id: string, helped: boolean) => {
    try {
      await updateDoc(doc(db, "feedback", id), {
        helped
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `feedback/${id}`);
    }
  };

  const problemTypes: ProblemType[] = ["Мінез", "Сөйлеу", "Сенсорика", "Әлеуметтік"];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("kk-KZ", { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="px-2 space-y-2">
        <h2 className="text-3xl font-serif font-bold text-brand-olive">
          {isSpecialist ? "Сұрақтар тізімі" : "Сұрағыңыз бар ма?"}
        </h2>
        <div className="flex flex-wrap gap-3">
          <span className="text-[10px] font-bold text-brand-olive/60 uppercase tracking-widest">“Мен сізді тыңдаймын”</span>
          <span className="text-[10px] font-bold text-brand-olive/60 uppercase tracking-widest">•</span>
          <span className="text-[10px] font-bold text-brand-olive/60 uppercase tracking-widest">“Сарапшыдан жауап”</span>
          <span className="text-[10px] font-bold text-brand-olive/60 uppercase tracking-widest">•</span>
          <span className="text-[10px] font-bold text-brand-olive/60 uppercase tracking-widest">“Көмек сұрау”</span>
        </div>
      </div>

      {/* Intro Card - Only for parents */}
      {!isSpecialist && (
        <div className="mx-2 rounded-[40px] bg-[#5A5A40] text-white p-8 relative overflow-hidden shadow-2xl shadow-brand-olive/20">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-5">
            <p className="text-lg font-bold text-white">Құрметті ата-ана!</p>
            <p className="text-sm text-white/90 leading-relaxed font-medium">
              Егер балаңыздың мінезі, дамуы немесе күнделікті жағдай бойынша сұрақтарыңыз болса — сіз жалғыз емессіз.
            </p>
            <div className="space-y-3 pt-2">
              {[
                "Сұрағыңызды жаза аласыз",
                "Нақты жағдайды сипаттай аласыз",
                "Маманнан бағыт немесе кеңес аласыз"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E67E22] flex items-center justify-center shrink-0 shadow-lg shadow-brand-accent/20">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-white">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SOS Button - Only for parents */}
      {!isSpecialist && (
        <div className="px-2">
          <button 
            onClick={() => setActiveSection("sos")}
            className="w-full p-6 rounded-[32px] bg-red-50 border-2 border-red-100 flex items-center justify-between group active:scale-95 transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-200 animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-red-600">Қазір көмек керек</p>
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Жедел көмек бөліміне өту</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-red-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Question Form - Only for parents */}
      {!isSpecialist && (
        <div className="mx-2 card-organic space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-olive/10 text-brand-olive flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Сұрақ қою</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Бала жасы</label>
                <select 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-olive text-sm font-medium"
                >
                  <option value="">Таңдаңыз</option>
                  <option value="0-1 жас">0-1 жас</option>
                  <option value="1-2 жас">1-2 жас</option>
                  <option value="2-3 жас">2-3 жас</option>
                  <option value="3-5 жас">3-5 жас</option>
                  <option value="5+ жас">5+ жас</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Мәселе түрі</label>
                <div className="grid grid-cols-2 gap-2">
                  {problemTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProblemType(type)}
                      className={cn(
                        "py-3 px-4 rounded-xl text-xs font-bold transition-all border",
                        problemType === type 
                          ? "bg-brand-olive text-white border-brand-olive shadow-md" 
                          : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Сипаттама</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Балаңыздың жағдайын қысқаша жазыңыз..."
                  className="w-full h-32 p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-olive resize-none text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold transition-all",
                submitted ? "bg-green-500 text-white" : "bg-brand-olive text-white shadow-brand-olive/20"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : submitted ? (
                <CheckCircle2 size={20} />
              ) : (
                <Send size={20} />
              )}
              {submitted ? "Жіберілді!" : "Жіберу"}
            </button>
          </form>
        </div>
      )}

      {/* History / Answers */}
      <div className="space-y-4 px-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
          {isSpecialist ? "Барлық сұрақтар" : "Менің сұрақтарым"}
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-brand-olive" size={32} />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">Әзірге сұрақтар жоқ</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="card-organic space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                        {q.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {q.age}
                      </span>
                    </div>
                    {isSpecialist && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-brand-olive">
                        <UserIcon size={10} /> {q.userName}
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                    q.status === "answered" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                  )}>
                    {q.status === "answered" ? "Жауап берілді" : "Күтуде"}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {q.description}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock size={10} /> {formatDate(q.createdAt)}
                  </div>
                </div>

                {q.answer ? (
                  <div className="p-4 rounded-2xl bg-brand-cream/50 border border-brand-olive/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-brand-olive">
                        <div className="w-6 h-6 rounded-full bg-brand-olive flex items-center justify-center text-white">
                          <ShieldCheck size={12} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Маман жауабы</span>
                      </div>
                      {isSpecialist && (
                        <span className="text-[8px] font-bold text-brand-olive/40 uppercase">ID: {q.specialistId?.slice(0, 6)}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {q.answer}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-brand-olive/10">
                      <p className="text-[10px] font-bold text-brand-olive/60 uppercase">
                        Маман: {q.specialistName || 'Smart Bala Сарапшысы'}
                      </p>
                      
                      {!isSpecialist && (
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setHelped(q.id, true)}
                            className={cn(
                              "flex items-center gap-1 text-[10px] font-bold transition-colors",
                              q.helped === true ? "text-green-600" : "text-slate-400 hover:text-slate-600"
                            )}
                          >
                            <ThumbsUp size={14} /> Көмектесті
                          </button>
                          <button 
                            onClick={() => setHelped(q.id, false)}
                            className={cn(
                              "flex items-center gap-1 text-[10px] font-bold transition-colors",
                              q.helped === false ? "text-red-600" : "text-slate-400 hover:text-slate-600"
                            )}
                          >
                            <ThumbsDown size={14} /> Көмектеспеді
                          </button>
                          <button 
                            onClick={() => toggleSave(q.id, !!q.isSaved)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              q.isSaved ? "bg-brand-olive text-white" : "bg-slate-100 text-slate-400"
                            )}
                          >
                            <Bookmark size={16} fill={q.isSaved ? "currentColor" : "none"} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : isSpecialist ? (
                  <div className="pt-2">
                    {answeringId === q.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Жауабыңызды жазыңыз..."
                          className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-olive text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAnswer(q.id)}
                            className="flex-1 py-3 bg-brand-olive text-white rounded-xl font-bold text-xs"
                          >
                            Жіберу
                          </button>
                          <button
                            onClick={() => setAnsweringId(null)}
                            className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs"
                          >
                            Болдырмау
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAnsweringId(q.id)}
                        className="w-full py-3 border-2 border-dashed border-brand-olive/20 text-brand-olive rounded-xl font-bold text-xs hover:bg-brand-olive/5 transition-colors"
                      >
                        Жауап беру
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Motivational Block - Only for parents */}
      {!isSpecialist && (
        <div className="mx-2 space-y-4">
          <div className="p-8 rounded-[40px] bg-brand-cream border-2 border-dashed border-brand-olive/20 text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Heart size={32} className="text-brand-accent" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-serif font-bold text-brand-olive">Сіздің сұрағыңыз – маңызды!</p>
              <p className="text-sm text-slate-600">Сіз жалғыз емессіз!</p>
              <p className="text-xs text-slate-400 italic">Әр жауап – баланың дамуына қадам!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
