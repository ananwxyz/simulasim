import { Link } from 'react-router-dom';
import { Bike, Car, ShieldCheck, LayoutDashboard, Award, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

export default function Home() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans selection:bg-blue-500/30 transition-colors duration-500">
            {/* Gradient Overlays */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-indigo-600/10 dark:bg-indigo-600/10 blur-[120px] rounded-full"></div>
            </div>

            {/* Header / Nav */}
            <header className="px-6 py-5 border-b border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur-xl sticky top-0 z-50 transition-colors">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 shadow-inner">
                            <img src="/logo.png" alt="SimulaSIM Logo" className="w-6 h-6 object-contain" />
                        </div>
                        <span className="text-[var(--heading)] font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-[var(--heading)] to-[var(--subtext)]">
                            SimulaSIM
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--subtext)]">
                            <a href="#features" className="hover:text-blue-500 transition-colors">Fitur</a>
                            <a href="#modul" className="hover:text-blue-500 transition-colors">Materi</a>
                            <a href="https://ananw.xyz" target="_blank" className="hover:text-blue-500 transition-colors">Tentang</a>
                        </nav>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://mayar.gg/ananw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 text-sm font-bold bg-slate-100 dark:bg-white/5 hover:scale-105 border border-slate-200 dark:border-white/10 rounded-full transition-all flex items-center gap-2 text-slate-900 dark:text-blue-400"
                            >
                                ☕ <span className="hidden sm:inline">Donasi</span>
                            </a>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-40">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Official Theory Quiz 2026
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--heading)] tracking-tight leading-[1.1] lg:leading-[1.1]">
                                Lulus Ujian SIM <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                                    dengan Percaya Diri.
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-[var(--subtext)] max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium transition-colors">
                                Latih insting berkendara Anda dengan simulasi kuis interaktif yang dirancang sesuai standar resmi ujian teori SIM.
                            </p>

                            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-base transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto justify-center group"
                                >
                                    Mulai Simulasi
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="flex -space-x-3 items-center">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--background)] bg-[var(--card-bg)] flex items-center justify-center text-[10px] font-bold text-[var(--subtext)]">
                                            User
                                        </div>
                                    ))}
                                    <span className="pl-6 text-sm text-[var(--subtext)] font-bold">1,000+ Berlatih</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative group hidden lg:block">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2.5rem] blur opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] overflow-hidden shadow-2xl skew-y-1 lg:skew-y-3 hover:skew-y-0 transition-transform duration-700">
                                <img 
                                    src="/hero-sim.png" 
                                    alt="SimulaSIM Premium Illustration" 
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500 rounded-xl">
                                            <ShieldCheck className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <div className="text-[var(--heading)] font-bold transition-colors">Terverifikasi & Akurat</div>
                                            <div className="text-[var(--subtext)] text-xs font-medium transition-colors">Sesuai dengan kurikulum terbaru 2026</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Modul Section */}
                <section id="modul" className="max-w-7xl mx-auto px-6 pb-32">
                    <div className="p-8 md:p-16 rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-indigo-600/5 dark:from-blue-600/20 dark:to-indigo-600/5 border border-slate-200 dark:border-white/10 relative overflow-hidden transition-colors">
                        <div className="absolute top-0 right-0 p-20 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full"></div>
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-5 whitespace-nowrap transition-colors">
                                    Unduh Materi Resmi.
                                </h2>
                                <p className="text-slate-900 dark:text-slate-400 text-base font-medium mb-8 transition-colors">
                                    Pelajari teori berkendaraan langsung dari sumbernya sebelum memulai simulasi.
                                </p>
                                <div className="space-y-4">
                                    {['Materi Rambu', 'Etika Berkendara', 'Teknis Kendaraan'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-slate-900 dark:text-white font-bold transition-colors">
                                            <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400 shadow-blue-500/20 shadow-lg" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* SIM C Modules */}
                                <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-3xl p-6 hover:bg-[var(--card-accent)] transition-all shadow-lg shadow-slate-200/50 dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--card-border)] transition-colors">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 transition-colors">
                                            <Bike size={24} />
                                        </div>
                                        <span className="font-black text-[var(--heading)] dark:text-white text-base transition-colors">SIM C</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[1, 2, 3, 4].map((num) => (
                                            <a
                                                key={`sim-c-${num}`}
                                                href={`/Sim-C-Modul-${num}.pdf`}
                                                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:bg-blue-600 hover:text-white transition-all text-slate-900 dark:text-white font-black text-xs group"
                                            >
                                                M{num}
                                                <Download size={14} className="mt-1 text-blue-600 dark:text-blue-400/50 group-hover:text-white transition-colors" />
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* SIM A Modules */}
                                <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-3xl p-6 hover:bg-[var(--card-accent)] transition-all shadow-lg shadow-slate-200/50 dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--card-border)] transition-colors">
                                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400 transition-colors">
                                            <Car size={24} />
                                        </div>
                                        <span className="font-black text-[var(--heading)] dark:text-white text-base transition-colors">SIM A</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[1, 2, 3, 4].map((num) => (
                                            <a
                                                key={`sim-a-${num}`}
                                                href={`/Sim-A-Modul-${num}.pdf`}
                                                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:bg-amber-600 hover:text-white transition-all text-slate-900 dark:text-white font-black text-xs group"
                                            >
                                                M{num}
                                                <Download size={14} className="mt-1 text-amber-600 dark:text-amber-400/50 group-hover:text-white transition-colors" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="max-w-7xl mx-auto px-6 pb-32">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white transition-colors">Fitur Unggul</h2>
                        <p className="text-slate-900 dark:text-slate-400 max-w-xl mx-auto text-sm font-medium transition-colors">Teknologi pembelajaran interaktif untuk hasil maksimal.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <ShieldCheck size={32} />,
                                title: "Sesuai Standar",
                                desc: "Materi ujian komprehensif dari uji Pengetahuan, Wawasan, hingga Persepsi Bahaya.",
                                color: "blue"
                            },
                            {
                                icon: <LayoutDashboard size={32} />,
                                title: "Akses Mudah",
                                desc: "Berlatih kapan saja. Tampilan adaptif nyaman di layar ponsel maupun komputer.",
                                color: "indigo"
                            },
                            {
                                icon: <Award size={32} />,
                                title: "Evaluasi Akurat",
                                desc: "Ketahui kelayakan Anda dengan skor otomatis dan validasi kelulusan.",
                                color: "emerald"
                            }
                        ].map((f, i) => (
                            <div key={i} className="group p-10 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-blue-500/30 hover:bg-[var(--card-accent)] transition-all duration-500 shadow-xl">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border shadow-inner group-hover:scale-110 transition-transform ${
                                    f.color === 'blue' ? 'bg-blue-500/10 text-blue-600 border-blue-200' :
                                    f.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-200' :
                                    'bg-emerald-500/10 text-emerald-600 border-emerald-200'
                                }`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-extrabold text-[var(--heading)] mb-3 transition-colors">{f.title}</h3>
                                <p className="text-slate-900 dark:text-white/80 text-sm leading-relaxed font-medium transition-colors">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="py-10 border-t border-[var(--card-border)] bg-[var(--card-bg)] relative z-20 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6 text-center transition-colors">
                    <div className="space-y-4">
                        <p className="text-[var(--subtext)] text-sm font-medium transition-colors">&copy; {new Date().getFullYear()} SimulaSIM. Dedicated to road safety awareness.</p>
                        <div className="flex justify-center gap-6">
                            <a href="https://ananw.xyz" target="_blank" rel="noopener noreferrer" className="text-[var(--subtext)] opacity-60 hover:opacity-100 hover:text-blue-500 font-black text-xs tracking-widest transition-all tracking-[0.2em]">
                                created by ananw.xyz
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
