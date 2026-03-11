import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { saveUserSession, getUserSession } from '../../lib/session';
import { Car, Bike, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [examType, setExamType] = useState<'SIM A' | 'SIM C'>('SIM C');
    const [moduleNumber, setModuleNumber] = useState<1 | 2 | 3 | 4>(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user already has an active session
        const session = getUserSession();
        if (session) {
            navigate('/quiz');
        }
    }, [navigate]);

    const handleBack = () => {
        if (name.trim() || email.trim()) {
            if (window.confirm('Apakah Anda yakin ingin ke halaman utama? Data yang Anda ketik akan hilang.')) {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Make sure user exists in Supabase (Lightweight Identify sync)
            // Upsert: Insert if not exists, update name if exists
            const { error } = await supabase
                .from('users')
                .upsert(
                    { email: email.toLowerCase(), name: name },
                    { onConflict: 'email' }
                )
                .select();

            if (error) {
                console.error("Gagal menyimpan data user:", error);
                throw error;
            }

            // 2. Save session locally
            saveUserSession({
                name,
                email: email.toLowerCase(),
                examType,
                moduleNumber,
                startedAt: Date.now()
            });

            // 3. Navigate to quiz
            navigate('/quiz');
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat memulai sesi. Silakan coba lagi.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative">
            {/* Navigasi Kembali */}
            <div className="absolute top-6 left-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-all shadow-sm"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </button>
            </div>

            {/* Hero Header */}
            <div className="text-center max-w-lg mx-auto mb-10 pt-16 md:pt-0">
                <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full text-blue-600 mb-6 shadow-sm">
                    <Car size={40} />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Siap Ujian <span className="text-blue-600">SIM?</span>
                </h1>
                <p className="text-lg text-slate-600">
                    Uji pemahaman Anda tentang rambu dan tata tertib lalu lintas secara interaktif dalam simulasi ujian teori Surat Izin Mengemudi.
                </p>
            </div>

            {/* Registration Form Card */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-md">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Mulai Kuis Sekarang</h3>
                <form onSubmit={handleStart} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Cth: Budi Santoso"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Alamat Email <span className="text-slate-400 font-normal">(untuk rekap nilai)</span>
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="budi@example.com"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Pilihan Paket Ujian */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">
                            Pilih Paket Ujian <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all shadow-sm ${examType === 'SIM C' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
                                <input type="radio" name="examType" value="SIM C" className="hidden" checked={examType === 'SIM C'} onChange={() => setExamType('SIM C')} />
                                <Bike size={24} />
                                <span className="font-bold text-lg">SIM C</span>
                                <span className="text-xs text-center opacity-80 leading-tight">Sepeda Motor</span>
                            </label>
                            <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all shadow-sm ${examType === 'SIM A' ? 'border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-500/20' : 'border-slate-200 bg-white hover:border-amber-300'}`}>
                                <input type="radio" name="examType" value="SIM A" className="hidden" checked={examType === 'SIM A'} onChange={() => setExamType('SIM A')} />
                                <Car size={24} />
                                <span className="font-bold text-lg">SIM A</span>
                                <span className="text-xs text-center opacity-80 leading-tight">Mobil Penumpang</span>
                            </label>
                        </div>
                    </div>

                    {/* Pilihan Modul */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">
                            Pilih Modul <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {([1, 2, 3, 4] as const).map((num) => (
                                <label
                                    key={num}
                                    className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center gap-1 transition-all shadow-sm ${moduleNumber === num ? 'border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-500/20' : 'border-slate-200 bg-white hover:border-violet-300'}`}
                                >
                                    <input type="radio" name="moduleNumber" value={num} className="hidden" checked={moduleNumber === num} onChange={() => setModuleNumber(num)} />
                                    <span className="font-bold text-base">Modul {num}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name.trim() || !email.trim()}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Mengatur Sesi...
                            </>
                        ) : (
                            <>
                                Mulai Simulasi
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
