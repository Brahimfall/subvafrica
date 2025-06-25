import { useState, useEffect, createContext, useContext } from 'react'

// Créer le contexte d'authentification
const AuthContext = createContext()

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Provider d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    }
    
    setLoading(false)
  }, [])

  // Fonction de connexion
  const login = (userData, token) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  // Fonction de déconnexion
  const logout = async () => {
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      try {
        // Appeler l'API de déconnexion
        await fetch('http://localhost:8000/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
      }
    }
    
    // Nettoyer le localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // Fonction pour obtenir le token
  const getToken = () => {
    return localStorage.getItem('auth_token')
  }

  // Fonction pour vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    return !!user && !!getToken()
  }

  const value = {
    user,
    loading,
    login,
    logout,
    getToken,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

