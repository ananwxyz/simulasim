export interface UserSession {
    name: string;
    email: string;
    examType: 'SIM A' | 'SIM C';
    startedAt: number;
}

const SESSION_KEY = 'simulasim_user_session';

export const saveUserSession = (user: UserSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getUserSession = (): UserSession | null => {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
};

export const clearUserSession = () => {
    localStorage.removeItem(SESSION_KEY);
};
