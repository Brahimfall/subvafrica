import EmailVerificationPrompt from '../components/auth/EmailVerificationPrompt';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function EmailVerificationPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.email_verified_at) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SubvAfrica</h1>
          <p className="text-gray-600">Vérification de votre email</p>
        </div>
        <EmailVerificationPrompt />
      </div>
    </div>
  );
}

