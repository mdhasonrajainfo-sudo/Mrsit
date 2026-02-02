
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useStore } from '../store';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Wallet, Users, User as UserIcon, Bell, 
  HelpCircle, Copy, PlayCircle, Briefcase, Mail, 
  Gift, List, ArrowLeft, ArrowRight, LogOut, Settings as SettingsIcon,
  Crown, Share2, UploadCloud, CheckCircle, Clock, ChevronRight,
  Facebook, Youtube, Menu, X, Phone, Edit, Shield, Eye, EyeOff, Send, MessageCircle,
  Headphones, Globe, Star, XCircle, FileText, Camera, Video, MonitorPlay, AlertTriangle, Lock, Image as ImageIcon,
  Gem, CreditCard, DollarSign, Calendar, TrendingUp, Activity, CheckSquare, Instagram, Loader, ShoppingBag, 
  Key, UserCheck, AlertOctagon, AlertCircle, Link
} from 'lucide-react';
import { UserStatus, Task, TaskSubmission, Withdrawal } from '../types';

// --- TOAST CONTEXT ---

interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

const ToastContext = createContext<{ showToast: (msg: string, type?: 'success' | 'error' | 'info') => void } | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-5 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none gap-2 px-4">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div 
                            key={t.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className={`pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-full shadow-xl border ${
                                t.type === 'success' ? 'bg-white border-emerald-500 text-emerald-700' : 
                                t.type === 'error' ? 'bg-white border-red-500 text-red-700' : 
                                'bg-white border-blue-500 text-blue-700'
                            }`}
                        >
                            {t.type === 'success' && <CheckCircle size={20} className="fill-emerald-100"/>}
                            {t.type === 'error' && <AlertTriangle size={20} className="fill-red-100"/>}
                            {t.type === 'info' && <Lock size={20} className="fill-blue-100"/>}
                            <span className="font-bold text-sm">{t.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};

// --- SHARED COMPONENTS ---

const FooterSection: React.FC = () => {
    const { settings } = useStore();
    return (
        <div className="bg-white rounded-t-[2.5rem] shadow-[0_-5px_30px_rgba(0,0,0,0.03)] border-t border-gray-100 pt-8 pb-10 px-6 mt-8">
            <div className="grid grid-cols-2 gap-3 mb-8">
                <button onClick={() => window.open(settings.telegramLink)} className="bg-sky-50 p-3 rounded-xl flex items-center gap-3 border border-sky-100 hover:bg-sky-100 transition">
                    <div className="bg-sky-500 text-white p-2 rounded-lg"><Send size={16}/></div>
                    <span className="text-xs font-bold text-sky-800">Telegram Channel</span>
                </button>
                <button onClick={() => window.open(settings.telegramLink)} className="bg-indigo-50 p-3 rounded-xl flex items-center gap-3 border border-indigo-100 hover:bg-indigo-100 transition">
                    <div className="bg-indigo-500 text-white p-2 rounded-lg"><MessageCircle size={16}/></div>
                    <span className="text-xs font-bold text-indigo-800">Telegram Group</span>
                </button>
                <button onClick={() => window.open(settings.facebookLink)} className="bg-blue-50 p-3 rounded-xl flex items-center gap-3 border border-blue-100 hover:bg-blue-100 transition">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><Facebook size={16}/></div>
                    <span className="text-xs font-bold text-blue-800">Facebook Group</span>
                </button>
                <button onClick={() => window.open(settings.youtubeLink)} className="bg-red-50 p-3 rounded-xl flex items-center gap-3 border border-red-100 hover:bg-red-100 transition">
                    <div className="bg-red-600 text-white p-2 rounded-lg"><Youtube size={16}/></div>
                    <span className="text-xs font-bold text-red-800">YouTube Channel</span>
                </button>
            </div>

            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl mx-auto flex items-center justify-center border border-gray-100 p-2">
                    <img src="https://files.catbox.moe/mmesk9.jpg" alt="Logo" className="w-full h-full object-contain"/>
                </div>
                <div>
                    <h2 className="text-xl font-black text-gray-800 tracking-tight">{settings.companyName}</h2>
                    <p className="text-xs text-gray-400 mt-1 max-w-[250px] mx-auto leading-relaxed">{settings.landingText}</p>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                            Md. Founder Name <CheckCircle size={14} className="text-blue-500 fill-white"/>
                        </p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Founder & CEO</p>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-50">
                    {[Facebook, Youtube, Send, MessageCircle, Share2, Globe].map((Icon, i) => (
                        <div key={i} className="text-gray-400 hover:text-emerald-600 transition cursor-pointer">
                            <Icon size={20}/>
                        </div>
                    ))}
                </div>
                
                <p className="text-[10px] text-gray-300 mt-6">© 2024 All Rights Reserved</p>
            </div>
        </div>
    );
};

// Layout Component
const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/')[2] || 'home';

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'profile', icon: UserIcon, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900 transition-colors duration-300">
        <div className="min-h-screen bg-slate-50 pb-20 max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
        {children}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex justify-around p-3 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl">
            {navItems.map(item => (
            <button 
                key={item.id}
                onClick={() => navigate(`/user/${item.id}`)}
                className={`flex flex-col items-center justify-center rounded-2xl w-14 h-14 transition-all duration-300 ${activeTab === item.id ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            </button>
            ))}
        </div>
        </div>
    </div>
  );
};

// Dashboard
export const UserDashboard: React.FC = () => {
  const { currentUser, settings, users, logout, unreadCount } = useStore();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            const maxScroll = scrollWidth - clientWidth;
            let nextScroll = scrollLeft + clientWidth;
            let nextIndex = currentSlide + 1;

            if (scrollLeft >= maxScroll - 10) {
                nextScroll = 0;
                nextIndex = 0;
            }

            sliderRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
            setCurrentSlide(nextIndex);
        }
    }, 5000); 
    return () => clearInterval(interval);
  }, [currentSlide]);

  if (!currentUser) return null;

  const upline = users.find(u => u.refCode === currentUser.uplineCode);

  return (
    <UserLayout>
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-black z-[60]" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] shadow-2xl overflow-y-auto">
                <div className="bg-emerald-600 p-6 pt-10 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-16 h-16 bg-white rounded-full border-2 border-emerald-300 overflow-hidden">
                            <img src={currentUser.profilePic || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`} alt="Profile" className="w-full h-full object-cover"/>
                        </div>
                        <button onClick={() => setIsDrawerOpen(false)} className="p-1 bg-white/20 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-lg leading-tight">{currentUser.name}</h2>
                        {currentUser.status === 'PREMIUM' && <CheckCircle size={16} className="text-yellow-300 fill-yellow-600"/>}
                    </div>
                    <p className="text-emerald-100 text-xs mt-1">Joined: {currentUser.joinDate}</p>
                    <div className="flex items-center gap-2 mt-3 bg-emerald-700/50 p-2 rounded-lg text-xs">
                        <Phone size={14}/> {currentUser.phone}
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    <button onClick={() => {navigate('/user/home'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><Home size={20} className="text-emerald-600"/> Dashboard</button>
                    <button onClick={() => {navigate('/user/notifications'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium relative">
                        <Bell size={20} className="text-emerald-600"/> Notifications
                        {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 rounded-full absolute right-4">{unreadCount}</span>}
                    </button>
                    <button onClick={() => {navigate('/user/work-video'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><Video size={20} className="text-emerald-600"/> Work Video</button>
                    <button onClick={() => {navigate('/user/job-withdraw'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><UploadCloud size={20} className="text-emerald-600"/> Job Withdraw</button>
                    <button onClick={() => {navigate('/user/wallet', { state: { view: 'WITHDRAW_FORM' } }); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><Wallet size={20} className="text-emerald-600"/> Withdraw</button>
                    <button onClick={() => {navigate('/user/income-history'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><List size={20} className="text-emerald-600"/> Income History</button>
                    <button onClick={() => {navigate('/support'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><HelpCircle size={20} className="text-emerald-600"/> Support</button>
                    <button onClick={() => {navigate('/user/profile'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><SettingsIcon size={20} className="text-emerald-600"/> Settings</button>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button onClick={logout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-red-600 font-medium"><LogOut size={20}/> Logout</button>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <header className="bg-emerald-600 text-white p-5 pb-16 sticky top-0 z-40 shadow-md">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsDrawerOpen(true)} className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition">
                <Menu size={24} className="text-white"/>
             </button>
             <div className="bg-white px-2 py-1 rounded-lg flex items-center gap-1">
                <img src="https://files.catbox.moe/mmesk9.jpg" alt="Logo" className="w-6 h-6 object-contain"/>
                <span className="text-gray-900 font-black text-xs tracking-tighter">{settings.companyName}</span>
             </div>
           </div>
           
           <div className="flex gap-3">
             <button onClick={() => navigate('/support')} className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition">
                <Headphones size={22} className="text-white"/>
             </button>
             <button onClick={() => navigate('/user/notifications')} className="bg-white/20 p-2 rounded-xl relative hover:bg-white/30 transition">
                <Bell size={22} className="text-white" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border border-white flex items-center justify-center text-[8px] font-bold">{unreadCount}</span>}
             </button>
           </div>
        </div>
      </header>

      <div className="px-5 -mt-10 mb-4 z-40 relative">
          <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between border border-gray-100 relative overflow-hidden">
             <button onClick={() => setShowContact(!showContact)} className="absolute top-3 right-3 text-gray-400 hover:text-emerald-600 transition">
                 {showContact ? <EyeOff size={18}/> : <Eye size={18}/>}
             </button>

             <div className="w-20 h-20 rounded-full border-4 border-emerald-50 shadow-sm overflow-hidden flex-shrink-0 bg-gray-100 mr-4">
                 <img src={currentUser.profilePic || `https://ui-avatars.com/api/?name=${currentUser.name}&background=059669&color=fff`} alt="Profile" className="w-full h-full object-cover"/>
             </div>

             <div className="flex-1">
                 <div className="flex items-center gap-1">
                    <h2 className="text-lg font-black text-gray-800">{currentUser.name}</h2>
                    {currentUser.status === 'PREMIUM' && <CheckCircle size={14} className="text-blue-500 fill-white"/>}
                 </div>
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase inline-block mb-1 ${currentUser.status === 'PREMIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                    {currentUser.status} Member
                 </span>
                 <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                    Ref: <span className="text-gray-800 font-bold bg-gray-50 px-1 rounded font-mono">{currentUser.refCode}</span>
                    <Copy size={12} className="cursor-pointer text-emerald-600" onClick={() => {navigator.clipboard.writeText(currentUser.refCode); alert("Copied!")}}/>
                 </p>
                 <p className="text-[10px] text-gray-400 mt-1">Joined: {currentUser.joinDate}</p>
             </div>
          </div>

          <div className="flex gap-3 mt-4">
              <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">My WhatsApp</p>
                  <p className="text-sm font-bold text-gray-800 font-mono tracking-tight">
                      {showContact ? currentUser.phone : currentUser.phone.substring(0, 3) + '****' + currentUser.phone.slice(-3)}
                  </p>
                  <div className="absolute top-2 right-2 text-emerald-100"><Phone size={24}/></div>
              </div>
              <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <p className="text-[10px] text-purple-600 font-bold uppercase mb-1">Upline WhatsApp</p>
                  <p className="text-sm font-bold text-gray-800 font-mono tracking-tight">
                      {upline ? (showContact ? upline.phone : upline.phone.substring(0, 3) + '****' + upline.phone.slice(-3)) : 'N/A'}
                  </p>
                  <div className="absolute top-2 right-2 text-purple-100"><Users size={24}/></div>
              </div>
          </div>
      </div>

      <div className="mx-5 bg-white rounded-xl shadow-sm p-1 border border-gray-100 flex items-center overflow-hidden mb-6">
        <div className="bg-emerald-100 p-1.5 rounded-lg mr-2"><Bell size={14} className="text-emerald-600"/></div>
        <div className="overflow-hidden whitespace-nowrap w-full">
            <motion.div 
            animate={{ x: ["100%", "-100%"] }} 
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="text-xs text-gray-600 font-medium"
            >
            {settings.notice}
            </motion.div>
        </div>
      </div>

      <div className="px-5 mb-3 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1"></div>
          <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Start Work</h3>
          <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      <div className="grid grid-cols-4 gap-3 px-5 mb-8">
        {[
            { label: 'Free Job', icon: Briefcase, color: 'text-blue-500', bg: 'bg-white', link: '/user/free-job' },
            { label: 'Team', icon: Users, color: 'text-purple-500', bg: 'bg-white', link: '/user/team' },
            { label: 'Wallet', icon: Wallet, color: 'text-emerald-500', bg: 'bg-white', link: '/user/wallet' },
            { label: 'Premium', icon: Gem, color: 'text-pink-500', bg: 'bg-white', link: '/user/premium' },
        ].map((item, idx) => (
            <div key={idx} onClick={() => navigate(item.link)} className="flex flex-col items-center gap-1 cursor-pointer group z-10">
                <div className={`${item.bg} p-3 rounded-2xl ${item.color} shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-100 group-active:scale-95 transition-all duration-200 w-full flex justify-center items-center aspect-square`}>
                    <item.icon size={22} strokeWidth={2}/>
                </div>
                <span className="font-bold text-gray-600 text-[10px] tracking-wide">{item.label}</span>
            </div>
        ))}
      </div>

      <div className="px-5 mb-8 relative">
        <div 
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory scroll-smooth"
            onScroll={() => {}}
        >
            {[1,2,3,4].map(i => (
            <div key={i} className="min-w-full snap-center relative">
                 <img src={`https://picsum.photos/600/300?random=${i+10}`} className="rounded-2xl shadow-md w-full h-40 object-cover" alt="Banner" />
            </div>
            ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {[0,1,2,3].map((idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-4 bg-emerald-600' : 'w-1.5 bg-gray-300'}`}></div>
            ))}
        </div>
      </div>

      <FooterSection />

    </UserLayout>
  );
};

export const TeamPage: React.FC = () => {
    const { currentUser, users } = useStore();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const team = users.filter(u => u.uplineCode === currentUser?.refCode);
    
    // Generate Invite Link
    const inviteLink = `${window.location.origin}/#/register?ref=${currentUser?.refCode}`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Copied to clipboard!", 'success');
    };

    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join My Team',
                    text: `Use my referral code ${currentUser?.refCode} to join!`,
                    url: inviteLink,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            copyToClipboard(inviteLink);
        }
    };

    return (
        <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">My Team</h1>
            </div>
            
            <div className="p-5 space-y-6">
                 {/* Referral Card */}
                 <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                     <div className="relative z-10">
                         <h2 className="font-bold text-lg mb-1">Invite & Earn</h2>
                         <p className="text-emerald-100 text-xs mb-4">Share your link and earn bonuses per active referral.</p>
                         
                         <div className="bg-white/10 p-3 rounded-xl border border-white/20 mb-3 flex justify-between items-center">
                             <div>
                                 <p className="text-[10px] text-emerald-200 uppercase font-bold">Your Code</p>
                                 <p className="font-mono font-bold text-xl tracking-widest">{currentUser?.refCode}</p>
                             </div>
                             <button onClick={() => copyToClipboard(currentUser?.refCode || '')} className="bg-white text-emerald-600 p-2 rounded-lg hover:scale-105 transition">
                                 <Copy size={18}/>
                             </button>
                         </div>

                         <div className="flex gap-2">
                             <button onClick={() => copyToClipboard(inviteLink)} className="flex-1 bg-white/20 border border-white/30 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition">
                                 <Link size={14}/> Copy Link
                             </button>
                             <button onClick={shareLink} className="flex-1 bg-yellow-400 text-emerald-900 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition">
                                 <Share2 size={14}/> Share Link
                             </button>
                         </div>
                     </div>
                     <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                 </div>

                 {/* Stats */}
                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                         <h3 className="text-2xl font-black text-purple-700">{team.length}</h3>
                         <p className="text-xs text-gray-500 font-bold uppercase">Total Members</p>
                     </div>
                     <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                         <h3 className="text-2xl font-black text-emerald-700">{team.filter(u => u.status === 'PREMIUM').length}</h3>
                         <p className="text-xs text-gray-500 font-bold uppercase">Premium Members</p>
                     </div>
                 </div>

                 {/* List */}
                 <div className="space-y-3">
                     <h3 className="font-bold text-gray-800">Member List</h3>
                     {team.map(member => (
                         <div key={member.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">{member.name.charAt(0)}</div>
                                 <div>
                                     <h4 className="font-bold text-sm text-gray-800">{member.name}</h4>
                                     <p className="text-xs text-gray-400">{member.phone}</p>
                                 </div>
                             </div>
                             <span className={`text-[10px] font-bold px-2 py-1 rounded ${member.status === 'PREMIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{member.status}</span>
                         </div>
                     ))}
                     {team.length === 0 && <p className="text-center text-gray-400 py-10">No team members yet.</p>}
                 </div>
            </div>
        </UserLayout>
    );
};

export const WalletPage: React.FC = () => {
    const { currentUser, withdrawals, requestWithdraw } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState(location.state?.view === 'WITHDRAW_FORM' ? 'WITHDRAW' : 'HISTORY');
    const [amount, setAmount] = useState('');
    const [number, setNumber] = useState('');
    const [method, setMethod] = useState<'BKASH'|'NAGAD'|'ROCKET'>('BKASH');
    const [type, setType] = useState<'FREE_WALLET'|'PREMIUM_WALLET'>('FREE_WALLET');

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        if(!currentUser) return;
        const val = Number(amount);
        if(val < 100) { showToast('Minimum withdraw 100 BDT', 'error'); return; }
        const balance = type === 'FREE_WALLET' ? currentUser.balanceFree : currentUser.balancePremium;
        if(val > balance) { showToast('Insufficient Balance', 'error'); return; }

        requestWithdraw({
        id: Date.now().toString(),
        userId: currentUser.id,
        amount: val,
        method,
        number,
        type,
        status: 'PENDING',
        date: new Date().toISOString().split('T')[0]
        });
        showToast('Withdrawal Requested', 'success');
        setAmount('');
        setActiveTab('HISTORY');
    }

    if (!currentUser) return null;

    return (
        <UserLayout>
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">My Wallet</h1>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-200">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Free Balance</p>
                        <h3 className="text-2xl font-black mt-1">৳{currentUser.balanceFree}</h3>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-yellow-200">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-100">Premium Balance</p>
                        <h3 className="text-2xl font-black mt-1">৳{currentUser.balancePremium}</h3>
                    </div>
                </div>

                <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                    <button onClick={() => setActiveTab('WITHDRAW')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${activeTab === 'WITHDRAW' ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}>Withdraw Request</button>
                    <button onClick={() => setActiveTab('HISTORY')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${activeTab === 'HISTORY' ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}>History</button>
                </div>

                {activeTab === 'WITHDRAW' ? (
                    <form onSubmit={handleWithdraw} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Withdraw Method</label>
                            <div className="flex gap-2">
                                {['BKASH', 'NAGAD', 'ROCKET'].map(m => (
                                    <button key={m} type="button" onClick={() => setMethod(m as any)} className={`flex-1 py-3 rounded-xl text-xs font-bold border ${method === m ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                                        {m}
                                    </button>
                                ))}
                            </div>
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Wallet</label>
                             <select value={type} onChange={e => setType(e.target.value as any)} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-none outline-none">
                                 <option value="FREE_WALLET">Free Wallet (৳{currentUser.balanceFree})</option>
                                 <option value="PREMIUM_WALLET">Premium Wallet (৳{currentUser.balancePremium})</option>
                             </select>
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amount</label>
                             <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Min 100" className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-none outline-none" required />
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mobile Number</label>
                             <input type="text" value={number} onChange={e => setNumber(e.target.value)} placeholder="017..." className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border-none outline-none" required />
                         </div>
                         <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg mt-2">Submit Request</button>
                    </form>
                ) : (
                    <div className="space-y-3">
                        {withdrawals.filter(w => w.userId === currentUser.id).map(w => (
                            <div key={w.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{w.method} - {w.number}</p>
                                    <p className="text-[10px] text-gray-400">{w.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-emerald-600">৳{w.amount}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${w.status === 'APPROVED' ? 'bg-green-100 text-green-600' : w.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>{w.status}</span>
                                </div>
                            </div>
                        ))}
                        {withdrawals.filter(w => w.userId === currentUser.id).length === 0 && <p className="text-center text-gray-400 py-10">No history found.</p>}
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export const FreeJobPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <UserLayout>
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Free Jobs</h1>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
                {[
                    { title: "Task List", icon: List, color: "bg-blue-500", link: "/user/tasks" },
                    { title: "Quiz", icon: HelpCircle, color: "bg-purple-500", link: "/user/quiz" },
                    { title: "Work Video", icon: Video, color: "bg-red-500", link: "/user/work-video" },
                    { title: "Daily Bonus", icon: Gift, color: "bg-yellow-500", link: "/user/home" },
                ].map((item, i) => (
                    <div key={i} onClick={() => navigate(item.link)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition">
                        <div className={`${item.color} p-3 rounded-xl text-white shadow-lg`}>
                            <item.icon size={24}/>
                        </div>
                        <h3 className="font-bold text-gray-700 text-sm">{item.title}</h3>
                    </div>
                ))}
            </div>
        </UserLayout>
    );
};

export const TaskListPage: React.FC = () => {
    const { tasks, currentUser, submitTask, submissions } = useStore();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [proof, setProof] = useState('');

    const handleSubmit = () => {
        if(!selectedTask || !currentUser) return;
        if(!proof) { showToast("Proof link required", 'error'); return; }
        
        submitTask({
            id: Date.now().toString(),
            userId: currentUser.id,
            taskId: selectedTask.id,
            taskTitle: selectedTask.title,
            proofLink: proof,
            details: 'User Submitted',
            status: 'PENDING',
            date: new Date().toISOString().split('T')[0],
            amount: selectedTask.amount,
        });
        showToast("Task Submitted Successfully", 'success');
        setSelectedTask(null);
        setProof('');
    };

    const availableTasks = tasks.filter(t => t.type === 'FREE'); // Showing Free tasks by default for now

    return (
        <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Available Tasks</h1>
            </div>

            <div className="p-5 space-y-4">
                {availableTasks.map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={task.image || `https://placehold.co/100?text=Task`} className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 line-clamp-1">{task.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{task.description}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="font-black text-emerald-600">৳{task.amount}</span>
                                    <button onClick={() => setSelectedTask(task)} className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold">Start Task</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {availableTasks.length === 0 && <p className="text-center text-gray-400 py-10">No tasks available currently.</p>}
            </div>

            <AnimatePresence>
                {selectedTask && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedTask(null)}/>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 relative z-10 pointer-events-auto max-h-[90vh] overflow-y-auto">
                            <button onClick={() => setSelectedTask(null)} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full"><X size={20}/></button>
                            
                            <h2 className="text-xl font-bold text-gray-900 pr-10">{selectedTask.title}</h2>
                            <p className="text-emerald-600 font-bold text-lg mt-1">Reward: ৳{selectedTask.amount}</p>
                            
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 my-4">
                                <p className="text-xs font-bold text-blue-800 uppercase mb-1">Instructions:</p>
                                <p className="text-sm text-blue-900 leading-relaxed">{selectedTask.description}</p>
                            </div>

                            <a href={selectedTask.link} target="_blank" rel="noreferrer" className="block w-full bg-emerald-100 text-emerald-700 text-center py-3 rounded-xl font-bold mb-4 border border-emerald-200 hover:bg-emerald-200 transition">
                                Open Task Link
                            </a>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700">Submit Proof</label>
                                <input type="text" placeholder="Paste proof link / screenshot URL" value={proof} onChange={e => setProof(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none text-sm"/>
                                <button onClick={handleSubmit} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg">Submit for Review</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </UserLayout>
    );
};

export const PremiumPage: React.FC = () => {
    const { settings, currentUser } = useStore();
    const navigate = useNavigate();

    return (
        <UserLayout>
            <div className="bg-slate-900 min-h-screen text-white pb-20">
                <div className="p-6">
                    <button onClick={() => navigate('/user/home')} className="bg-white/10 p-2 rounded-full mb-4"><ArrowLeft size={20}/></button>
                    <h1 className="text-3xl font-black mb-2 text-yellow-400">Premium <br/> Membership</h1>
                    <p className="text-slate-400 text-sm">Unlock exclusive benefits and higher earnings.</p>
                </div>

                <div className="bg-white rounded-t-[2.5rem] p-6 text-slate-900 min-h-[70vh]">
                     <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-3xl border border-yellow-200 mb-8 text-center relative overflow-hidden">
                         <Crown size={100} className="absolute -top-4 -right-4 text-yellow-500/20"/>
                         <h2 className="text-4xl font-black text-yellow-600 mb-2">৳{settings.premiumCost}</h2>
                         <p className="text-sm font-bold text-yellow-700 uppercase tracking-widest">Lifetime Access</p>
                     </div>

                     <div className="space-y-4 mb-8">
                         {[
                             "Unlimited Daily Tasks",
                             "Higher Task Rewards",
                             "Instant Withdrawals",
                             "24/7 Priority Support",
                             "Access to Premium Group",
                             "Referral Bonuses"
                         ].map((feat, i) => (
                             <div key={i} className="flex items-center gap-3">
                                 <div className="bg-emerald-100 p-1 rounded-full"><CheckCircle size={16} className="text-emerald-600"/></div>
                                 <span className="font-bold text-gray-700">{feat}</span>
                             </div>
                         ))}
                     </div>

                     {currentUser?.status === 'PREMIUM' ? (
                         <div className="bg-emerald-600 text-white p-4 rounded-xl font-bold text-center">
                             You are already a Premium Member
                         </div>
                     ) : (
                        <button onClick={() => navigate('/user/premium-form')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 text-lg animate-pulse">
                            Upgrade Now <ArrowRight size={20}/>
                        </button>
                     )}
                </div>
            </div>
        </UserLayout>
    );
};

export const PremiumFormPage: React.FC = () => {
    const { settings, currentUser, requestPremium } = useStore();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [form, setForm] = useState({ method: 'BKASH', sender: '', trx: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!currentUser) return;
        requestPremium({
            id: Date.now().toString(),
            userId: currentUser.id,
            method: form.method,
            senderNumber: form.sender,
            trxId: form.trx,
            amount: settings.premiumCost,
            status: 'PENDING',
            date: new Date().toISOString().split('T')[0]
        });
        showToast("Request Sent! Wait for approval.", 'success');
        navigate('/user/home');
    };

    return (
        <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/premium')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Buy Premium</h1>
            </div>
            
            <div className="p-6">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6">
                    <p className="text-sm text-yellow-800 font-bold mb-2">Instructions:</p>
                    <p className="text-xs text-yellow-700 leading-relaxed">
                        Send <b>৳{settings.premiumCost}</b> to the number below using Send Money. Then fill the form.
                    </p>
                    <div className="bg-white p-3 rounded-lg mt-3 flex justify-between items-center border border-yellow-100">
                        <span className="font-mono font-bold text-lg text-gray-800">{settings.contactNumber}</span>
                        <Copy size={18} className="text-yellow-600 cursor-pointer" onClick={() => {navigator.clipboard.writeText(settings.contactNumber); showToast("Copied!", 'success')}}/>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Payment Method</label>
                         <select value={form.method} onChange={e => setForm({...form, method: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none">
                             <option value="BKASH">Bkash</option>
                             <option value="NAGAD">Nagad</option>
                             <option value="ROCKET">Rocket</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sender Number</label>
                         <input type="text" placeholder="017..." value={form.sender} onChange={e => setForm({...form, sender: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" required/>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Transaction ID</label>
                         <input type="text" placeholder="X7Y..." value={form.trx} onChange={e => setForm({...form, trx: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" required/>
                     </div>
                     <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg mt-2">Submit Payment</button>
                </form>
            </div>
        </UserLayout>
    );
};

export const QuizPage: React.FC = () => {
    const { currentUser, updateUser, settings } = useStore();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [answer, setAnswer] = useState('');
    const [q, setQ] = useState({ a: 0, b: 0 });

    useEffect(() => {
        genQuiz();
    }, []);

    const genQuiz = () => {
        setQ({ a: Math.floor(Math.random() * 10), b: Math.floor(Math.random() * 10) });
    };

    const handleSubmit = () => {
        if(!currentUser) return;
        if(currentUser.quizBalance <= 0) {
            showToast("No Quiz Balance remaining!", 'error');
            return;
        }
        if(parseInt(answer) === q.a + q.b) {
            updateUser({
                ...currentUser,
                quizBalance: currentUser.quizBalance - 1,
                balanceFree: currentUser.balanceFree + settings.quizReward
            });
            showToast(`Correct! Earned ৳${settings.quizReward}`, 'success');
            setAnswer('');
            genQuiz();
        } else {
            showToast("Wrong Answer!", 'error');
        }
    };

    if(!currentUser) return null;

    return (
        <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Math Quiz</h1>
            </div>
            <div className="p-6 text-center">
                <div className="bg-purple-100 p-4 rounded-xl mb-6 inline-block">
                    <p className="text-xs text-purple-700 font-bold uppercase">Remaining Quizzes</p>
                    <h3 className="text-3xl font-black text-purple-800">{currentUser.quizBalance}</h3>
                </div>
                
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-6">
                    <p className="text-4xl font-bold text-gray-800 mb-6">{q.a} + {q.b} = ?</p>
                    <input type="number" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Answer" className="w-full p-4 bg-gray-50 rounded-xl text-center text-xl font-bold outline-none mb-4"/>
                    <button onClick={handleSubmit} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg">Submit Answer</button>
                </div>
            </div>
        </UserLayout>
    );
};

export const UserProfilePage: React.FC = () => {
    const { currentUser, logout, updateUser } = useStore();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [pass, setPass] = useState('');

    const handleUpdate = () => {
        if(!currentUser) return;
        if(pass) {
            updateUser({ ...currentUser, password: pass });
            showToast("Password Updated", 'success');
            setPass('');
        }
    };

    if(!currentUser) return null;

    return (
        <UserLayout>
            <div className="p-6 pt-10">
                <div className="text-center mb-8">
                     <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-lg mb-4">
                         <img src={currentUser.profilePic || `https://ui-avatars.com/api/?name=${currentUser.name}`} className="w-full h-full rounded-full object-cover"/>
                     </div>
                     <h2 className="text-2xl font-black text-gray-800">{currentUser.name}</h2>
                     <p className="text-gray-500 font-bold">{currentUser.phone}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-800 border-b pb-2">Account Settings</h3>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Change Password</label>
                        <input type="password" placeholder="New Password" value={pass} onChange={e => setPass(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl mt-1 outline-none"/>
                    </div>
                    <button onClick={handleUpdate} className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold">Update Profile</button>
                </div>

                <button onClick={() => { logout(); navigate('/login'); }} className="w-full mt-6 bg-red-50 text-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    <LogOut size={20}/> Logout
                </button>
            </div>
        </UserLayout>
    );
};

export const NotificationsPage: React.FC = () => {
    const { notifications, currentUser, markNotificationsRead } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        markNotificationsRead();
    }, []);

    const myNotifs = notifications.filter(n => n.userId === currentUser?.id || !n.userId);

    return (
        <UserLayout>
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Notifications</h1>
            </div>
            <div className="p-4 space-y-3">
                {myNotifs.map(n => (
                    <div key={n.id} className={`p-4 rounded-xl border ${n.type === 'INCOME' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-100'}`}>
                        <div className="flex gap-3">
                            <div className={`mt-1 ${n.type === 'INCOME' ? 'text-emerald-600' : 'text-gray-600'}`}>
                                {n.type === 'INCOME' ? <DollarSign size={20}/> : <Bell size={20}/>}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-800">{n.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                                <p className="text-[10px] text-gray-400 mt-2">{new Date(n.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {myNotifs.length === 0 && <p className="text-center text-gray-400 py-10">No notifications.</p>}
            </div>
        </UserLayout>
    );
};

export const IncomeHistoryPage: React.FC = () => {
    const { incomeLogs, currentUser } = useStore();
    const navigate = useNavigate();
    const myLogs = incomeLogs.filter(l => l.userId === currentUser?.id);

    return (
        <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Income History</h1>
            </div>
            <div className="p-4 space-y-3">
                {myLogs.map(log => (
                    <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-sm text-gray-800">{log.source}</p>
                            <p className="text-[10px] text-gray-400">{new Date(log.date).toLocaleDateString()}</p>
                        </div>
                        <span className="font-black text-emerald-600">+৳{log.amount}</span>
                    </div>
                ))}
                 {myLogs.length === 0 && <p className="text-center text-gray-400 py-10">No history available.</p>}
            </div>
        </UserLayout>
    );
};

export const WorkVideoPage: React.FC = () => {
    const { settings } = useStore();
    const navigate = useNavigate();

    return (
         <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Work Video</h1>
            </div>
            <div className="p-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="font-bold text-center mb-4 text-gray-800">How to Work Tutorial</h3>
                    <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                         <a href={settings.youtubeLink} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2">
                             <Youtube size={48} className="text-red-600"/>
                             <span className="text-sm font-bold text-gray-600">Watch on YouTube</span>
                         </a>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">Watch the full video to understand how to complete tasks and withdraw money.</p>
                </div>
            </div>
         </UserLayout>
    );
};

export const JobWithdrawPage: React.FC = () => {
    const { currentUser, submitJobWithdraw, settings } = useStore();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [form, setForm] = useState({ type: 'Data Entry', points: '', wallet: '', proof: '' });

    const handleSubmit = () => {
        if(!currentUser) return;
        const pts = Number(form.points);
        if(!pts || pts <= 0) { showToast("Invalid Points", 'error'); return; }
        
        const amount = pts * settings.jobPointRate;
        
        submitJobWithdraw({
            id: Date.now().toString(),
            userId: currentUser.id,
            jobType: form.type,
            points: pts,
            amountBDT: amount,
            walletNumber: form.wallet,
            proofImage: form.proof,
            details: 'Job Withdrawal',
            status: 'PENDING',
            date: new Date().toISOString().split('T')[0]
        });
        showToast("Job Withdraw Submitted", 'success');
        navigate('/user/home');
    };

    return (
        <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Job Withdraw</h1>
            </div>
            <div className="p-6">
                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 mb-6">
                     <p className="text-xs text-orange-800 font-bold">Conversion Rate: 1000 Points = ৳{1000 * settings.jobPointRate}</p>
                 </div>

                 <div className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Job Type</label>
                         <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-3 bg-white rounded-xl border border-gray-200">
                             <option>Data Entry</option>
                             <option>Captcha Entry</option>
                             <option>Ad View</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Points Earned</label>
                         <input type="number" value={form.points} onChange={e => setForm({...form, points: e.target.value})} className="w-full p-3 bg-white rounded-xl border border-gray-200" placeholder="e.g. 5000"/>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Wallet Number</label>
                         <input type="text" value={form.wallet} onChange={e => setForm({...form, wallet: e.target.value})} className="w-full p-3 bg-white rounded-xl border border-gray-200" placeholder="017..."/>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Proof Image Link</label>
                         <input type="text" value={form.proof} onChange={e => setForm({...form, proof: e.target.value})} className="w-full p-3 bg-white rounded-xl border border-gray-200" placeholder="http://..."/>
                     </div>
                     <div className="pt-2">
                        <p className="text-right font-black text-lg text-emerald-600 mb-2">
                            Receive: ৳{(Number(form.points) * settings.jobPointRate).toFixed(2)}
                        </p>
                        <button onClick={handleSubmit} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg">Submit Request</button>
                     </div>
                 </div>
            </div>
        </UserLayout>
    );
};
