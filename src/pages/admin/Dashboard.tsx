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
    const [recentTests, setRecentTests] = useState<any[]>([]);
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

            // Get recent test results joined with user data
            const { data: testsData, error: rError } = await supabase
                .from('test_results')
                .select(`
                    id,
                    score,
                    total_questions,
                    exam_type_taken,
                    completed_at,
                    users (
                        name,
                        email
                    )
                `)
                .order('completed_at', { ascending: false })
                .limit(10);

            if (rError) throw rError;

            const qTotal = questions?.length || 0;
            const qWithMedia = questions?.filter(q => q.media_url).length || 0;
            const pct = qTotal === 0 ? 0 : Math.round((qWithMedia / qTotal) * 100);

            setStats({
                totalQuestions: qTotal,
                totalTests: testCount || 0,
                mediaPercentage: pct
            });

            setRecentTests(testsData || []);

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

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 mb-8">
                <div>
                    <h3 className="font-semibold text-indigo-900 mb-1">Pusat Manajemen Bank Soal</h3>
                    <p className="text-indigo-700/80 max-w-lg text-sm">
                        Navigasi ke menu "Bank Soal" di samping untuk meninjau secara mendetail pertanyaan, opsi, serta tautan eksternal media pendukung untuk ujian SIM elektronik ini.
                    </p>
                </div>
                <Link
                    to="/admin/questions"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm shrink-0 whitespace-nowrap"
                >
                    Kelola Soal Sekarang
                </Link>
            </div>

            {/* Riwayat Kuis User */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Riwayat Ujian Peserta Baru-Baru Ini</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-50 text-slate-700 font-medium">
                            <tr>
                                <th className="px-6 py-4">Peserta (Nama & Email)</th>
                                <th className="px-6 py-4">Paket</th>
                                <th className="px-6 py-4">Skor & Kelulusan</th>
                                <th className="px-6 py-4">Waktu Ujian</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                        <Loader2 size={24} className="animate-spin mx-auto text-blue-500 mb-2" />
                                        Memuat riwayat ujian...
                                    </td>
                                </tr>
                            ) : recentTests.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                        Belum ada riwayat ujian yang terekam.
                                    </td>
                                </tr>
                            ) : (
                                recentTests.map((t) => {
                                    // Hitung persen dan kelulusan
                                    const percentage = t.total_questions > 0 ? Math.round((t.score / t.total_questions) * 100) : 0;
                                    const isPassed = percentage >= 70;

                                    // Karena Supabase FK return sebagai object array tunggal jika One-to-One
                                    const userName = t.users?.name || 'Anonim';
                                    const userEmail = t.users?.email || 'N/A';

                                    return (
                                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                {userName}
                                                <div className="text-xs text-slate-400 font-normal mt-0.5">{userEmail}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold font-mono">
                                                    {t.exam_type_taken}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-700 mb-1">
                                                    {t.score} <span className="text-slate-400 font-normal">/ {t.total_questions}</span> ({percentage}%)
                                                </div>
                                                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {isPassed ? 'LULUS' : 'TINGKATKAN'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(t.completed_at).toLocaleString('id-ID', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
