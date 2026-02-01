import React, { useState } from 'react';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, List, Settings, LogOut, CheckCircle, XCircle, Trash2, Plus, Briefcase, Home } from 'lucide-react';
import { UserStatus } from '../types';

// Admin Mobile Layout
const AdminLayout: React.FC<{ children: React.ReactNode, activeTab: string, setTab: (t: any) => void }> = ({ children, activeTab, setTab }) => {
    const navItems = [
        { id: 'DASH', icon: Home, label: 'Dash' },
        { id: 'USERS', icon: Users, label: 'Users' },
        { id: 'TASKS', icon: Briefcase, label: 'Tasks' },
        { id: 'PREMIUM', icon: DollarSign, label: 'Prem' },
        { id: 'WITHDRAW', icon: List, label: 'Pay' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20 max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
            {children}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gray-900 border-t border-gray-800 flex justify-around p-3 z-50 rounded-t-3xl">
                {navItems.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        className={`flex flex-col items-center justify-center rounded-2xl w-14 h-14 transition-all duration-300 ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-gray-500 hover:bg-gray-800'}`}
                    >
                        <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export const AdminDashboard: React.FC = () => {
  const { users, tasks, submissions, withdrawals, logout, activatePremium, addTask, deleteTask, approveTask, rejectTask, approveWithdraw } = useStore();
  const [view, setView] = useState<'DASH' | 'USERS' | 'PREMIUM' | 'TASKS' | 'WITHDRAW'>('DASH');
  const [newTask, setNewTask] = useState({ title: '', desc: '', amount: '', link: '', type: 'FREE', category: 'YOUTUBE' });

  const stats = {
    totalUsers: users.length,
    premiumUsers: users.filter(u => u.status === UserStatus.PREMIUM).length,
    pendingTasks: submissions.filter(s => s.status === 'PENDING').length,
    pendingWithdraws: withdrawals.filter(w => w.status === 'PENDING').length
  };

  const chartData = [
    { name: 'User', val: stats.totalUsers },
    { name: 'Prem', val: stats.premiumUsers },
    { name: 'Task', val: tasks.length },
  ];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.desc,
        amount: Number(newTask.amount),
        image: '',
        link: newTask.link,
        type: newTask.type as any,
        category: newTask.category as any
    });
    alert("Task Added");
    setNewTask({ title: '', desc: '', amount: '', link: '', type: 'FREE', category: 'YOUTUBE' });
  };

  return (
    <AdminLayout activeTab={view} setTab={setView}>
        {/* Header */}
        <div className="bg-gray-900 p-6 pt-8 pb-6 text-white rounded-b-3xl mb-6 shadow-lg sticky top-0 z-40">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-bold">Admin Panel</h1>
                    <p className="text-xs text-gray-400">Manage Gold Product</p>
                </div>
                <button onClick={logout} className="bg-gray-800 p-2 rounded-full hover:bg-red-900/50 transition">
                    <LogOut size={18} className="text-red-400"/>
                </button>
            </div>
        </div>

        <div className="px-5 pb-24">
            {view === 'DASH' && (
            <div className="space-y-6">
                 {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Total Users</p>
                        <p className="text-3xl font-black text-gray-800 mt-1">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Premium</p>
                        <p className="text-3xl font-black text-yellow-500 mt-1">{stats.premiumUsers}</p>
                    </div>
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Task Pending</p>
                        <p className="text-3xl font-black text-blue-500 mt-1">{stats.pendingTasks}</p>
                    </div>
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Pay Pending</p>
                        <p className="text-3xl font-black text-red-500 mt-1">{stats.pendingWithdraws}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm h-64 border border-gray-100">
                    <h3 className="font-bold mb-4 text-sm text-gray-700">Analytics</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false}/>
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="val" fill="#10b981" radius={[6, 6, 6, 6]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            )}

            {view === 'TASKS' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold mb-4 text-sm">Add New Task</h3>
                        <form onSubmit={handleAddTask} className="space-y-3">
                            <input type="text" placeholder="Title" className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none" onChange={e => setNewTask({...newTask, title: e.target.value})} value={newTask.title} required/>
                            <input type="text" placeholder="Description" className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none" onChange={e => setNewTask({...newTask, desc: e.target.value})} value={newTask.desc} required/>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Amount" className="w-1/2 p-3 bg-gray-50 rounded-xl text-sm outline-none" onChange={e => setNewTask({...newTask, amount: e.target.value})} value={newTask.amount} required/>
                                <select className="w-1/2 p-3 bg-gray-50 rounded-xl text-sm outline-none" onChange={e => setNewTask({...newTask, type: e.target.value})} value={newTask.type}>
                                    <option value="FREE">Free</option>
                                    <option value="PREMIUM">Premium</option>
                                </select>
                            </div>
                             <input type="text" placeholder="Link" className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none" onChange={e => setNewTask({...newTask, link: e.target.value})} value={newTask.link} required/>
                            <select className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none" onChange={e => setNewTask({...newTask, category: e.target.value})} value={newTask.category}>
                                <option value="YOUTUBE">YouTube</option>
                                <option value="FACEBOOK">Facebook</option>
                                <option value="TIKTOK">TikTok</option>
                                <option value="GMAIL">Gmail</option>
                            </select>
                            <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm shadow-lg">Create Task</button>
                        </form>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-sm text-gray-500 uppercase ml-2">Active Tasks</h3>
                        {tasks.map(t => (
                            <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-gray-50">
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{t.title}</p>
                                    <p className="text-xs text-gray-500">{t.type} • ৳{t.amount}</p>
                                </div>
                                <button onClick={() => deleteTask(t.id)} className="bg-red-50 text-red-500 p-2 rounded-xl"><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 pt-4">
                        <h3 className="font-bold text-sm text-gray-500 uppercase ml-2">Pending Proofs</h3>
                        {submissions.filter(s => s.status === 'PENDING').length === 0 && <p className="text-center text-xs text-gray-400 py-4">No pending tasks</p>}
                        {submissions.filter(s => s.status === 'PENDING').map(sub => (
                            <div key={sub.id} className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500">User: {sub.userId}</span>
                                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">New</span>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-lg text-xs text-gray-600 mb-3 break-all font-mono">
                                    {sub.proofLink}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => approveTask(sub.id)} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold">Approve</button>
                                    <button onClick={() => rejectTask(sub.id)} className="flex-1 bg-red-500 text-white py-2 rounded-xl text-xs font-bold">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'USERS' && (
                <div className="space-y-3">
                    <h3 className="font-bold text-sm mb-4">User List ({users.length})</h3>
                    {users.map(u => (
                        <div key={u.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">{u.name}</p>
                                    <p className="text-xs text-gray-500">{u.phone}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Ref: {u.refCode}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-emerald-600">৳{u.balanceFree}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${u.status === 'PREMIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{u.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'PREMIUM' && (
                <div className="space-y-3">
                    <h3 className="font-bold text-sm mb-4">Premium Requests</h3>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                             <div>
                                <p className="font-bold text-sm">User: 01700000000</p>
                                <p className="text-xs text-gray-500">Trx: 8JSH72JS • Bkash</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-xs font-bold text-gray-400">10 mins ago</p>
                             </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => activatePremium('1')} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold">Accept</button>
                            <button className="flex-1 bg-red-100 text-red-500 py-2 rounded-xl text-xs font-bold">Decline</button>
                        </div>
                    </div>
                </div>
            )}

            {view === 'WITHDRAW' && (
                <div className="space-y-3">
                    <h3 className="font-bold text-sm mb-4">Payout Requests</h3>
                    {withdrawals.length === 0 && <p className="text-center text-gray-400 text-xs py-8">No requests</p>}
                    {withdrawals.map(w => (
                        <div key={w.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg text-gray-800">৳{w.amount}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${w.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{w.status}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-mono mb-3">{w.method} • {w.number}</p>
                            {w.status === 'PENDING' && (
                                <button onClick={() => approveWithdraw(w.id)} className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-200">Mark as Paid</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </AdminLayout>
  );
};