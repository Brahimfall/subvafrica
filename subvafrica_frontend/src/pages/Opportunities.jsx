import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Search, Filter, Calendar, MapPin, DollarSign, ExternalLink } from 'lucide-react'

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchOpportunities()
      return
    }

    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          sectors: selectedSector ? [selectedSector] : [],
        }),
      })
      const data = await response.json()
      setOpportunities(data.opportunities || [])
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOpportunities = opportunities.filter(opportunity => {
    if (selectedType && opportunity.opportunity_type !== selectedType) {
      return false
    }
    return true
  })

  const sectors = ['Technologie', 'Agriculture', 'Santé', 'Éducation', 'Environnement', 'Finance', 'Énergie']
  const types = ['Subvention', 'Concours', 'Bourse', 'Incubateur', 'Investissement', 'Appel à projets']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Toutes les opportunités</h1>
          <p className="text-gray-600">
            Découvrez toutes les opportunités de financement disponibles pour votre projet.
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par mots-clés..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="Secteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les secteurs</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Rechercher avec IA
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('')
                setSelectedSector('')
                setSelectedType('')
                fetchOpportunities()
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Résultats */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Recherche en cours...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredOpportunities.length} opportunité{filteredOpportunities.length > 1 ? 's' : ''} trouvée{filteredOpportunities.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
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
                    <div className="space-y-3">
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
                          <span>{opportunity.country_sector_filter.slice(0, 2).join(', ')}</span>
                          {opportunity.country_sector_filter.length > 2 && (
                            <span className="text-xs text-gray-500">+{opportunity.country_sector_filter.length - 2}</span>
                          )}
                        </div>
                      )}
                      {opportunity.relevance_score && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center">
                            <span className="text-green-600 font-medium">
                              Score: {opportunity.relevance_score}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <Button className="w-full">Voir les détails</Button>
                      {opportunity.source_url && (
                        <Button variant="outline" className="w-full" asChild>
                          <a href={opportunity.source_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Site officiel
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Aucune opportunité ne correspond à vos critères.</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedSector('')
                    setSelectedType('')
                    fetchOpportunities()
                  }}
                >
                  Voir toutes les opportunités
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

