import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Task, TaskSubmission, Withdrawal, Ticket, Settings, UserStatus } from './types';

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  submissions: TaskSubmission[];
  withdrawals: Withdrawal[];
  tickets: Ticket[];
  settings: Settings;
  
  // Actions
  login: (phone: string, pass: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  submitTask: (submission: TaskSubmission) => void;
  approveTask: (submissionId: string) => void;
  rejectTask: (submissionId: string) => void;
  requestWithdraw: (withdrawal: Withdrawal) => void;
  approveWithdraw: (withdrawalId: string) => void;
  activatePremium: (userId: string) => void;
  
  // Admin Actions
  isAdmin: boolean;
  adminLogin: (phone: string, pass: string) => boolean;
  updateSettings: (s: Settings) => void;
  submitTicket: (t: Ticket) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// --- INITIAL MOCK DATA ---

const INITIAL_SETTINGS: Settings = {
  companyName: "udyanit.com",
  notice: "আমাদের অ্যাপে স্বাগতম! রেফার করে এবং টাস্ক কমপ্লিট করে আনলিমিটেড ইনকাম করুন।",
  landingText: "বিশ্বস্ত ইনকাম সোর্স, ১০০% পেমেন্ট গ্যারান্টি।",
  youtubeLink: "https://youtube.com",
  facebookLink: "https://facebook.com",
  telegramLink: "https://t.me",
  whatsappLink: "https://wa.me/01700000000",
  premiumCost: 500,
  refBonus: 50,
  contactNumber: "01700000000",
  quizReward: 1
};

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Md. User',
    phone: '01700000000',
    email: 'user@gmail.com',
    password: '123456',
    refCode: 'USER01',
    uplineCode: 'ADMIN01',
    status: UserStatus.FREE,
    balanceFree: 120,
    balancePremium: 0,
    joinDate: '2023-10-01',
    isBlocked: false,
    refBonusReceived: 0
  },
  {
    id: '2',
    name: 'Pro Earner',
    phone: '01800000000',
    email: 'pro@gmail.com',
    password: '123456',
    refCode: 'PRO99',
    uplineCode: 'USER01',
    status: UserStatus.PREMIUM,
    balanceFree: 500,
    balancePremium: 2500,
    joinDate: '2023-11-15',
    isBlocked: false,
    refBonusReceived: 500
  }
];

