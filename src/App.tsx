import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  Brain, 
  Home, 
  AlertCircle, 
  Heart, 
  BarChart3, 
  MessageCircle,
  CheckCircle2,
  Play,
  Info,
  ChevronRight,
  PhoneCall,
  User as UserIcon,
  ArrowRight,
  Send,
  Loader2,
  Menu,
  X,
  Sparkles,
  LogOut,
  ShieldCheck,
  Baby,
  Eye,
  EyeOff,
  Hand,
  Mic2,
  Zap,
  MessageSquare
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import Markdown from "react-markdown";
import { cn } from "./lib/utils";
import HomeSection from "./components/sections/HomeSection";
import ScenarioSection from "./components/sections/ScenarioSection";
import TranslatorSection from "./components/sections/TranslatorSection";
import ExercisesSection from "./components/sections/ExercisesSection";
import SosSection from "./components/sections/SosSection";
import SupportSection from "./components/sections/SupportSection";
import ProgressSection from "./components/sections/ProgressSection";
import FeedbackSection from "./components/sections/FeedbackSection";
import ProfileSection from "./components/sections/ProfileSection";
import { 
  SECTIONS, 
  SPECIALIST_SECTIONS,
  DAILY_SCENARIOS, 
  HOME_EXERCISES, 
  SOS_CONTACTS,
  progressData
} from "./constants";
import { UserProfile, CompletedDays } from "./types";
import { auth, db, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./lib/error-handler";
import { Mail, Lock, User as UserIcon2 } from "lucide-react";


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [activeSection, setActiveSection] = useState("home");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<CompletedDays>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Email/Password Auth States
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [childName, setChildName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const completedKeys = Object.keys(completedDays)
      .map(Number)
      .filter(day => completedDays[day]?.completed);
    const lastCompleted = completedKeys.length > 0 ? Math.max(...completedKeys) : 0;
    const nextDay = Math.min(lastCompleted + 1, 30);
    setCurrentDay(nextDay);
    // Only auto-set selectedDay if it's the first load
    setSelectedDay(prev => {
      if (prev === 1 && lastCompleted === 0) return 1;
      return prev;
    });
  }, [completedDays]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsProfileLoading(true);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const profileData = docSnap.data() as UserProfile;
            setUserProfile(profileData);
            
            setActiveSection("home");

            // Fetch progress
            const progressRef = doc(db, "progress", currentUser.uid);
            const progressSnap = await getDoc(progressRef);
            if (progressSnap.exists()) {
              const data = progressSnap.data();
              setCompletedDays(data.completedDays || {});
            }
          } else {
            setUserProfile(null); // New user needs to select role
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        } finally {
          setIsProfileLoading(false);
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setAuthError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Google арқылы кіру кезінде қате кетті.");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthLoading(true);
    try {
      if (authMode === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        
        // Create user profile immediately for parents
        const profile: UserProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || "",
          displayName: displayName || "Ата-ана",
          childName: childName || "Бала",
          photoURL: "",
          role: "user",
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, "users", userCredential.user.uid), profile);
        setUserProfile(profile);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Email auth error:", error);
      setAuthError(error.message || "Авторизация кезінде қате кетті.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveSection("home");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleRoleSelection = async (role: "user" | "specialist") => {
    if (!user) return;
    setIsProfileLoading(true);
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "Аноним",
      photoURL: user.photoURL || "",
      role,
      createdAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, "users", user.uid), profile);
      setUserProfile(profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    } finally {
      setIsProfileLoading(false);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <Loader2 className="animate-spin text-brand-olive" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full card-organic"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden mx-auto mb-6 shadow-lg border-2 border-brand-olive/10">
            <img src="/favicon.jpg" alt="Smart Bala Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-brand-olive mb-4">Smart Bala Autism</h1>
          <p className="text-slate-600 mb-8">Балаңыздың даму жолындағы сенімді серіктесіңіз.</p>

          <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
            {authMode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ата-ананың аты-жөні</label>
                  <div className="relative">
                    <UserIcon2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-olive" 
                      placeholder="Аты-жөніңіз" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Баланың есімі</label>
                  <div className="relative">
                    <Baby className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-olive" 
                      placeholder="Баланың есімі" 
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-olive" 
                  placeholder="example@mail.com" 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Құпия сөз</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-olive" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-olive"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {authError && <p className="text-red-500 text-xs font-bold">{authError}</p>}

            <button 
              type="submit" 
              disabled={isAuthLoading}
              className="btn-olive w-full py-4 text-lg"
            >
              {isAuthLoading ? <Loader2 className="animate-spin mx-auto" /> : (authMode === "login" ? "Кіру" : "Тіркелу")}
            </button>

            <div className="flex flex-col gap-2 items-center mt-4">
              <button 
                type="button"
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="text-brand-olive text-sm font-bold hover:underline"
              >
                {authMode === "login" ? "Аккаунт жоқ па? Тіркелу" : "Аккаунтыңыз бар ма? Кіру"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <Loader2 className="animate-spin text-brand-olive" size={48} />
      </div>
    );
  }

  // Simplified: Everyone is a user by default, role selection screen removed.
  // Specialists are defined manually in the database.
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <Loader2 className="animate-spin text-brand-olive" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-cream pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Mobile Header */}
      <header className="md:hidden bg-white p-4 flex justify-between items-center border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-brand-olive/10 shadow-sm">
            <img src="/favicon.jpg" alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-brand-olive text-lg leading-none">Smart Bala</span>
            {userProfile?.role === "specialist" && (
              <span className="text-[8px] font-bold text-brand-accent uppercase tracking-tighter">Маман панелі</span>
            )}
          </div>
        </div>
        <button 
          onClick={() => setActiveSection("profile")}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 transition-colors"
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm border",
            userProfile?.role === "specialist" 
              ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20" 
              : "bg-brand-olive/10 text-brand-olive border-brand-olive/20"
          )}>
            {userProfile?.displayName?.[0] || "U"}
          </div>
          <span className="text-xs font-bold text-brand-olive max-w-[80px] truncate">
            {userProfile?.displayName?.split(' ')[0]}
          </span>
        </button>
      </header>

      {/* Sidebar Navigation */}
      <nav className={cn(
        "hidden md:flex md:w-80 md:flex-col border-r border-slate-100 bg-white"
      )}>
        <div className="p-8 hidden md:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden border-2 border-brand-olive/10 shadow-md">
              <img src="/favicon.jpg" alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-brand-olive leading-tight">Smart Bala</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Autism Support</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-8 md:py-0 overflow-y-auto">
          <div className="space-y-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group",
                  activeSection === section.id 
                    ? "bg-brand-olive text-white shadow-lg shadow-brand-olive/20" 
                    : "hover:bg-slate-50 text-slate-600"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  activeSection === section.id ? "bg-white/20" : section.color
                )}>
                  <section.icon size={20} />
                </div>
                <span className="font-medium text-sm tracking-wide">{section.title}</span>
                {activeSection !== section.id && (
                  <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}

            {userProfile?.role === "specialist" && (
              <>
                <div className="my-4 border-t border-slate-100" />
                {SPECIALIST_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group",
                      activeSection === section.id 
                        ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" 
                        : "hover:bg-slate-50 text-slate-600"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl transition-colors",
                      activeSection === section.id ? "bg-white/20" : section.color
                    )}>
                      <section.icon size={20} />
                    </div>
                    <span className="font-medium text-sm tracking-wide">{section.title}</span>
                    {activeSection !== section.id && (
                      <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="p-8 border-t border-slate-100">
          <button 
            onClick={() => setActiveSection("profile")}
            className="w-full bg-brand-cream/50 rounded-2xl p-4 flex items-center gap-3 mb-4 hover:bg-brand-cream transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-brand-olive flex items-center justify-center text-white font-serif group-hover:scale-105 transition-transform">
              {userProfile?.displayName?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-brand-olive truncate">{userProfile?.displayName}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                {userProfile?.role === "specialist" ? <ShieldCheck size={10} /> : <Baby size={10} />}
                {userProfile?.role === "specialist" ? "Маман" : userProfile?.childName}
              </p>
            </div>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-bold"
          >
            <LogOut size={18} /> Шығу
          </button>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 flex justify-between items-center pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-2 overflow-x-auto no-scrollbar">
        {[...SECTIONS, ...(userProfile?.role === "specialist" ? SPECIALIST_SECTIONS : [])].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "flex flex-col items-center justify-center p-1 flex-1 min-w-0 rounded-lg transition-colors h-full",
              activeSection === section.id 
                ? (section.id === "specialist_panel" ? "text-brand-accent" : "text-brand-olive") 
                : "text-slate-400"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-colors",
              activeSection === section.id 
                ? (section.id === "specialist_panel" ? "bg-brand-accent/10" : "bg-brand-olive/10") 
                : "bg-transparent"
            )}>
              <section.icon size={22} className="shrink-0" />
            </div>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 p-4 md:p-12 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-12",
        activeSection === "home" && "snap-y snap-mandatory"
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {/* 0. HOME SECTION */}
            {activeSection === "home" && <HomeSection />}

            {/* 1. TODAY'S SCENARIO */}
            {activeSection === "scenario" && (
              <ScenarioSection 
                currentDay={selectedDay}
                completedDays={completedDays}
                setCompletedDays={setCompletedDays}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                setSelectedDay={setSelectedDay}
              />
            )}

            {/* 2. BEHAVIOR TRANSLATOR */}
            {activeSection === "translator" && <TranslatorSection />}

            {/* 3. HOME EXERCISES */}
            {activeSection === "exercises" && <ExercisesSection />}

            {/* 4. SOS EMERGENCY */}
            {activeSection === "sos" && <SosSection />}

            {/* 5. PSYCHOLOGICAL SUPPORT */}
            {activeSection === "support" && <SupportSection />}

            {/* 6. PROGRESS TRACKING */}
            {activeSection === "progress" && (
              <ProgressSection 
                completedDays={completedDays}
                setCompletedDays={setCompletedDays}
                currentDay={currentDay}
                userProfile={userProfile}
              />
            )}

            {/* 7. FEEDBACK & Q&A */}
            {activeSection === "feedback" && userProfile && (
              <FeedbackSection 
                setActiveSection={setActiveSection} 
                userProfile={userProfile}
                mode="parent"
              />
            )}

            {/* SPECIALIST PANEL */}
            {activeSection === "specialist_panel" && userProfile?.role === "specialist" && (
              <FeedbackSection 
                setActiveSection={setActiveSection} 
                userProfile={userProfile}
                mode="specialist"
              />
            )}

            {/* 8. PROFILE SETTINGS */}
            {activeSection === "profile" && (
              <ProfileSection 
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                handleLogout={handleLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
