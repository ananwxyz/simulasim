import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { QuestionOption } from '../../types/database';
import { ArrowLeft, Save, Loader2, Plus, Trash2, UploadCloud, X } from 'lucide-react';

export default function QuestionForm() {
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);

    // Form State
    const [examType, setExamType] = useState<'SIM A' | 'SIM C'>('SIM C');
    const [materialCategory, setMaterialCategory] = useState<'Persepsi Bahaya' | 'Wawasan' | 'Pengetahuan'>('Pengetahuan');
    const [questionText, setQuestionText] = useState('');
    const [mediaType, setMediaType] = useState<'video' | 'image' | ''>('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const [options, setOptions] = useState<QuestionOption[]>([
        { id: 'A', text: '', isCorrect: true },
        { id: 'B', text: '', isCorrect: false },
        { id: 'C', text: '', isCorrect: false },
    ]);

    useEffect(() => {
        if (isEditing && id) {
            fetchQuestionDetails(id);
        }
    }, [id]);

    const fetchQuestionDetails = async (questionId: string) => {
        try {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('id', questionId)
                .single();

            if (error) throw error;
            if (data) {
                setExamType(data.exam_type || 'SIM C');
                setMaterialCategory(data.material_category || 'Pengetahuan');
                setQuestionText(data.question_text);
                setMediaType(data.media_type || '');
                setMediaUrl(data.media_url || '');
                if (data.media_url) setPreviewUrl(data.media_url);
                setOptions(data.options);
            }
        } catch (err) {
            console.error(err);
            alert('Gagal memuat soal');
            navigate('/admin/questions');
        } finally {
            setFetching(false);
        }
    };

    const handleAddOption = () => {
        const nextId = String.fromCharCode(65 + options.length); // A, B, C, D...
        setOptions([...options, { id: nextId, text: '', isCorrect: false }]);
    };

    const handleRemoveOption = (indexToRemove: number) => {
        if (options.length <= 2) {
            alert('Minimal harus ada 2 opsi jawaban!');
            return;
        }

        const newOptions = options.filter((_, idx) => idx !== indexToRemove).map((opt, idx) => ({
            ...opt,
            id: String.fromCharCode(65 + idx) // Re-assign IDs to be sequential
        }));

        // Ensure at least one true answer remains
        if (!newOptions.some(opt => opt.isCorrect)) {
            newOptions[0].isCorrect = true;
        }

        setOptions(newOptions);
    };

    const handleMarkCorrect = (index: number) => {
        setOptions(options.map((opt, idx) => ({
            ...opt,
            isCorrect: idx === index
        })));
    };

    const handleOptionChange = (index: number, text: string) => {
        const newOptions = [...options];
        newOptions[index].text = text;
        setOptions(newOptions);
    };

    const validateForm = () => {
        if (!questionText.trim()) return 'Pertanyaan tidak boleh kosong';
        if (options.some(opt => !opt.text.trim())) return 'Semua opsi jawaban harus diisi';
        if (!options.some(opt => opt.isCorrect)) return 'Pilih minimal 1 kunci jawaban benar';
        if (mediaType && (!mediaUrl.trim() && !mediaFile)) return 'Gambar/Video harus diunggah jika Tipe Media dipilih';
        return null;
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        if (e.clipboardData.files && e.clipboardData.files.length > 0) {
            const file = e.clipboardData.files[0];
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                setMediaFile(file);
                setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
                setPreviewUrl(URL.createObjectURL(file));
                e.preventDefault();
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setMediaFile(file);
            setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearMedia = () => {
        setMediaFile(null);
        setPreviewUrl('');
        setMediaUrl('');
        setMediaType('');
    };

    const checkDuplicate = async () => {
        // Cek apakah ada teks pertanyaan yang sama persis (case-insensitive) di kategori yang sama
        let query = supabase
            .from('questions')
            .select('id')
            .eq('exam_type', examType)
            .eq('material_category', materialCategory)
            .ilike('question_text', questionText.trim());

        if (isEditing && id) {
            // Kecualikan ID yang sedang di-edit itu sendiri
            query = query.neq('id', id);
        }

        const { data, error } = await query;
        if (error) {
            console.error("Gagal memeriksa duplikasi:", error);
            return false;
        }
        return data && data.length > 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errorMsg = validateForm();
        if (errorMsg) {
            alert(errorMsg);
            return;
        }

        setLoading(true);
        try {
            // Validasi Soal Ganda
            const isDuplicate = await checkDuplicate();
            if (isDuplicate) {
                alert(`Gagal! Soal dengan pertanyaan yang persis sama sudah ada di dalam paket ${examType} - ${materialCategory}.`);
                setLoading(false);
                return;
            }

            let finalMediaUrl = mediaUrl;

            // Handle the actual File upload to Supabase Storage if local file exists
            if (mediaFile) {
                const fileExt = mediaFile.name.split('.').pop() || 'png';
                const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
                const filePath = `questions/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('media') // The bucket we'll create via SQL
                    .upload(filePath, mediaFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('media')
                    .getPublicUrl(filePath);

                finalMediaUrl = publicUrl;
            }

            const payload = {
                exam_type: examType,
                material_category: materialCategory,
                question_text: questionText,
                media_type: mediaType || null,
                media_url: finalMediaUrl || null,
                options,
            };

            if (isEditing) {
                const { error } = await supabase.from('questions').update(payload).eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('questions').insert([payload]);
                if (error) throw error;
            }

            navigate('/admin/questions');
        } catch (err: any) {
            console.error(err);
            alert('Gagal menyimpan soal: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="py-20 text-center text-slate-500">Memuat rincian soal...</div>;
    }

    return (
        <div className="max-w-3xl">
            <header className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/questions')}
                    className="p-2 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {isEditing ? 'Edit Soal' : 'Buat Soal Baru'}
                    </h2>
                </div>
            </header>

            <form onSubmit={handleSubmit} onPaste={handlePaste} className="space-y-6 bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">

                {/* Category Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Tipe Ujian SIM <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={examType}
                            onChange={(e) => setExamType(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                        >
                            <option value="SIM C">SIM C (Sepeda Motor)</option>
                            <option value="SIM A">SIM A (Mobil Penumpang)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Sub-Materi Ujian <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={materialCategory}
                            onChange={(e) => setMaterialCategory(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="Pengetahuan">Pengetahuan</option>
                            <option value="Wawasan">Wawasan</option>
                            <option value="Persepsi Bahaya">Persepsi Bahaya</option>
                        </select>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Media Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Tipe Media Pendukung
                        </label>
                        <select
                            value={mediaType}
                            onChange={(e) => setMediaType(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            <option value="">- Tanpa Media -</option>
                            <option value="image">Gambar (Image)</option>
                            <option value="video">Video</option>
                        </select>
                        {mediaType && (
                            <p className="text-xs text-slate-500 mt-2">
                                Anda dapat menekan <kbd className="bg-slate-200 px-1 rounded">Ctrl+V</kbd> di area mana saja untuk mem-<i>paste</i> gambar.
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Upload Media/File (Opsional)
                        </label>

                        {!previewUrl ? (
                            <label className={`w-full flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer ${mediaType ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' : 'border-slate-200 bg-slate-50'}`}>
                                <UploadCloud size={32} className={`mb-2 ${mediaType ? 'text-blue-500' : 'text-slate-400'}`} />
                                <span className={`text-sm font-medium ${mediaType ? 'text-blue-700' : 'text-slate-500'}`}>Klik untuk browse, atau Paste (Ctrl+V)</span>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        ) : (
                            <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center h-40 group">
                                {mediaType === 'image' ? (
                                    <img src={previewUrl} alt="Preview" className="h-full object-contain" />
                                ) : (
                                    <video src={previewUrl} className="h-full bg-black object-cover w-full" controls={false} />
                                )}
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={clearMedia}
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform transition hover:scale-110 shadow-lg"
                                        title="Hapus Media"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Question Text */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pertanyaan Utama <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        required
                        rows={4}
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Ketik pertanyan yang akan diujikan di sini..."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                    />
                </div>

                <hr className="border-slate-100" />

                {/* Options */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-slate-700">
                            Opsi Jawaban & Kunci Benar <span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1"
                        >
                            <Plus size={16} /> Tambah Opsi
                        </button>
                    </div>

                    <div className="space-y-3">
                        {options.map((option, index) => (
                            <div key={option.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${option.isCorrect ? 'bg-green-50/50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>

                                {/* Correct Answer Radios */}
                                <div className="pt-2.5 pl-2" title="Jadikan Kunci Jawaban">
                                    <input
                                        type="radio"
                                        name="correct-answer"
                                        checked={option.isCorrect}
                                        onChange={() => handleMarkCorrect(index)}
                                        className="w-5 h-5 text-green-600 focus:ring-green-500 border-slate-300 cursor-pointer"
                                    />
                                </div>

                                {/* Option Identifier Label */}
                                <div className="pt-2 font-bold text-slate-500 min-w-[30px] text-center">
                                    {option.id}.
                                </div>

                                {/* Option Text Input */}
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        required
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Jawaban ${option.id}...`}
                                        className={`w-full bg-white border outline-none px-3 py-2 rounded-md transition-all ${option.isCorrect ? 'border-green-300 focus:ring-2 focus:ring-green-400' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'}`}
                                    />
                                </div>

                                {/* Delete Option Button */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOption(index)}
                                    className="pt-2 text-slate-400 hover:text-red-500 transition-colors px-2"
                                    title="Hapus Opsi"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-4 mt-6 flex justify-end items-center gap-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/questions')}
                        className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Simpan Soal
                    </button>
                </div>
            </form>
        </div>
    );
}
