import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx'
import { Search, Filter, Calendar, MapPin, DollarSign, User, MessageCircle, FileText, Bell, LogOut, Settings } from 'lucide-react'
import { AuthProvider, useAuth } from '@/hooks/useAuth.jsx'
import AuthDialog from '@/components/AuthDialog.jsx'
import './App.css'

// Composants de pages
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import Opportunities from './pages/Opportunities.jsx'
import Chat from './pages/Chat.jsx'
import Alerts from './pages/Alerts.jsx'

function HomePage() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Fetch opportunities from Laravel API
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/opportunities')
      const data = await response.json()
      setOpportunities(data)
    } catch (error) {
      console.error('Erreur lors du chargement des opportunités:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Trouvez les opportunités parfaites pour votre projet
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Notre IA intelligente vous aide à découvrir des subventions, concours et aides 
            adaptés à votre profil d'entrepreneur africain.
          </p>
          
          {/* Call to Action pour les utilisateurs non connectés */}
          {!isAuthenticated() && (
            <div className="mb-8">
              <AuthDialog onAuthSuccess={() => window.location.reload()}>
                <Button size="lg" className="mr-4">
                  Commencer maintenant
                </Button>
              </AuthDialog>
              <p className="text-sm text-gray-500 mt-2">
                Créez votre compte gratuitement pour accéder à toutes les fonctionnalités
              </p>
            </div>
          )}
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Décrivez votre projet ou secteur d'activité..."
                className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Rechercher
              </Button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Tous les secteurs
            </Button>
            <Button variant="outline">Technologie</Button>
            <Button variant="outline">Agriculture</Button>
            <Button variant="outline">Santé</Button>
            <Button variant="outline">Éducation</Button>
            <Button variant="outline">Environnement</Button>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Opportunités récentes</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des opportunités...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">Aucune opportunité disponible pour le moment.</p>
                  <Button className="mt-4">Ajouter une opportunité</Button>
                </div>
              ) : (
                opportunities.slice(0, 6).map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                        <Badge variant="secondary">{opportunity.opportunity_type || 'Subvention'}</Badge>
                      </div>
                      <CardDescription className="line-clamp-3">
                        {opportunity.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {opportunity.amount && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{opportunity.amount}</span>
                          </div>
                        )}
                        {opportunity.deadline && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Échéance: {new Date(opportunity.deadline).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                        {opportunity.country_sector_filter && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{opportunity.country_sector_filter.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      <Button className="w-full mt-4">Voir les détails</Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
          
          {opportunities.length > 6 && (
            <div className="text-center mt-8">
              <Link to="/opportunities">
                <Button size="lg">Voir toutes les opportunités</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Fonctionnalités principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Recherche intelligente</h4>
              <p className="text-gray-600">Notre IA classe les opportunités par pertinence selon votre profil</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Alertes personnalisées</h4>
              <p className="text-gray-600">Recevez des notifications pour les nouvelles opportunités qui vous correspondent</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Génération de dossiers</h4>
              <p className="text-gray-600">L'IA rédige automatiquement vos pitch decks et lettres de motivation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Header() {
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">SubvAfrica</h1>
              <span className="ml-2 text-sm text-gray-500">Plateforme IA de recherche de subventions</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/opportunities" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Opportunités
            </Link>
            {isAuthenticated() && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Tableau de bord
                </Link>
                <Link to="/chat" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Assistant IA
                </Link>
                <Link to="/alerts" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Alertes
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user?.name || 'Utilisateur'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Tableau de bord
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <AuthDialog onAuthSuccess={() => window.location.reload()}>
                  <Button variant="outline">Se connecter</Button>
                </AuthDialog>
                <AuthDialog onAuthSuccess={() => window.location.reload()}>
                  <Button>S'inscrire</Button>
                </AuthDialog>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">SubvAfrica</h4>
            <p className="text-gray-400 mb-8">
              Votre partenaire IA pour trouver les meilleures opportunités de financement en Afrique
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                À propos
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                Contact
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                Aide
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App

