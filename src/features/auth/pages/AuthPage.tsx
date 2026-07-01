import AuthLeftPanel from '../components/AuthLeftPanel';
import AuthForm from '../components/AuthForm';
import { useAuthForm } from '../hooks/useAuthForm';

export default function AuthPage() {
  const auth = useAuthForm();

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-bg-base text-white flex flex-col md:flex-row">
      <AuthLeftPanel isSignUp={auth.isSignUp} />
      <div className="flex-1 md:h-full md:overflow-y-auto custom-scrollbar flex flex-col">
        <AuthForm auth={auth} />
      </div>
    </div>
  );
}
