import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalTests: 0,
        mediaPercentage: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Get all questions to calculate count and media percentage
            const { data: questions, error: qError } = await supabase
                .from('questions')
                .select('id, media_url');

            if (qError) throw qError;

            // Get count of all test run results
            const { count: testCount, error: tError } = await supabase
                .from('test_results')
                .select('*', { count: 'exact', head: true });

            if (tError) throw tError;

            const qTotal = questions?.length || 0;
            const qWithMedia = questions?.filter(q => q.media_url).length || 0;
            const pct = qTotal === 0 ? 0 : Math.round((qWithMedia / qTotal) * 100);

            setStats({
                totalQuestions: qTotal,
                totalTests: testCount || 0,
                mediaPercentage: pct
            });

        } catch (err) {
            console.error('Error fetching dashboard stats', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Selamat datang, Admin</h2>
                <p className="text-slate-500 mt-1">Ringkasan pangkalan data soal ujian SIM saat ini.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Soal Aktif</p>
                    <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold text-slate-800">{loading ? '-' : stats.totalQuestions}</p>
                        {loading && <Loader2 size={16} className="animate-spin text-slate-400" />}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Kuis Selesai</p>
                    <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold text-slate-800">{loading ? '-' : stats.totalTests}</p>
                        {loading && <Loader2 size={16} className="animate-spin text-slate-400" />}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <p className="text-sm font-medium text-slate-500 mb-1">Rasio Ber-Media</p>
                    <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold text-slate-800">{loading ? '-' : `${stats.mediaPercentage}%`}</p>
                        {loading && <Loader2 size={16} className="animate-spin text-slate-400" />}
                    </div>
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                <h3 className="font-semibold text-indigo-900">Pusat Manajemen Bank Soal</h3>
                <p className="text-indigo-700/80 max-w-lg text-sm">
                    Navigasi ke menu "Bank Soal" di samping untuk meninjau secara mendetail pertanyaan, opsi, serta tautan eksternal media pendukung untuk ujian SIM elektronik ini.
                </p>
                <Link
                    to="/admin/questions"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    Kelola Soal Sekarang
                </Link>
            </div>
        </>
    );
}
