import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Question } from '../../types/database';
import { Pencil, Trash2, Plus, Image as ImageIcon, Video, FileText, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminQuestions() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [examFilter, setExamFilter] = useState<string>('Semua');
    const [categoryFilter, setCategoryFilter] = useState<string>('Semua');

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setQuestions(data || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Yakin ingin menghapus soal ini?')) return;

        try {
            const { error } = await supabase.from('questions').delete().eq('id', id);
            if (error) throw error;
            setQuestions((prev) => prev.filter((q) => q.id !== id));
        } catch (error) {
            alert('Gagal menghapus soal');
            console.error(error);
        }
    };

    // Computed Filtered Data
    const filteredQuestions = questions.filter(q => {
        const matchExam = examFilter === 'Semua' || q.exam_type === examFilter;
        const matchCategory = categoryFilter === 'Semua' || q.material_category === categoryFilter;
        return matchExam && matchCategory;
    });

    return (
        <>
            <header className="mb-8 block md:flex justify-between items-end gap-4">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold text-slate-900">Bank Soal</h2>
                    <p className="text-slate-500 mt-1">Kelola data pertanyaan ujian SIM.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            value={examFilter}
                            onChange={(e) => setExamFilter(e.target.value)}
                            className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="Semua">Semua SIM</option>
                            <option value="SIM A">SIM A</option>
                            <option value="SIM C">SIM C</option>
                        </select>
                        <span className="text-slate-300">|</span>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="Semua">Semua Materi</option>
                            <option value="Pengetahuan">Pengetahuan</option>
                            <option value="Wawasan">Wawasan</option>
                            <option value="Persepsi Bahaya">Bahaya</option>
                        </select>
                    </div>

                    <Link
                        to="/admin/questions/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={18} />
                        Tambah Soal
                    </Link>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 w-16 text-center">No.</th>
                                <th className="px-6 py-4 max-w-sm">Pertanyaan</th>
                                <th className="px-6 py-4">Kategori Ujian</th>
                                <th className="px-6 py-4">Tipe Media</th>
                                <th className="px-6 py-4">Dibuat Pada</th>
                                <th className="px-6 py-4 text-center w-28">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : filteredQuestions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center text-slate-400">
                                            <FileText size={48} className="mb-3 text-slate-300" />
                                            <p>Tidak ada soal ujian yang sesuai dengan kriteria filter.</p>
                                            {(examFilter !== 'Semua' || categoryFilter !== 'Semua') && (
                                                <button onClick={() => { setExamFilter('Semua'); setCategoryFilter('Semua'); }} className="text-blue-600 hover:underline mt-2">
                                                    Reset Filter
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredQuestions.map((q, index) => (
                                    <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 text-center">{index + 1}</td>
                                        <td className="px-6 py-4 max-w-sm truncate" title={q.question_text}>
                                            {q.question_text}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`w-fit px-2 py-0.5 rounded text-xs font-bold ${q.exam_type === 'SIM A' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {q.exam_type}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium">{q.material_category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {q.media_type === 'video' ? (
                                                <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md w-fit font-medium text-xs">
                                                    <Video size={14} /> Video
                                                </span>
                                            ) : q.media_type === 'image' ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md w-fit font-medium text-xs">
                                                    <ImageIcon size={14} /> Gambar
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(q.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/admin/questions/${q.id}`}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(q.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
