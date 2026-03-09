export interface QuestionOption {
    id: string; // 'A', 'B', 'C', 'D'
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: number;
    media_url: string | null;
    media_type: 'video' | 'image' | null;
    exam_type: 'SIM A' | 'SIM C';
    material_category: 'Persepsi Bahaya' | 'Wawasan' | 'Pengetahuan';
    question_text: string;
    options: QuestionOption[];
    created_at: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

export interface TestResult {
    id: string;
    user_email: string;
    exam_type_taken: 'SIM A' | 'SIM C';
    score: number;
    total_questions: number;
    completed_at: string;
}
