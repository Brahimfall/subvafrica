import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { User, Building, MapPin, Briefcase, Globe, Phone, Linkedin } from 'lucide-react'

export default function Profile() {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    sectors: [],
    experience_level: '',
    project_type: '',
    funding_amount_range: '',
    location: '',
    description: '',
    website: '',
    phone: '',
    linkedin_profile: '',
  })

  const [loading, setLoading] = useState(false)

  const sectors = [
    'Technologie',
    'Agriculture',
    'Santé',
    'Éducation',
    'Environnement',
    'Finance',
    'Énergie',
    'Transport',
    'Commerce',
    'Industrie'
  ]

  const experienceLevels = [
    { value: 'beginner', label: 'Débutant (0-2 ans)' },
    { value: 'intermediate', label: 'Intermédiaire (3-7 ans)' },
    { value: 'expert', label: 'Expert (8+ ans)' }
  ]

  const projectTypes = [
    'Startup',
    'Recherche',
    'Social/ONG',
    'Innovation',
    'Développement produit',
    'Expansion',
    'Formation'
  ]

  const fundingRanges = [
    'Moins de 10 000 €',
    '10 000 € - 50 000 €',
    '50 000 € - 100 000 €',
    '100 000 € - 500 000 €',
    'Plus de 500 000 €'
  ]

  const handleSectorChange = (sector, checked) => {
    if (checked) {
      setProfile(prev => ({
        ...prev,
        sectors: [...prev.sectors, sector]
      }))
    } else {
      setProfile(prev => ({
        ...prev,
        sectors: prev.sectors.filter(s => s !== sector)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulation de l'envoi des données
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Profil sauvegardé:', profile)
      alert('Profil sauvegardé avec succès!')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde du profil')
    } finally {
      setLoading(false)
    }
  }

  const getRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ai/analyze-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile_data: {
            sectors: profile.sectors,
            experience_level: profile.experience_level,
            project_type: profile.project_type,
            funding_amount: profile.funding_amount_range,
            location: profile.location,
          }
        }),
      })
      const data = await response.json()
      console.log('Recommandations:', data)
      alert('Recommandations générées! Consultez la console pour les détails.')
    } catch (error) {
      console.error('Erreur lors de la génération des recommandations:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mon Profil</h1>
          <p className="text-gray-600">
            Complétez votre profil pour recevoir des recommandations personnalisées.
          </p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
            <TabsTrigger value="professional">Profil professionnel</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription>
                    Vos informations de base pour créer votre profil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">Prénom *</Label>
                      <Input
                        id="first_name"
                        value={profile.first_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Nom *</Label>
                      <Input
                        id="last_name"
                        value={profile.last_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company_name" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Nom de l'entreprise/organisation
                    </Label>
                    <Input
                      id="company_name"
                      value={profile.company_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, company_name: e.target.value }))}
                      placeholder="Nom de votre entreprise ou organisation"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localisation
                    </Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Ville, Pays"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Site web
                      </Label>
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://monsite.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="linkedin_profile" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      Profil LinkedIn
                    </Label>
                    <Input
                      id="linkedin_profile"
                      value={profile.linkedin_profile}
                      onChange={(e) => setProfile(prev => ({ ...prev, linkedin_profile: e.target.value }))}
                      placeholder="https://linkedin.com/in/monprofil"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Profil professionnel
                  </CardTitle>
                  <CardDescription>
                    Informations sur votre expérience et vos projets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Secteurs d'activité *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {sectors.map(sector => (
                        <div key={sector} className="flex items-center space-x-2">
                          <Checkbox
                            id={sector}
                            checked={profile.sectors.includes(sector)}
                            onCheckedChange={(checked) => handleSectorChange(sector, checked)}
                          />
                          <Label htmlFor={sector} className="text-sm">{sector}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience_level">Niveau d'expérience</Label>
                      <Select value={profile.experience_level} onValueChange={(value) => setProfile(prev => ({ ...prev, experience_level: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="project_type">Type de projet</Label>
                      <Select value={profile.project_type} onValueChange={(value) => setProfile(prev => ({ ...prev, project_type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type de votre projet" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="funding_amount_range">Montant de financement recherché</Label>
                    <Select value={profile.funding_amount_range} onValueChange={(value) => setProfile(prev => ({ ...prev, funding_amount_range: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une fourchette" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingRanges.map(range => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description de votre projet/profil</Label>
                    <Textarea
                      id="description"
                      value={profile.description}
                      onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre projet, vos objectifs, votre expérience..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences et recommandations</CardTitle>
                  <CardDescription>
                    Configurez vos préférences pour recevoir des recommandations personnalisées
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Analyse de profil IA
                    </h3>
                    <p className="text-blue-800 text-sm mb-3">
                      Notre IA peut analyser votre profil et vous proposer des recommandations personnalisées.
                    </p>
                    <Button 
                      type="button" 
                      onClick={getRecommendations}
                      variant="outline"
                      disabled={!profile.sectors.length || !profile.experience_level}
                    >
                      Obtenir des recommandations IA
                    </Button>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Alertes automatiques
                    </h3>
                    <p className="text-green-800 text-sm mb-3">
                      Configurez des alertes pour être notifié des nouvelles opportunités qui correspondent à votre profil.
                    </p>
                    <Button type="button" variant="outline">
                      Configurer les alertes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline">
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Sauvegarde...' : 'Sauvegarder le profil'}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  )
}

