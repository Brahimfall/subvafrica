import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

export default function EmailVerificationPrompt() {
  const { user, resendVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await resendVerification();
      setMessage('Email de vérification renvoyé avec succès !');
    } catch (error) {
      setError(error.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  if (user?.email_verified_at) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <CardTitle className="text-xl text-green-600">Email vérifié</CardTitle>
          <CardDescription>
            Votre adresse email a été vérifiée avec succès !
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Mail className="h-12 w-12 text-blue-500 mx-auto mb-2" />
        <CardTitle className="text-xl">Vérifiez votre email</CardTitle>
        <CardDescription>
          Un email de vérification a été envoyé à <strong>{user?.email}</strong>. 
          Cliquez sur le lien dans l'email pour activer votre compte.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-center text-sm text-muted-foreground">
          Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou cliquez ci-dessous pour le renvoyer.
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleResendVerification} 
          variant="outline" 
          className="w-full"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Renvoyer l'email de vérification
        </Button>
      </CardFooter>
    </Card>
  );
}

