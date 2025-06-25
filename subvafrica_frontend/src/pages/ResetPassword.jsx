import ResetPasswordForm from '../components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SubvAfrica</h1>
          <p className="text-gray-600">Réinitialisez votre mot de passe</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}

