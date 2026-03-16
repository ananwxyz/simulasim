import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, ChevronRight, LayoutDashboard } from 'lucide-react';
import { saveUserSession } from '../../lib/session';
import ThemeToggle from '../../components/ThemeToggle';

export default function Landing() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [examType, setExamType] = useState<'SIM A' | 'SIM C'>('SIM C');
    const [moduleNumber, setModuleNumber] = useState<1 | 2 | 3 | 4>(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        saveUserSession({
            name,
            email,
            examType,
            moduleNumber,
            startedAt: Date.now()
        });

        navigate('/quiz');
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative flex flex-col font-sans transition-colors duration-500 overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 dark:bg-indigo-600/10 blur-[120px] rounded-full"></div>
            </div>

            {/* Header */}
            <header className="px-8 py-6 flex justify-between items-center relative z-20 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 shadow-inner">
                        <img src="/logo.png" alt="SimulaSIM Logo" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="text-slate-900 dark:text-white font-black text-xl italic tracking-tighter">SimulaSIM</span>
                </div>
                <ThemeToggle />
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-7xl mx-auto py-12">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mx-auto shadow-sm">
                            Sistem Simulasi Terintegrasi
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[var(--heading)] tracking-tight transition-colors">Satu Langkah Lagi Menuju Ujian</h1>
                        <p className="text-[var(--subtext)] font-medium max-w-md mx-auto transition-colors">Lengkapi identitas untuk memulai simulasi bank soal resmi SimulaSIM.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 bg-[var(--card-bg)] backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-[var(--card-border)] transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2 transition-colors">
                                    <User size={14} className="text-blue-500" /> Identitas Peserta
                                </h3>
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 px-1 transition-colors">Nama Lengkap</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-white/[0.05] transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-800 shadow-sm"
                                                placeholder="Cth: Ahmad Fulan"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 px-1 transition-colors">Email Aktif</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-white/[0.05] transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-800 shadow-sm"
                                                placeholder="fulan@email.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2 transition-colors">
                                    <LayoutDashboard size={14} className="text-blue-500" /> Pilih Simulasi
                                </h3>
                                
                                <div>
                                    <label className="block text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 px-1 transition-colors">Kategori SIM</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(['SIM C', 'SIM A'] as const).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setExamType(type)}
                                                className={`py-6 rounded-2xl border-2 font-black text-sm transition-all flex flex-col items-center gap-3 shadow-md hover:-translate-y-1 ${
                                                    examType === type
                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/25'
                                                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 dark:hover:bg-white/10 transition-colors'
                                                }`}
                                            >
                                                <div className={`p-4 rounded-xl shadow-inner ${examType === type ? 'bg-white/20' : 'bg-slate-100 dark:bg-black/20 text-slate-400 transition-colors'}`}>
                                                    <ShieldCheck size={28} />
                                                </div>
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Module Selection */}
                        <div className="pt-6 border-t border-slate-200 dark:border-white/5 transition-colors">
                            <label className="block text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6 px-1 text-center transition-colors transition-colors">Pilih Modul Ujian</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        disabled={num > 1}
                                        onClick={() => setModuleNumber(num as 1 | 2 | 3 | 4)}
                                        className={`relative group overflow-hidden py-4 rounded-xl border-2 font-black transition-all flex items-center justify-center gap-2 shadow-md ${
                                            moduleNumber === num
                                                ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/25'
                                                : num > 1
                                                    ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-300 dark:text-slate-800 cursor-not-allowed transition-colors'
                                                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-blue-500/50 hover:bg-slate-100 transition-colors'
                                        }`}
                                    >
                                        Modul {num}
                                        {num > 1 && <span className="absolute top-1 right-2 text-[8px] bg-slate-200 dark:bg-slate-950 px-1 rounded text-slate-400 dark:text-slate-600 uppercase font-bold tracking-widest transition-colors">Offline</span>}
                                        {moduleNumber === num && <div className="absolute inset-0 bg-white/10 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform">✓</div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl text-xl transition-all shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group mt-10"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Mulai Kerjakan Soal
                                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-transparent to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000"></div>
                        </button>
                    </form>
                    
                    <footer className="mt-12 text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] transition-colors">
                        &copy; SimulaSIM 2026 &bull; Secure Environment
                    </footer>
                </div>
            </main>
        </div>
    );
}
