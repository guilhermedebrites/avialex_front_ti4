'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts';
import { Session } from '@/lib/networking/session';
import { ApiClient } from '@/lib/networking/api-client';
import { AuthService } from '@/lib/services/auth/auth-service';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extract tokens from URL hash
        const hash = window.location.hash.substring(1); // Remove #
        const params = new URLSearchParams(hash);
        const tokensParam = params.get('tokens');

        if (!tokensParam) {
          throw new Error('No tokens found in callback');
        }

        // Decode and parse tokens
        const decodedTokens = decodeURIComponent(tokensParam);
        const authResponse = JSON.parse(decodedTokens);

        // Get API base URL
        const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com';
        const apiClient = new ApiClient({ baseURL: apiBaseURL });
        const session = Session.getInstance();
        const authService = new AuthService(apiClient);

        // Save tokens to session
        session.saveTokens({
          accessToken: authResponse.accessToken,
          refreshToken: authResponse.refreshToken,
          expiresIn: authResponse.expiresIn,
        });

        // Set token in API client
        apiClient.setAccessToken(authResponse.accessToken);

        // Get user claims
        const userClaims = await authService.me();
        const userId = Number(userClaims.sub) || 0;

        // Get full user data
        const userData = await authService.getUserById(userId);

        // Save user session
        session.saveUserSession({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          type: userData.type,
          cpf: userData.cpf,
          phone: userData.phone,
          address: userData.address,
          rg: userData.rg,
        });

        // Clear the hash from URL
        window.history.replaceState(null, '', window.location.pathname);

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Erro ao processar autenticação');
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [router]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-muted-foreground">Processando autenticação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-destructive">Erro na autenticação</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Voltar para login
          </button>
        </div>
      </div>
    );
  }

  return null;
}


