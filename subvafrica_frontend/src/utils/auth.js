// Configuration de l'API
const API_BASE_URL = 'http://localhost:8000/api';

// Utilitaires pour les requêtes API
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Services d'authentification
export const authService = {
  // Inscription
  register: async (userData) => {
    const response = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Connexion
  login: async (credentials) => {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Déconnexion
  logout: async () => {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  // Récupération de mot de passe
  forgotPassword: async (email) => {
    return await apiRequest('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Réinitialisation de mot de passe
  resetPassword: async (resetData) => {
    return await apiRequest('/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  },

  // Renvoyer email de vérification
  resendVerification: async () => {
    return await apiRequest('/email/verification-notification', {
      method: 'POST',
    });
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: async () => {
    return await apiRequest('/user');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Obtenir l'utilisateur depuis le localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obtenir le token
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
};

