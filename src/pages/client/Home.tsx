import { Link } from 'react-router-dom';
import { Bike, Car, ShieldCheck, Clock, Award, ArrowRight, Download } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header / Nav */}
            <header className="px-6 py-6 border-b border-slate-200 bg-white sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 text-blue-600 font-extrabold text-2xl tracking-tighter">
                        <Bike size={32} />
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
                    <div className="pt-4 flex flex-col items-center justify-center gap-3 text-slate-600 font-medium">
                        <span className="text-sm">Pelajari materi ujian resmi:</span>
                        <div className="flex flex-wrap justify-center gap-3">
                            <a
                                href="/Sim-C-Modul-1.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white hover:bg-blue-50 hover:border-blue-200 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-sm hover:shadow"
                            >
                                <Bike size={18} className="text-blue-600" />
                                Modul SIM C
                                <Download size={16} className="text-slate-400 ml-1" />
                            </a>
                            <a
                                href="/Sim-A-Modul-1.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white hover:bg-amber-50 hover:border-amber-200 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-sm hover:shadow"
                            >
                                <Car size={18} className="text-amber-600" />
                                Modul SIM A
                                <Download size={16} className="text-slate-400 ml-1" />
                            </a>
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
                            <Clock size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Waktu Terukur</h3>
                        <p className="text-slate-600 leading-relaxed">Dilengkapi dengan sesi berbasis waktu untuk melatih kecepatan pengambilan keputusan partisipan di lapangan.</p>
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
