import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { clearUserSession, getUserSession } from '../../lib/session';
import { Trophy, CheckCircle, XCircle, RefreshCw, MessageSquare, Send, Heart, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function QuizResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { score: number; total: number; examType: string } | null;

    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        // Ambil email dari sesi yang tersisa untuk tabel feedback sebelum dihapus
        const session = getUserSession();
        if (session && session.email) {
            setUserEmail(session.email);
        }
        // Clear session so user will have to input name again if they retake
        clearUserSession();
    }, []);

    if (!state) {
        return <Navigate to="/register" replace />;
    }

    const { score, total } = state;
    const percentage = Math.round((score / total) * 100);
    const isPassed = percentage >= 70; // Set passing grade at 70%

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
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-lg mx-auto space-y-6">

                {/* Score Card */}
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
                    {/* Background decorative blob */}
                    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} />

                    <div className="relative z-10">
                        <div className={`mx-auto w-24 h-24 mb-6 rounded-full flex items-center justify-center border-8 shadow-sm
                ${isPassed ? 'bg-green-50 border-green-100 text-green-500' : 'bg-red-50 border-red-100 text-red-500'}`}
                        >
                            {isPassed ? <Trophy size={40} /> : <XCircle size={40} />}
                        </div>

                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                            {isPassed ? 'Lulus Ujian!' : 'Belum Lulus'}
                        </h1>
                        <div className="inline-block bg-slate-100 border border-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-lg text-sm mb-6">
                            Paket Ujian: {state.examType}
                        </div>
                        <p className="text-slate-500 mb-8 px-4">
                            {isPassed
                                ? 'Selamat, Anda telah menunjukkan pemahaman rambu lalu lintas yang baik.'
                                : 'Jangan menyerah! Terus pelajari materi rambu lalu lintas dan coba lagi.'}
                        </p>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 flex justify-between divide-x divide-slate-200">
                            <div className="px-4 flex-1">
                                <p className="text-sm text-slate-500 font-medium mb-1">Skor Akhir</p>
                                <p className={`text-4xl font-black ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                                    {percentage}%
                                </p>
                            </div>
                            <div className="px-4 flex-1">
                                <p className="text-sm text-slate-500 font-medium mb-2">Statistik Data</p>
                                <div className="flex justify-center items-center gap-4 text-sm font-medium">
                                    <div className="flex items-center gap-1.5 text-green-600">
                                        <CheckCircle size={16} /> {score}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-red-500">
                                        <XCircle size={16} /> {total - score}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 mb-4"
                        >
                            <RefreshCw size={18} />
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>

                {/* Donation Banner */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-3xl shadow-lg shadow-orange-500/20 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-lg flex items-center justify-center md:justify-start gap-2 mb-1">
                            <Heart size={20} className="fill-white" /> Dukung SimulaSIM
                        </h3>
                        <p className="text-orange-100 text-sm">
                            Platform Ujian Simulasi SIM ini sangat terbantu oleh apresiasi ringan ☕ dari para penggunanya agar terus berjalan.
                        </p>
                    </div>
                    <a
                        href="https://mayar.gg/ananw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm whitespace-nowrap"
                    >
                        Beri Dukungan
                    </a>
                </div>

                {/* Feedback Form */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                        <MessageSquare size={20} className="text-blue-500" />
                        Kritik, Saran & Koreksi Soal
                    </h3>
                    <p className="text-sm text-slate-500 mb-5">
                        Menemukan kunci jawaban yang salah, bahasa yang ambigu, atau ingin memberikan masukan perbaikan? Tuliskan di sini.
                    </p>

                    {feedbackStatus === 'success' ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 text-center font-medium">
                            Terima kasih atas masukannya! Kami akan segera meninjaunya. 🎉
                        </div>
                    ) : (
                        <form onSubmit={handleFeedbackSubmit}>
                            <textarea
                                required
                                rows={3}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Cth: Soal nomor ... pada kategori Wawasan sebaiknya menggunakan gambar agar lebih jelas."
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-y mb-3 text-sm"
                            />
                            {feedbackStatus === 'error' && (
                                <p className="text-red-500 text-xs font-medium mb-3">Terjadi galat (error) pengiriman. Coba lagi nanti.</p>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting || !feedback.trim()}
                                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                {isSubmitting ? 'Mengirim...' : 'Kirim Masukan'}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}
