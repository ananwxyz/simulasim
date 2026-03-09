import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function PrivateRoute() {
    const [session, setSession] = useState<boolean | null>(null);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data }: { data: any }) => {
            setSession(!!data.session);
        });

        // Listen to auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setSession(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (session === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    // If there is no session, go to login. Otherwise, render child routes.
    return session ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
