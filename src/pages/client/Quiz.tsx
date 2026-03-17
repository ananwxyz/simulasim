import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getUserSession, clearUserSession } from '../../lib/session';
import type { Question } from '../../types/database';
import { Loader2, AlertCircle, X } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

export default function QuizSession() {
    const navigate = useNavigate();
    const [session] = useState(getUserSession());

    // Data State
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    // Quiz State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); // 30s per question
    const [showExitModal, setShowExitModal] = useState(false);

    useEffect(() => {
        if (!session) {
            navigate('/register');
            return;
        }
        fetchQuestions();
    }, [session, navigate]);

    // Timer Logic
    useEffect(() => {
        if (loading || questions.length === 0 || isAnswered) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleNext();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, loading, questions.length, isAnswered]);

    // Reset timer on new question
    useEffect(() => {
        setTimeLeft(30);
    }, [currentIndex]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const examType = session?.examType || 'SIM C';
            const moduleNum = session?.moduleNumber || 1;

            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('exam_type', examType)
                .eq('module_number', moduleNum);

            if (error) throw error;

            const qData = data || [];

            const shuffleArray = <T,>(array: T[]): T[] => {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            };

            const bahaya = shuffleArray(qData.filter(q => q.material_category === 'Persepsi Bahaya')).slice(0, 25);
            const wawasan = shuffleArray(qData.filter(q => q.material_category === 'Wawasan')).slice(0, 20);
            const pengetahuan = shuffleArray(qData.filter(q => q.material_category === 'Pengetahuan')).slice(0, 20);

            const allQuestions = [...bahaya, ...wawasan, ...pengetahuan];

            if (allQuestions.length === 0) {
                alert('Bank soal kosong! Harap hubungi Admin.');
                navigate('/register');
                return;
            }

            setQuestions(allQuestions);
        } catch (err) {
            console.error(err);
            alert('Gagal memuat kuis');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (optionId: string) => {
        if (isAnswered) return;

        setSelectedOption(optionId);
        setIsAnswered(true);

        const question = questions[currentIndex];
        const option = question.options.find(o => o.id === optionId);
        if (option?.isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            handleCompleteQuiz();
        }
    };

    const handleExit = () => {
        console.log('EXIT button clicked');
        setShowExitModal(true);
    };

    const confirmExit = () => {
        console.log('EXIT confirmed via Modal');
        clearUserSession();
        navigate('/');
    };

    const handleCompleteQuiz = async () => {
        if (!session) return;
        try {
            await supabase.from('test_results').insert([{
                user_email: session.email,
                exam_type_taken: session.examType,
                score: score,
                total_questions: questions.length
            }]);
            navigate('/result', { state: { score, total: questions.length, examType: session.examType } });
        } catch (err) {
            console.error("Error saving result", err);
            navigate('/result', { state: { score, total: questions.length, examType: session.examType } });
        }
    };

    const getOptionStyle = (optionId: string, isCorrect: boolean): string => {
        if (!isAnswered) {
            return selectedOption === optionId
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 shadow-sm"
                : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:border-blue-200 dark:hover:border-white/10 hover:bg-[var(--card-accent)] hover:text-blue-600 transition-all";
        }

        if (isCorrect) {
            return "border-emerald-500 bg-emerald-50 dark:bg-emerald-600/25 text-emerald-700 dark:text-emerald-400 shadow-sm scale-[1.01]";
        }
        if (selectedOption === optionId && !isCorrect) {
            return "border-rose-500 bg-rose-50 dark:bg-rose-600/25 text-rose-700 dark:text-rose-400 shadow-sm";
        }

        return "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--subtext)] opacity-30 grayscale-[0.8]";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center font-sans text-center px-6 transition-colors duration-500">
                <Loader2 className="animate-spin text-blue-500 mb-6" size={48} />
                <p className="text-[var(--subtext)] font-black uppercase tracking-widest text-[10px]">Menyiapkan Sesi Ujian Anda...</p>
            </div>
        );
    }

    if (questions.length === 0) return null;

    const currentQ = questions[currentIndex];

    return (
        <div className="h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans transition-colors duration-500 selection:bg-blue-500/30 overflow-hidden">
            {/* Unique Header */}
            <header className="bg-[var(--card-bg)]/80 backdrop-blur-xl border-b border-[var(--card-border)] shrink-0 z-50">
                <div className="max-w-screen-2xl mx-auto px-6 h-12 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-1 bg-blue-600/10 rounded-lg border border-blue-500/20">
                            <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain" />
                        </div>
                        <div className="bg-[var(--card-accent)] text-[var(--subtext)] px-3 py-1 rounded-full text-[10px] font-black tracking-tighter border border-[var(--card-border)] whitespace-nowrap shadow-sm">
                            {currentIndex + 1} / {questions.length}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="scale-75 origin-right">
                            <ThemeToggle />
                        </div>

                        <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-black tracking-tighter">{timeLeft}S</span>
                        </div>
                        
                        <button
                            onClick={handleExit}
                            className="relative z-[70] flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 touch-manipulation"
                            title="Exit"
                        >
                            <X size={18} />
                            <span className="hidden sm:inline">EXIT</span>
                        </button>
                    </div>
                </div>
                {/* Thin Progress bar */}
                <div className="h-[2px] bg-[var(--card-accent)] w-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
                    />
                </div>
            </header>

            {/* Main Content Area - Split Screen 70/30 */}
            <main className="flex-1 flex min-h-0 overflow-hidden">
                <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                    
                    {/* Column 1: Media + Question (LEFT - 70%) */}
                    <div className="lg:w-[70%] flex flex-col border-r border-[var(--card-border)] bg-[var(--card-accent)]/30 min-h-0">
                        <div className="flex-1 flex flex-col p-4 lg:p-5 gap-3 min-h-0">
                            {/* Category Label Above Media */}
                            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] bg-blue-500/5 w-fit px-3 py-1 rounded-full border border-blue-500/10">
                                <span className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
                                {currentQ?.material_category} • MODUL {session?.moduleNumber}
                            </div>

                            {/* Media Container - Optimized height */}
                            <div className="flex-[0_1_auto] max-h-[40vh] lg:max-h-[65%] bg-[var(--card-bg)] rounded-xl overflow-hidden border border-[var(--card-border)] shadow-sm flex items-center justify-center relative min-h-[160px] lg:min-h-[200px] p-2 lg:p-3">
                                {currentQ.media_url ? (
                                    <>
                                        {currentQ.media_type === 'image' ? (
                                            <img
                                                src={currentQ.media_url}
                                                alt="Ilustrasi"
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : currentQ.media_type === 'video' ? (
                                            <video
                                                src={currentQ.media_url}
                                                controls
                                                autoPlay
                                                playsInline
                                                loop
                                                className="max-h-full max-w-full bg-black block object-contain rounded-lg"
                                            />
                                        ) : null}
                                    </>
                                ) : (
                                    <div className="text-[var(--subtext)] font-bold uppercase tracking-widest text-[10px]">No Media Content</div>
                                )}
                            </div>

                            {/* Question Section Below Media - Pulled closer */}
                            <div className="shrink-0 space-y-1.5 lg:space-y-2 pt-1">
                                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10 w-fit">
                                    <AlertCircle size={10} className="text-blue-500" />
                                    <p className="text-[9px] lg:text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider">
                                        Silakan klik video dan aktifkan volume
                                    </p>
                                </div>
                                <h2 className="text-sm lg:text-lg xl:text-xl font-bold text-[var(--heading)] leading-tight lg:leading-snug tracking-tight overflow-y-auto custom-scrollbar max-h-[80px] lg:max-h-[100px] pr-2">
                                    {currentQ.question_text}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Options (RIGHT - 30%) */}
                    <div className="lg:w-[30%] flex flex-col bg-[var(--card-bg)] lg:border-l lg:border-[var(--card-border)] min-h-0">
                        <div className="flex-1 flex flex-col p-3 lg:p-6 min-h-0">
                            <div className="mb-2 lg:mb-4 shrink-0 px-1">
                                <h3 className="text-[9px] lg:text-[10px] font-black text-[var(--subtext)] uppercase tracking-[0.2em]">Pilih Jawaban:</h3>
                            </div>
                            
                            <div className="space-y-2 lg:space-y-2.5 flex-1 overflow-y-auto pr-2 gap-2 lg:pr-3 custom-scrollbar min-h-0">
                                {currentQ.options.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionSelect(option.id)}
                                        disabled={isAnswered}
                                        className={`w-full text-left p-2.5 lg:p-3 rounded-lg border transition-all duration-200 flex items-center gap-3 group ${getOptionStyle(option.id, option.isCorrect)}`}
                                    >
                                        <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md font-black text-xs border transition-all duration-200
                                            ${selectedOption === option.id ? 'bg-blue-600 border-blue-400 text-white' : 'bg-[var(--card-accent)] border-[var(--card-border)] text-[var(--subtext)] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 group-hover:border-blue-200 group-hover:text-blue-600'}
                                            ${isAnswered && option.isCorrect ? 'bg-emerald-600 border-emerald-400 text-white' : ''}
                                            ${isAnswered && selectedOption === option.id && !option.isCorrect ? 'bg-rose-600 border-rose-400 text-white' : ''}
                                        `}>
                                            {option.id}
                                        </div>
                                        <span className={`text-xs lg:text-sm font-bold tracking-tight leading-tight transition-colors flex-1`}>
                                            {option.text}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Action Area */}
                            <div className="mt-6 pt-4 border-t border-[var(--card-border)] shrink-0">
                                {isAnswered ? (
                                    <button
                                        onClick={handleNext}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 group"
                                    >
                                        {currentIndex < questions.length - 1 ? 'Lanjutkan' : 'Selesaikan Kuis'}
                                        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-[var(--card-accent)] border border-[var(--card-border)]">
                                        <AlertCircle size={14} className="text-blue-500" />
                                        <span className="text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase tracking-wider">
                                            Pilih satu jawaban
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Compact Footer */}
            <footer className="hidden lg:block py-2.5 border-t border-[var(--card-border)] bg-[var(--card-bg)] shrink-0 transition-colors">
                <div className="max-w-screen-2xl mx-auto px-6 text-center">
                    <p className="text-[var(--subtext)] text-[9px] font-medium transition-colors">
                        © 2026 SimulaSIM. Dedicated to road safety awareness.
                    </p>
                </div>
            </footer>

            {/* EXIT CONFIRMATION MODAL */}
            {showExitModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-8 max-w-sm w-full shadow-2xl scale-in-center overflow-hidden relative">
                        {/* Decorative Background bloob */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                                <AlertCircle size={32} className="text-rose-500" />
                            </div>
                            <h3 className="text-xl font-black text-[var(--heading)] mb-3 leading-tight tracking-tight">Batalkan Ujian?</h3>
                            <p className="text-sm text-[var(--subtext)] mb-8 font-medium leading-relaxed">
                                Apakah Anda yakin ingin membatalkan dan keluar? <br/>
                                <span className="text-rose-500 font-bold">Progres Anda saat ini tidak akan tersimpan.</span>
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowExitModal(false)}
                                    className="py-3 px-4 rounded-xl border border-[var(--card-border)] text-[var(--foreground)] font-black text-[10px] uppercase tracking-widest hover:bg-[var(--card-accent)] transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmExit}
                                    className="py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all"
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}
