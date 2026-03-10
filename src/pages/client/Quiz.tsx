import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getUserSession, clearUserSession } from '../../lib/session';
import type { Question, QuestionOption } from '../../types/database';
import { Loader2, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';

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

    useEffect(() => {
        if (!session) {
            navigate('/register');
            return;
        }
        fetchQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, navigate]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const examType = session?.examType || 'SIM C';

            // Ambil semua soal untuk tipe ujian ini sekaligus
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('exam_type', examType);

            if (error) throw error;

            const qData = data || [];

            // Fungsi untuk mengacak (shuffle) array soal menggunakan algoritma Fisher-Yates
            const shuffleArray = <T,>(array: T[]): T[] => {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            };

            // Filter berdasarkan kategori, lalu acak susunannya, baru potong (slice) sesuai kuota
            const bahaya = shuffleArray(qData.filter(q => q.material_category === 'Persepsi Bahaya')).slice(0, 25);
            const wawasan = shuffleArray(qData.filter(q => q.material_category === 'Wawasan')).slice(0, 20);
            const pengetahuan = shuffleArray(qData.filter(q => q.material_category === 'Pengetahuan')).slice(0, 20);

            const allQuestions = [
                ...(bahaya),
                ...(wawasan),
                ...(pengetahuan)
            ];

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
        if (isAnswered) return; // Prevent changing answer after locked

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
        if (window.confirm('Apakah Anda yakin ingin membatalkan dan keluar dari ujian? Progres Anda saat ini TIDAK akan tersimpan.')) {
            clearUserSession(); // Bersihkan sesi kuis yang aktif
            navigate('/');
        }
    };

    const handleCompleteQuiz = async () => {
        if (!session) return;
        try {
            // Submit result to DB
            const { error } = await supabase.from('test_results').insert([{
                user_email: session.email,
                exam_type_taken: session.examType,
                score: score,
                total_questions: questions.length
            }]).select();

            if (error) {
                console.error("Gagal simpan skor test_results:", error);
                // Kita biarkan user lewat meskipun gagal simpan, tapi errornya dilog.
            }

            // Navigate to Result Page
            navigate('/result', { state: { score, total: questions.length, examType: session.examType } });

        } catch (err) {
            console.error("Error saving result", err);
            // Fallback navigate anyway
            navigate('/result', { state: { score, total: questions.length, examType: session.examType } });
        }
    };

    const getOptionStyle = (option: QuestionOption): string => {
        if (!isAnswered) {
            return selectedOption === option.id
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50";
        }

        // After Answered (Live Feedback)
        if (option.isCorrect) {
            return "border-green-500 bg-green-50 z-10 ring-1 ring-green-500";
        }
        if (selectedOption === option.id && !option.isCorrect) {
            return "border-red-500 bg-red-50";
        }

        return "border-slate-200 bg-slate-50 opacity-60 cursor-default";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-slate-500">Menyiapkan bank soal Anda...</p>
            </div>
        );
    }

    if (questions.length === 0) return null;

    const currentQ = questions[currentIndex];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Quiz Header Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExit}
                            className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Keluar dari Ujian"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="hidden md:block">
                            <p className="text-sm text-slate-500 font-medium">
                                Peserta: <span className="text-slate-900 mr-3">{session?.name}</span>
                                <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded text-xs font-bold tracking-tight">
                                    Paket: {session?.examType || 'SIM C'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-500">
                                {questions.length > 0 && (
                                    <>
                                        {questions[currentIndex].material_category === 'Persepsi Bahaya' ? 'Sesi 1' :
                                            questions[currentIndex].material_category === 'Wawasan' ? 'Sesi 2' : 'Sesi 3'}
                                        <span className="mx-2">|</span>
                                    </>
                                )}
                                Soal
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
                                {currentIndex + 1} / {questions.length}
                            </span>
                            {questions.length > 0 && (
                                <span className="hidden sm:inline-block bg-blue-600 text-white px-2.5 py-1 rounded ml-2 text-xs font-bold tracking-tight shadow-sm">
                                    {questions[currentIndex].material_category}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-slate-100 w-full">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex-1">

                    {/* Question Text */}
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
                        {currentQ.question_text}
                    </h2>

                    {/* Dynamic Media Renderer */}
                    {currentQ.media_url && currentQ.media_type && (
                        <div className="mb-8 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex justify-center items-center">
                            {currentQ.media_type === 'image' ? (
                                <img
                                    src={currentQ.media_url}
                                    alt="Ilustrasi soal"
                                    className="max-h-[350px] w-full object-contain"
                                    loading="lazy"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Gagal+Memuat+Gambar' }}
                                />
                            ) : currentQ.media_type === 'video' ? (
                                <video
                                    src={currentQ.media_url}
                                    controls
                                    playsInline
                                    loop
                                    controlsList="nodownload"
                                    preload="metadata"
                                    className="max-h-[350px] w-full bg-black"
                                >
                                    Browser Anda tidak mendukung HTML5 video.
                                </video>
                            ) : null}
                        </div>
                    )}

                    {/* Options Grid */}
                    <div className="space-y-4">
                        {currentQ.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                disabled={isAnswered}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${getOptionStyle(option)}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm border 
                    ${isAnswered && option.isCorrect ? 'bg-green-500 text-white border-green-600' :
                                            isAnswered && selectedOption === option.id && !option.isCorrect ? 'bg-red-500 text-white border-red-600' :
                                                selectedOption === option.id ? 'bg-blue-500 text-white border-blue-600' : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-blue-100 group-hover:text-blue-700'
                                        }`}
                                    >
                                        {option.id}
                                    </span>
                                    <span className={`text-base font-medium ${isAnswered && option.isCorrect ? 'text-green-800' :
                                        isAnswered && selectedOption === option.id && !option.isCorrect ? 'text-red-800' :
                                            selectedOption === option.id ? 'text-blue-800' : 'text-slate-700'
                                        }`}>
                                        {option.text}
                                    </span>
                                </div>

                                {isAnswered && option.isCorrect && (
                                    <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
                                )}
                                {isAnswered && selectedOption === option.id && !option.isCorrect && (
                                    <XCircle className="text-red-500 flex-shrink-0" size={24} />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Action Area */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleNext}
                            disabled={!isAnswered}
                            className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all
                ${isAnswered
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 translate-y-0'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-0 translate-y-4 hidden'
                                }`}
                        >
                            {currentIndex < questions.length - 1 ? 'Soal Selanjutnya' : 'Selesaikan Kuis & Lihat Hasil'}
                        </button>
                        {!isAnswered && (
                            <div className="px-5 py-3 rounded-lg flex items-center gap-2 text-slate-500 border border-slate-200 bg-slate-50 text-sm italic">
                                <AlertCircle size={16} /> Pilih jawaban untuk melanjutkan
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
