import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { clearUserSession, getUserSession } from '../../lib/session';
import { Trophy, CheckCircle, XCircle, RefreshCw, MessageSquare, Send, Heart, Loader2, ArrowRight, Home } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ThemeToggle from '../../components/ThemeToggle';

export default function QuizResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { score: number; total: number; examType: string } | null;

    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        const session = getUserSession();
        if (session && session.email) {
            setUserEmail(session.email);
        }
        clearUserSession();
    }, []);

    if (!state) {
        return <Navigate to="/register" replace />;
    }

    const { score, total } = state;
    const percentage = Math.round((score / total) * 100);
    const isPassed = percentage >= 70;

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        setIsSubmitting(true);
        setFeedbackStatus('idle');

        try {
            const { error } = await supabase.from('feedback').insert([{
                user_email: userEmail,
                message: feedback.trim()
            }]);

            if (error) throw error;
            setFeedbackStatus('success');
            setFeedback('');
        } catch (err) {
            console.error('Failed to submit feedback', err);
            setFeedbackStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans py-12 px-6 relative overflow-x-hidden transition-colors duration-500">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overscroll-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 dark:bg-blue-600/5 blur-[120px] rounded-full"></div>
                <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] ${isPassed ? 'bg-emerald-600/5' : 'bg-rose-600/5'} blur-[120px] rounded-full`}></div>
            </div>

            {/* Theme Toggle in Result Page */}
            <div className="fixed top-8 right-8 z-50">
                <ThemeToggle />
            </div>

            <div className="max-w-xl mx-auto w-full space-y-8 relative z-10">
                {/* Score Card */}
                <div className="bg-[var(--card-bg)]/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-[var(--card-border)] text-center relative overflow-hidden transition-colors">
                    <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-10 dark:opacity-20 ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                    <div className="relative z-10">
                        <div className={`mx-auto w-28 h-28 mb-8 rounded-[2rem] flex items-center justify-center border-2 shadow-2xl transform rotate-3 transition-all
                ${isPassed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'}`}
                        >
                            {isPassed ? <Trophy size={48} className="drop-shadow-lg" /> : <XCircle size={48} className="drop-shadow-lg" />}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-[var(--heading)] tracking-tight mb-2 transition-colors">
                            {isPassed ? 'Lulus Ujian!' : 'Belum Lulus'}
                        </h1>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card-accent)] border border-[var(--card-border)] text-[var(--subtext)] font-black text-[10px] uppercase tracking-widest mb-10 transition-colors">
                            Paket Ujian: <span className="text-blue-600 dark:text-blue-400 uppercase transition-colors">{state.examType}</span>
                        </div>
                        
                        <p className="text-[var(--subtext)] mb-10 text-lg font-medium leading-relaxed transition-colors">
                            {isPassed
                                ? 'Selamat! Anda telah menunjukkan pemahaman yang matang terhadap aturan lalu lintas.'
                                : 'Jangan menyerah. Pahami kembali materi rambu dan coba simulasi lagi.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-inner transition-colors">
                                <p className="text-[10px] text-[var(--subtext)] font-black uppercase tracking-widest mb-2 transition-colors">Skor Akhir</p>
                                <p className={`text-5xl font-black tracking-tighter transition-all ${isPassed ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {percentage}<span className="text-lg opacity-40 ml-1">%</span>
                                </p>
                            </div>
                            <div className="bg-[var(--card-accent)] border border-[var(--card-border)] rounded-3xl p-6 shadow-inner flex flex-col justify-center transition-colors">
                                <p className="text-[10px] text-[var(--subtext)] font-black uppercase tracking-widest mb-4 transition-colors">Statistik</p>
                                <div className="flex justify-center items-center gap-6">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="text-emerald-500 flex items-center gap-1.5 font-black text-xl">
                                            <CheckCircle size={18} /> {score}
                                        </div>
                                        <span className="text-[10px] text-[var(--subtext)] font-black uppercase tracking-tighter">Benar</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="text-rose-500 flex items-center gap-1.5 font-black text-xl">
                                            <XCircle size={18} /> {total - score}
                                        </div>
                                        <span className="text-[10px] text-[var(--subtext)] font-black uppercase tracking-tighter">Salah</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 bg-[var(--foreground)] text-[var(--background)] hover:bg-black dark:hover:bg-slate-200 font-black py-5 px-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group"
                            >
                                <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
                                Beranda
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="flex-1 px-6 py-5 bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl font-black hover:bg-blue-600/20 transition-all flex items-center justify-center gap-3 shadow-sm"
                            >
                                <RefreshCw size={20} />
                                Ulangi
                            </button>
                        </div>
                    </div>
                </div>

                {/* Donation Banner */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2.5rem] shadow-2xl dark:shadow-orange-500/10 text-white relative overflow-hidden group transition-all">
                    <div className="absolute top-0 right-0 p-16 bg-white/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-black text-2xl flex items-center justify-center md:justify-start gap-3 mb-2">
                                <Heart size={24} className="fill-white animate-pulse" /> Dukung SimulaSIM
                            </h3>
                            <p className="text-orange-100 font-medium leading-relaxed">
                                Bantu kami terus mengembangkan platform ini agar tetap gratis & up-to-date.
                            </p>
                        </div>
                        <a
                            href="https://mayar.gg/ananw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-orange-600 hover:bg-slate-100 font-black py-4 px-8 rounded-2xl transition-all shadow-lg whitespace-nowrap flex items-center gap-2 group"
                        >
                            Donasi Kopi
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* Feedback Form */}
                <div className="bg-[var(--card-bg)]/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-[var(--card-border)] shadow-2xl transition-colors">
                    <h3 className="font-black text-[var(--heading)] text-xl flex items-center gap-3 mb-3 transition-colors">
                        <MessageSquare size={22} className="text-blue-500" />
                        Kritik & Saran
                    </h3>
                    <p className="text-sm text-[var(--subtext)] font-medium mb-8 leading-relaxed transition-colors">
                        Masukan Anda sangat berarti untuk kualitas soal kami. Tuliskan jika menemukan kesalahan atau kekurangan.
                    </p>

                    {feedbackStatus === 'success' ? (
                        <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl border border-emerald-500/20 text-center font-black uppercase tracking-widest text-[10px] transition-all">
                            Terima kasih! Masukan Anda Telah Terkirim 🚀
                        </div>
                    ) : (
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                            <textarea
                                required
                                rows={3}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Tuliskan masukan Anda di sini..."
                                className="w-full bg-[var(--card-accent)] border border-[var(--card-border)] text-[var(--foreground)] rounded-2xl p-5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[var(--card-bg)] transition-all resize-none font-medium placeholder:text-[var(--subtext)]/30 shadow-sm"
                            />
                            {feedbackStatus === 'error' && (
                                <p className="text-rose-500 text-xs font-black uppercase tracking-widest text-center transition-colors">Gagal mengirim. Coba lagi nanti.</p>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting || !feedback.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                {isSubmitting ? 'MENGIRIM...' : 'KIRIM MASUKAN'}
                            </button>
                        </form>
                    )}
                </div>

                <footer className="py-10 border-t border-[var(--card-border)] bg-[var(--card-bg)] relative z-20 transition-colors duration-500 rounded-[2.5rem] mt-8">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6 text-center transition-colors">
                        <div className="space-y-4">
                            <p className="text-[var(--subtext)] text-sm font-medium transition-colors">&copy; {new Date().getFullYear()} SimulaSIM. Dedicated to road safety awareness.</p>
                            <div className="flex justify-center gap-6">
                                <a href="https://ananw.xyz" target="_blank" rel="noopener noreferrer" className="text-[var(--subtext)] opacity-60 hover:opacity-100 hover:text-blue-500 font-black text-xs uppercase tracking-widest transition-all tracking-[0.2em]">
                                    Created by ananw.xyz
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
