import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Smartphone, UserPlus, FileText, HelpCircle, Download, Youtube, Facebook, MessageCircle, ArrowRight, Lock } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { settings } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState({ users: 0, paid: 0, active: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + 12, 1250),
        paid: Math.min(prev.paid + 540, 50000),
        active: Math.min(prev.active + 7, 800)
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 animate-gradient-xy"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <style>{`
        @keyframes gradient-xy {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient-xy {
            background-size: 200% 200%;
            animation: gradient-xy 15s ease infinite;
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto bg-white/90 min-h-screen shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <header className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
               <div className="bg-gradient-to-tr from-emerald-600 to-teal-400 w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-200">G</div>
               <h1 className="text-lg font-bold text-gray-800 tracking-tight">{settings.companyName}</h1>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 p-2 hover:bg-gray-100 rounded-full transition">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </header>

          {/* Menu Overlay */}
          <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, x: '100%' }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-72 bg-white z-40 p-6 flex flex-col gap-2 shadow-2xl pt-24"
            >
               <button onClick={() => navigate('/login')} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-2xl text-base font-semibold text-gray-700 transition"><Smartphone size={20} className="text-emerald-500"/> Login</button>
               <button onClick={() => navigate('/register')} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-2xl text-base font-semibold text-gray-700 transition"><UserPlus size={20} className="text-emerald-500"/> Registration</button>
               <div className="h-px bg-gray-100 my-2"></div>
               <button className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-2xl text-base font-semibold text-gray-700 transition"><FileText size={20} className="text-emerald-500"/> Privacy Policy</button>
               <button className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-2xl text-base font-semibold text-gray-700 transition"><HelpCircle size={20} className="text-emerald-500"/> Support</button>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Hero Section */}
          <main className="p-6 flex flex-col items-center text-center pb-20">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-10 mt-4">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-4 inline-block">Official App</span>
                <h2 className="text-4xl font-black text-gray-800 mb-4 leading-tight">Earn Money <br/><span className="text-emerald-600">Every Day</span></h2>
                <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed">{settings.landingText}</p>
                
                <div className="flex gap-4 w-full justify-center">
                    <button onClick={() => navigate('/login')} className="flex-1 bg-gray-900 text-white py-4 rounded-2xl shadow-xl shadow-gray-200 font-bold text-sm hover:scale-105 transition active:scale-95 flex items-center justify-center gap-2">
                        Login <ArrowRight size={16}/>
                    </button>
                    <button onClick={() => navigate('/register')} className="flex-1 bg-white text-gray-900 border border-gray-200 py-4 rounded-2xl shadow-sm font-bold text-sm hover:bg-gray-50 transition active:scale-95">
                        Register
                    </button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 w-full mb-10">
              {[
                  { val: `${stats.users}+`, label: 'Users', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { val: `৳${stats.paid}`, label: 'Paid', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { val: stats.active, label: 'Online', color: 'text-orange-500', bg: 'bg-orange-50' }
              ].map((s, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className={`${s.bg} p-4 rounded-3xl flex flex-col items-center justify-center border border-white/50 shadow-sm`}
                  >
                    <h3 className={`${s.color} font-black text-lg`}>{s.val}</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">{s.label}</p>
                  </motion.div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-6 justify-center mb-10">
              <a href={settings.facebookLink} className="bg-white p-3 rounded-full shadow-md text-blue-600 hover:scale-110 transition"><Facebook size={24} /></a>
              <a href={settings.youtubeLink} className="bg-white p-3 rounded-full shadow-md text-red-600 hover:scale-110 transition"><Youtube size={24} /></a>
              <a href={settings.telegramLink} className="bg-white p-3 rounded-full shadow-md text-sky-500 hover:scale-110 transition"><MessageCircle size={24} /></a>
            </div>
            
             {/* Download App */}
            <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                        <Smartphone size={24} className="text-white"/>
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-base">Download App</p>
                        <p className="text-[10px] text-gray-400">Version 1.2.0</p>
                    </div>
                </div>
                <div className="bg-white text-gray-900 p-3 rounded-full shadow-lg group-hover:scale-110 transition">
                    <Download size={20}/>
                </div>
            </div>

            <p className="mt-8 text-[10px] text-gray-400 font-medium">© 2024 {settings.companyName}. All rights reserved.</p>
          </main>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const { login, adminLogin, settings } = useStore();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800)); 
    
    if(adminLogin(phone, pass)) {
      navigate('/admin/dashboard');
      return;
    }
    const success = await login(phone, pass);
    setIsLoading(false);
    if (success) navigate('/user/home');
    else alert("Invalid Credentials");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-8 max-w-md mx-auto">
      <div className="mb-10">
         <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
             <Lock className="text-white" size={32}/>
         </div>
         <h2 className="text-3xl font-black text-gray-800">Welcome Back</h2>
         <p className="text-gray-400 mt-2 font-medium">Please sign in to continue</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">WhatsApp Number</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium" placeholder="017..." required />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full p-4 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium" placeholder="••••••" required />
        </div>
        <div className="text-right">
           <button type="button" className="text-xs text-emerald-600 font-bold hover:underline">Forgot Password?</button>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200 text-lg hover:scale-[1.02] transition flex justify-center active:scale-95">
            {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Sign In"}
        </button>
      </form>
      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500 font-medium">Don't have an account? <span onClick={() => navigate('/register')} className="text-emerald-600 font-bold cursor-pointer hover:underline">Create Account</span></p>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { register } = useStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', refCode: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      alert("Registration Successful!");
      navigate('/user/home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-8 max-w-md mx-auto">
       <div className="mb-8">
         <h2 className="text-3xl font-black text-gray-800">Create Account</h2>
         <p className="text-gray-400 mt-2 font-medium">Join us and start earning</p>
      </div>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 border-none bg-white rounded-2xl shadow-sm outline-none font-medium" required />
        <input type="text" placeholder="WhatsApp Number" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 border-none bg-white rounded-2xl shadow-sm outline-none font-medium" required />
        <input type="email" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 border-none bg-white rounded-2xl shadow-sm outline-none font-medium" required />
        <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-4 border-none bg-white rounded-2xl shadow-sm outline-none font-medium" required />
        
        <div className="relative">
          <input type="text" placeholder="Referral Code (Required)" onChange={e => setFormData({...formData, refCode: e.target.value})} className="w-full p-4 border-none bg-white rounded-2xl shadow-sm outline-none font-medium" required />
        </div>
        
        <p className="text-xs text-gray-400 ml-1">Use 1-6 if you don't have a referral code.</p>

        <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl mt-4 hover:scale-[1.02] transition active:scale-95">Sign Up</button>
      </form>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 font-medium">Already have an account? <span onClick={() => navigate('/login')} className="text-emerald-600 font-bold cursor-pointer hover:underline">Sign In</span></p>
      </div>
    </div>
  );
};