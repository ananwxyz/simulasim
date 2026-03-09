import { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { clearUserSession } from '../../lib/session';
import { Trophy, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function QuizResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { score: number; total: number; examType: string } | null;

    useEffect(() => {
        // Clear session so user will have to input name again if they retake
        clearUserSession();
    }, []);

    if (!state) {
        return <Navigate to="/register" replace />;
    }

    const { score, total } = state;
    const percentage = Math.round((score / total) * 100);
    const isPassed = percentage >= 70; // Set passing grade at 70%

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-lg text-center relative overflow-hidden">

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
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        </div>
    );
}
