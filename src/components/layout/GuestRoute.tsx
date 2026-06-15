import { Navigate, useLocation } from 'react-router-dom';
 
import { useAuthStore } from '../../stores/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
      </div>
    );
  }

  if (session) {
    // If logged in, redirect to the page they came from, or dashboard
    const from = location.state?.from?.pathname || '/';
    const safeRedirect = from.startsWith('/') ? from : '/';
    return <Navigate to={safeRedirect} replace />;
  }

  return <>{children}</>;
}
