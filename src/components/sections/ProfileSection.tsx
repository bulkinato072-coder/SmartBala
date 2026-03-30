import { LogOut } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserProfile } from "../../types";

interface ProfileSectionProps {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  handleLogout: () => Promise<void>;
}

export default function ProfileSection({
  userProfile,
  setUserProfile,
  handleLogout
}: ProfileSectionProps) {
  const handleSaveProfile = async () => {
    if (!userProfile) return;
    try {
      await setDoc(doc(db, "users", userProfile.uid), userProfile);
      alert("Профиль жаңартылды!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Қате орын алды");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="section-title">Профильді баптау</h2>
      <div className="card-organic space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ата-ананың аты-жөні</label>
          <input 
            type="text" 
            value={userProfile?.displayName || ""}
            onChange={(e) => setUserProfile(prev => prev ? {...prev, displayName: e.target.value} : null)}
            className="w-full p-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-olive"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Баланың есімі</label>
          <input 
            type="text" 
            value={userProfile?.childName || ""}
            onChange={(e) => setUserProfile(prev => prev ? {...prev, childName: e.target.value} : null)}
            className="w-full p-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-olive"
          />
        </div>
        <button onClick={handleSaveProfile} className="btn-olive w-full">Сақтау</button>
      </div>
      <div className="card-organic border-red-100">
        <h3 className="text-lg font-bold text-red-600 mb-4">Құпия сөзді өзгерту</h3>
        <div className="space-y-4">
          <input type="password" placeholder="Жаңа құпия сөз" className="w-full p-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-red-500" />
          <button className="btn-outline border-red-200 text-red-600 w-full">Құпия сөзді өзгерту</button>
        </div>
      </div>
      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all">
        <LogOut size={20} /> Шығу
      </button>
    </div>
  );
}
