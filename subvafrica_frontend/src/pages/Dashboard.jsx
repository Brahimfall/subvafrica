import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Target,
  Award
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulation des données du tableau de bord
    // En production, ces données viendraient de l'API
    setTimeout(() => {
      setStats({
        total: 12,
        by_status: {
          draft: { count: 3, label: 'Brouillon' },
          in_progress: { count: 2, label: 'En cours' },
          submitted: { count: 4, label: 'Soumise' },
          under_review: { count: 2, label: 'En cours d\'examen' },
          accepted: { count: 1, label: 'Acceptée' },
          rejected: { count: 0, label: 'Refusée' },
        },
        needs_follow_up: 2,
        recent_activity: [
          {
            id: 1,
            opportunity: { title: 'Programme Tech4Dev' },
            status: 'submitted',
            updated_at: '2025-06-19T10:30:00Z'
          },
          {
            id: 2,
            opportunity: { title: 'Subvention Agriculture Sahel' },
            status: 'in_progress',
            updated_at: '2025-06-18T15:45:00Z'
          }
        ]
      })
      
      setApplications([
        {
          id: 1,
          opportunity: { 
            title: 'Programme d\'Accélération Tech4Dev',
            deadline: '2025-08-04T00:00:00Z',
            amount: '50 000 € + accompagnement'
          },
          status: 'submitted',
          submitted_at: '2025-06-15T09:00:00Z',
          notes: 'Dossier complet soumis avec pitch deck généré par IA'
        },
        {
          id: 2,
          opportunity: { 
            title: 'Subvention Innovation Agricole Sahel',
            deadline: '2025-07-20T00:00:00Z',
            amount: '25 000 € - 100 000 €'
          },
          status: 'in_progress',
          notes: 'En cours de finalisation des documents techniques'
        },
        {
          id: 3,
          opportunity: { 
            title: 'Concours Santé Digitale Afrique',
            deadline: '2025-08-19T00:00:00Z',
            amount: '75 000 € + incubation'
          },
          status: 'draft',
          notes: 'Idée de projet définie, besoin de développer le prototype'
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      in_progress: 'bg-blue-500',
      submitted: 'bg-yellow-500',
      under_review: 'bg-purple-500',
      accepted: 'bg-green-500',
      rejected: 'bg-red-500',
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusIcon = (status) => {
    const icons = {
      draft: <FileText className="h-4 w-4" />,
      in_progress: <Clock className="h-4 w-4" />,
      submitted: <CheckCircle className="h-4 w-4" />,
      under_review: <AlertCircle className="h-4 w-4" />,
      accepted: <Award className="h-4 w-4" />,
      rejected: <AlertCircle className="h-4 w-4" />,
    }
    return icons[status] || <FileText className="h-4 w-4" />
  }

  // Données pour les graphiques
  const chartData = stats ? Object.entries(stats.by_status).map(([key, value]) => ({
    name: value.label,
    value: value.count,
    status: key
  })) : []

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff0000']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tableau de bord</h1>
          <p className="text-gray-600">
            Suivez vos candidatures et découvrez de nouvelles opportunités.
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total candidatures</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Acceptées</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.by_status.accepted.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En cours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.by_status.submitted.count + stats.by_status.under_review.count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Suivi requis</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.needs_follow_up}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Mes candidatures</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidatures récentes</CardTitle>
                <CardDescription>
                  Gérez vos candidatures et suivez leur progression
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {application.opportunity.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {application.notes}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Montant: {application.opportunity.amount}</span>
                            <span>
                              Échéance: {new Date(application.opportunity.deadline).toLocaleDateString('fr-FR')}
                            </span>
                            {application.submitted_at && (
                              <span>
                                Soumise le: {new Date(application.submitted_at).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(application.status)} text-white`}
                          >
                            {getStatusIcon(application.status)}
                            <span className="ml-1">{stats.by_status[application.status]?.label}</span>
                          </Badge>
                          <Button size="sm" variant="outline">
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Évolution des candidatures</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations personnalisées</CardTitle>
                <CardDescription>
                  Basées sur votre profil et vos candidatures précédentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Optimisez votre profil
                    </h3>
                    <p className="text-blue-800 text-sm mb-3">
                      Complétez votre profil pour recevoir des recommandations plus précises.
                    </p>
                    <Button size="sm" variant="outline">
                      Compléter le profil
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Nouvelles opportunités
                    </h3>
                    <p className="text-green-800 text-sm mb-3">
                      3 nouvelles opportunités correspondent à votre profil technologique.
                    </p>
                    <Button size="sm" variant="outline">
                      Voir les opportunités
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      Échéances à venir
                    </h3>
                    <p className="text-yellow-800 text-sm mb-3">
                      2 candidatures ont des échéances dans les 30 prochains jours.
                    </p>
                    <Button size="sm" variant="outline">
                      Voir le calendrier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