const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Youtube Watch & Sub',
    description: 'Watch the video for 2 minutes and subscribe.',
    amount: 5,
    image: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    link: 'https://youtube.com',
    type: 'FREE',
    category: 'YOUTUBE'
  },
  {
    id: 't2',
    title: 'Facebook Page Like',
    description: 'Like and Follow the page.',
    amount: 3,
    image: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    link: 'https://facebook.com',
    type: 'FREE',
    category: 'FACEBOOK'
  },
  {
    id: 't3',
    title: 'Premium Gmail Create',
    description: 'Create a USA verified Gmail.',
    amount: 25,
    image: 'https://cdn-icons-png.flaticon.com/512/732/732200.png',
    link: '#',
    type: 'PREMIUM',
    category: 'GMAIL'
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage to prevent data loss on refresh
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('app_users');
      return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
    } catch (e) {
      return MOCK_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('app_currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  // Helper to save users to LS
  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('app_users', JSON.stringify(newUsers));
  };

  const login = async (phone: string, pass: string) => {
    const user = users.find(u => u.phone === phone && u.password === pass);
    if (user) {
      if (user.isBlocked) {
        alert("Account is Blocked. Contact Admin.");
        return false;
      }
      setCurrentUser(user);
      localStorage.setItem('app_currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const adminLogin = (phone: string, pass: string) => {
    // Hardcoded Admin Credentials
    if (phone === "01772209016" && pass === "123456") {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const register = async (data: any) => {
    if (users.find(u => u.phone === data.phone)) {
      alert("Phone already registered");
      return false;
    }
    
    // Validate Ref Code
    const validRef = data.refCode && (['1','2','3','4','5','6'].includes(data.refCode) || users.find(u => u.refCode === data.refCode));
    if (!validRef) {
      alert("Invalid Referral Code. Use 1-6 if you don't have one.");
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      balanceFree: 0,
      balancePremium: 0,
      status: UserStatus.FREE,
      joinDate: new Date().toISOString().split('T')[0],
      isBlocked: false,
      refBonusReceived: 0,
      // Generate a random ref code for the new user
      refCode: 'REF' + Math.floor(1000 + Math.random() * 9000)
    };

    let updatedUsers = [...users, newUser];
    
    // Give Bonus to Upline (Simulated)
    const upline = users.find(u => u.refCode === data.refCode);
    if (upline) {
      const updatedUpline = {
        ...upline,
        balanceFree: upline.balanceFree + settings.refBonus,
        refBonusReceived: upline.refBonusReceived + settings.refBonus
      };
      updatedUsers = updatedUsers.map(u => u.id === upline.id ? updatedUpline : u);
    }

    saveUsers(updatedUsers);
    setCurrentUser(newUser);
    localStorage.setItem('app_currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('app_currentUser');
  };

  const updateUser = (updatedUser: User) => {
    const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsers(newUsers);
    
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('app_currentUser', JSON.stringify(updatedUser));
    }
  };

  const activatePremium = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const updated = { ...user, status: UserStatus.PREMIUM };
      
      // Bonus logic could go here
      let newUsers = users.map(u => u.id === userId ? updated : u);

      const upline = users.find(u => u.refCode === user.uplineCode);
      if(upline) {
          // Give premium ref bonus
          const updatedUpline = { ...upline, balancePremium: upline.balancePremium + 100 }; // Example amount
          newUsers = newUsers.map(u => u.id === upline.id ? updatedUpline : u);
      }
      
      saveUsers(newUsers);
      
      // Sync current user if it's them
      if (currentUser?.id === userId) {
          setCurrentUser(updated);
          localStorage.setItem('app_currentUser', JSON.stringify(updated));
      }
    }
  };

  const submitTask = (submission: TaskSubmission) => {
    setSubmissions([submission, ...submissions]);
  };

  const approveTask = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (sub && sub.status === 'PENDING') {
      const updatedSub = { ...sub, status: 'APPROVED' as const };
      setSubmissions(submissions.map(s => s.id === submissionId ? updatedSub : s));

      // Add money to user
      const user = users.find(u => u.id === sub.userId);
      if (user) {
        const isPremiumTask = tasks.find(t => t.id === sub.taskId)?.type === 'PREMIUM';
        const updatedUser = {
          ...user,
          balanceFree: isPremiumTask ? user.balanceFree : user.balanceFree + sub.amount,
          balancePremium: isPremiumTask ? user.balancePremium + sub.amount : user.balancePremium
        };
        updateUser(updatedUser);
      }
    }
  };

  const rejectTask = (submissionId: string) => {
    setSubmissions(submissions.map(s => s.id === submissionId ? { ...s, status: 'REJECTED' } : s));
  };

  const requestWithdraw = (withdrawal: Withdrawal) => {
    setWithdrawals([withdrawal, ...withdrawals]);
  };

  const approveWithdraw = (withdrawalId: string) => {
      setWithdrawals(withdrawals.map(w => w.id === withdrawalId ? { ...w, status: 'APPROVED' } : w));
  };

  const addTask = (task: Task) => setTasks([...tasks, task]);
  const deleteTask = (taskId: string) => setTasks(tasks.filter(t => t.id !== taskId));

  return (
    <StoreContext.Provider value={{
      currentUser, users, tasks, submissions, withdrawals, tickets, settings, isAdmin,
      login, register, logout, updateUser, 
      addTask, deleteTask,
      submitTask, approveTask, rejectTask,
      requestWithdraw, approveWithdraw,
      submitTicket: (t) => setTickets([...tickets, t]),
      activatePremium, adminLogin, updateSettings: setSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};