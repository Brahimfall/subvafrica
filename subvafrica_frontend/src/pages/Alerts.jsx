import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { 
  Bell, 
  Plus, 
  Settings, 
  Trash2, 
  Play, 
  Pause, 
  TestTube,
  Calendar,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newAlert, setNewAlert] = useState({
    name: '',
    criteria: {
      sectors: [],
      location: '',
      opportunity_type: '',
      keywords: ''
    },
    frequency: 'weekly'
  })
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    // Simulation des données d'alertes
    setTimeout(() => {
      setAlerts([
        {
          id: 1,
          name: 'Opportunités Tech Afrique',
          criteria: {
            sectors: ['Technologie'],
            location: 'Afrique',
            keywords: 'startup innovation'
          },
          frequency: 'weekly',
          is_active: true,
          last_sent_at: '2025-06-15T10:00:00Z',
          created_at: '2025-06-01T09:00:00Z'
        },
        {
          id: 2,
          name: 'Subventions Agriculture Sahel',
          criteria: {
            sectors: ['Agriculture'],
            location: 'Sahel',
            opportunity_type: 'Subvention'
          },
          frequency: 'monthly',
          is_active: false,
          last_sent_at: null,
          created_at: '2025-05-20T14:30:00Z'
        },
        {
          id: 3,
          name: 'Bourses Entrepreneuriat Féminin',
          criteria: {
            sectors: ['Entrepreneuriat'],
            keywords: 'femme entrepreneur'
          },
          frequency: 'daily',
          is_active: true,
          last_sent_at: '2025-06-19T08:00:00Z',
          created_at: '2025-06-10T11:15:00Z'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const sectors = ['Technologie', 'Agriculture', 'Santé', 'Éducation', 'Environnement', 'Finance', 'Énergie']
  const opportunityTypes = ['Subvention', 'Concours', 'Bourse', 'Incubateur', 'Investissement', 'Appel à projets']
  const frequencies = [
    { value: 'daily', label: 'Quotidienne' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuelle' }
  ]

  const createAlert = async () => {
    if (!newAlert.name.trim()) return

    const alert = {
      id: Date.now(),
      ...newAlert,
      is_active: true,
      last_sent_at: null,
      created_at: new Date().toISOString()
    }

    setAlerts(prev => [...prev, alert])
    setNewAlert({
      name: '',
      criteria: {
        sectors: [],
        location: '',
        opportunity_type: '',
        keywords: ''
      },
      frequency: 'weekly'
    })
    setShowCreateDialog(false)
  }

  const toggleAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, is_active: !alert.is_active }
        : alert
    ))
  }

  const deleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const testAlert = async (alert) => {
    try {
      // Simulation du test d'alerte
      console.log('Test de l\'alerte:', alert)
      alert('Test d\'alerte envoyé! Vérifiez la console pour les détails.')
    } catch (error) {
      console.error('Erreur lors du test:', error)
    }
  }

  const getFrequencyLabel = (frequency) => {
    const freq = frequencies.find(f => f.value === frequency)
    return freq ? freq.label : frequency
  }

  const getNextSendDate = (alert) => {
    if (!alert.last_sent_at) return 'Prochainement'
    
    const lastSent = new Date(alert.last_sent_at)
    const interval = {
      daily: 1,
      weekly: 7,
      monthly: 30
    }[alert.frequency] || 7

    const nextSend = new Date(lastSent)
    nextSend.setDate(nextSend.getDate() + interval)
    
    return nextSend.toLocaleDateString('fr-FR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des alertes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Alertes personnalisées</h1>
              <p className="text-gray-600">
                Configurez des alertes pour être notifié des nouvelles opportunités qui correspondent à vos critères.
              </p>
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvelle alerte
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle alerte</DialogTitle>
                  <DialogDescription>
                    Configurez les critères pour recevoir des notifications personnalisées
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="alert-name">Nom de l'alerte *</Label>
                    <Input
                      id="alert-name"
                      value={newAlert.name}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Opportunités Tech Afrique"
                    />
                  </div>

                  <div>
                    <Label htmlFor="alert-sectors">Secteurs</Label>
                    <Select 
                      value={newAlert.criteria.sectors[0] || ''} 
                      onValueChange={(value) => setNewAlert(prev => ({
                        ...prev,
                        criteria: { ...prev.criteria, sectors: value ? [value] : [] }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map(sector => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="alert-location">Localisation</Label>
                    <Input
                      id="alert-location"
                      value={newAlert.criteria.location}
                      onChange={(e) => setNewAlert(prev => ({
                        ...prev,
                        criteria: { ...prev.criteria, location: e.target.value }
                      }))}
                      placeholder="Ex: Afrique, Sénégal, Sahel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="alert-type">Type d'opportunité</Label>
                    <Select 
                      value={newAlert.criteria.opportunity_type} 
                      onValueChange={(value) => setNewAlert(prev => ({
                        ...prev,
                        criteria: { ...prev.criteria, opportunity_type: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {opportunityTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="alert-keywords">Mots-clés</Label>
                    <Input
                      id="alert-keywords"
                      value={newAlert.criteria.keywords}
                      onChange={(e) => setNewAlert(prev => ({
                        ...prev,
                        criteria: { ...prev.criteria, keywords: e.target.value }
                      }))}
                      placeholder="Ex: startup, innovation, digital"
                    />
                  </div>

                  <div>
                    <Label htmlFor="alert-frequency">Fréquence</Label>
                    <Select 
                      value={newAlert.frequency} 
                      onValueChange={(value) => setNewAlert(prev => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map(freq => (
                          <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Annuler
                    </Button>
                    <Button onClick={createAlert} disabled={!newAlert.name.trim()}>
                      Créer l'alerte
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Alertes actives ({alerts.filter(a => a.is_active).length})</TabsTrigger>
            <TabsTrigger value="all">Toutes les alertes ({alerts.length})</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {alerts.filter(alert => alert.is_active).map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Bell className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{alert.name}</CardTitle>
                        <CardDescription>
                          Fréquence: {getFrequencyLabel(alert.frequency)} • 
                          Prochaine notification: {getNextSendDate(alert)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {alert.criteria.sectors?.map(sector => (
                        <Badge key={sector} variant="outline">{sector}</Badge>
                      ))}
                      {alert.criteria.location && (
                        <Badge variant="outline">{alert.criteria.location}</Badge>
                      )}
                      {alert.criteria.opportunity_type && (
                        <Badge variant="outline">{alert.criteria.opportunity_type}</Badge>
                      )}
                      {alert.criteria.keywords && (
                        <Badge variant="outline">"{alert.criteria.keywords}"</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testAlert(alert)}
                        className="flex items-center gap-1"
                      >
                        <TestTube className="h-3 w-3" />
                        Tester
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAlert(alert.id)}
                        className="flex items-center gap-1"
                      >
                        <Pause className="h-3 w-3" />
                        Désactiver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteAlert(alert.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {alerts.filter(alert => alert.is_active).length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune alerte active
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Créez votre première alerte pour être notifié des nouvelles opportunités.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    Créer une alerte
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${alert.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Bell className={`h-5 w-5 ${alert.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{alert.name}</CardTitle>
                        <CardDescription>
                          Créée le {new Date(alert.created_at).toLocaleDateString('fr-FR')} • 
                          Fréquence: {getFrequencyLabel(alert.frequency)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={alert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {alert.is_active ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                      <Switch
                        checked={alert.is_active}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {alert.criteria.sectors?.map(sector => (
                      <Badge key={sector} variant="outline">{sector}</Badge>
                    ))}
                    {alert.criteria.location && (
                      <Badge variant="outline">{alert.criteria.location}</Badge>
                    )}
                    {alert.criteria.opportunity_type && (
                      <Badge variant="outline">{alert.criteria.opportunity_type}</Badge>
                    )}
                    {alert.criteria.keywords && (
                      <Badge variant="outline">"{alert.criteria.keywords}"</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres des notifications
                </CardTitle>
                <CardDescription>
                  Configurez vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notifications par email</Label>
                    <p className="text-sm text-gray-600">Recevoir les alertes par email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notifications push</Label>
                    <p className="text-sm text-gray-600">Recevoir les notifications dans le navigateur</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Résumé hebdomadaire</Label>
                    <p className="text-sm text-gray-600">Recevoir un résumé des opportunités chaque semaine</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

