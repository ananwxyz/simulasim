import { Link } from 'react-router-dom';
import { Bike, Car, ShieldCheck, LayoutDashboard, Award, ArrowRight, Download } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header / Nav */}
            <header className="px-6 py-6 border-b border-slate-200 bg-white sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 text-blue-600 font-extrabold text-2xl tracking-tighter">
                        <img src="/logo.png" alt="SimulaSIM Logo" className="w-8 h-8 object-contain" />
                        SimulaSIM
                    </div>
                    <div className="flex gap-4">
                        <a
                            href="https://mayar.gg/ananw" // Ganti dengan link donasi Anda
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-bold text-black-500 bg-black-50 hover:bg-black-100 rounded-full transition-colors flex items-center gap-1.5"
                        >
                            ☕ Donasi
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold tracking-wide">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        Platform Ujian Teori SIM Interaktif
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Wujudkan Perjalanan Aman dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SimulaSIM.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Latih insting berkendara Anda. Kami menguji wawasan berlalu lintas, pengenalan rambu, dan persepsi bahaya sebelum Anda terjun ke jalan raya.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center group"
                        >
                            Mulai Simulasi Kuis
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#features"
                            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center w-full sm:w-auto"
                        >
                            Fitur Keunggulan
                        </a>
                    </div>

                    {/* Modul Download Section */}
                    <div className="pt-6 flex flex-col items-center justify-center gap-4 text-slate-600 font-medium w-full max-w-2xl mx-auto">
                        <span className="text-sm">📚 Pelajari materi ujian resmi:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {/* SIM C Modules */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                    <Bike size={18} className="text-blue-600" />
                                    <span className="font-bold text-slate-800 text-sm">SIM C — Sepeda Motor</span>
                                </div>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map((num) => (
                                        <a
                                            key={`sim-c-${num}`}
                                            href={`/Sim-C-Modul-${num}.pdf`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all group"
                                        >
                                            <span>Modul {num}</span>
                                            <Download size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            {/* SIM A Modules */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                    <Car size={18} className="text-amber-600" />
                                    <span className="font-bold text-slate-800 text-sm">SIM A — Mobil Penumpang</span>
                                </div>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map((num) => (
                                        <a
                                            key={`sim-a-${num}`}
                                            href={`/Sim-A-Modul-${num}.pdf`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-all group"
                                        >
                                            <span>Modul {num}</span>
                                            <Download size={14} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div id="features" className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Sesuai Standar</h3>
                        <p className="text-slate-600 leading-relaxed">Materi ujian komprehensif dari uji Pengetahuan, Wawasan, hingga studi kasus Persepsi Bahaya (Video).</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                            <LayoutDashboard size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Akses Mudah & Fleksibel</h3>
                        <p className="text-slate-600 leading-relaxed">Berlatih soal ujian kapan saja dan di mana saja. Tampilan aplikasi yang adaptif nyaman digunakan baik di layar ponsel maupun komputer.</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                            <Award size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Evaluasi Akurat</h3>
                        <p className="text-slate-600 leading-relaxed">Ketahui seberapa layak Anda mengemudi dengan kalkulasi skor otomatis yang dinamis dan validasi minimum kelulusan.</p>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 bg-white">
                <p>
                    &copy; {new Date().getFullYear()} SimulaSIM. Dibuat untuk kesadaran berlalu lintas.
                    <span className="mx-1">-</span>
                    <a href="https://ananw.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 font-medium transition-colors">
                        ananw.xyz
                    </a>
                </p>
            </footer>
        </div>
    );
}
