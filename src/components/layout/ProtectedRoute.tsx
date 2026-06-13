import { Navigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-restricted-imports
import { useAuth } from '../../features/auth/contexts/AuthContext';


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // App Shell Loading State to prevent FOUC
    return (
      <div className="min-h-screen bg-bg-base text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-xl font-bold">C</span>
          </div>
          <p className="text-slate-400 text-sm">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    // Redirect to login but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
