import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  User,
  Briefcase,
  PresentationChart,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';

const DocumentGeneration = () => {
  const [activeTab, setActiveTab] = useState('cover-letter');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  
  // États pour les formulaires
  const [coverLetterForm, setCoverLetterForm] = useState({
    opportunity_id: '',
    company_name: '',
    position_title: '',
    additional_info: '',
    format: 'pdf'
  });
  
  const [cvForm, setCvForm] = useState({
    sector: '',
    template: 'modern',
    format: 'pdf'
  });
  
  const [pitchDeckForm, setPitchDeckForm] = useState({
    project_name: '',
    project_description: '',
    target_audience: '',
    key_points: [''],
    format: 'pdf'
  });
  
  const [applicationFileForm, setApplicationFileForm] = useState({
    opportunity_id: '',
    include_cover_letter: true,
    include_cv: true,
    include_portfolio: false,
    additional_documents: [],
    format: 'zip'
  });

  useEffect(() => {
    fetchDocumentHistory();
    fetchOpportunities();
  }, []);

  const fetchDocumentHistory = async () => {
    try {
      const response = await fetch('/api/documents/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/opportunities');
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data.data || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités:', error);
    }
  };

  const generateDocument = async (type, formData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/generate/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message);
        fetchDocumentHistory();
        return data.document;
      } else {
        toast.error(data.message || 'Erreur lors de la génération');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (documentId, filename) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        toast.success('Document supprimé');
        fetchDocumentHistory();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const addKeyPoint = () => {
    setPitchDeckForm(prev => ({
      ...prev,
      key_points: [...prev.key_points, '']
    }));
  };

  const updateKeyPoint = (index, value) => {
    setPitchDeckForm(prev => ({
      ...prev,
      key_points: prev.key_points.map((point, i) => i === index ? value : point)
    }));
  };

  const removeKeyPoint = (index) => {
    setPitchDeckForm(prev => ({
      ...prev,
      key_points: prev.key_points.filter((_, i) => i !== index)
    }));
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'cover_letter': return <FileText className="h-4 w-4" />;
      case 'cv': return <User className="h-4 w-4" />;
      case 'pitch_deck': return <PresentationChart className="h-4 w-4" />;
      case 'application_file': return <FolderOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentTypeName = (type) => {
    const types = {
      'cover_letter': 'Lettre de motivation',
      'cv': 'CV',
      'pitch_deck': 'Pitch deck',
      'application_file': 'Dossier de candidature'
    };
    return types[type] || type;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Génération Automatique de Documents</h1>
          <p className="text-muted-foreground">
            Créez des documents professionnels personnalisés en quelques clics
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cover-letter" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Lettre de motivation
          </TabsTrigger>
          <TabsTrigger value="cv" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            CV
          </TabsTrigger>
          <TabsTrigger value="pitch-deck" className="flex items-center gap-2">
            <PresentationChart className="h-4 w-4" />
            Pitch deck
          </TabsTrigger>
          <TabsTrigger value="application-file" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Dossier complet
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        {/* Lettre de motivation */}
        <TabsContent value="cover-letter">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Générer une lettre de motivation
              </CardTitle>
              <CardDescription>
                Créez une lettre de motivation personnalisée pour une opportunité spécifique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opportunity">Opportunité</Label>
                  <Select 
                    value={coverLetterForm.opportunity_id} 
                    onValueChange={(value) => setCoverLetterForm(prev => ({ ...prev, opportunity_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une opportunité" />
                    </SelectTrigger>
                    <SelectContent>
                      {opportunities.map(opp => (
                        <SelectItem key={opp.id} value={opp.id.toString()}>
                          {opp.title} - {opp.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Nom de l'entreprise</Label>
                  <Input
                    id="company"
                    value={coverLetterForm.company_name}
                    onChange={(e) => setCoverLetterForm(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Intitulé du poste</Label>
                  <Input
                    id="position"
                    value={coverLetterForm.position_title}
                    onChange={(e) => setCoverLetterForm(prev => ({ ...prev, position_title: e.target.value }))}
                    placeholder="Intitulé du poste"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select 
                    value={coverLetterForm.format} 
                    onValueChange={(value) => setCoverLetterForm(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="docx">Word</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional">Informations supplémentaires</Label>
                <Textarea
                  id="additional"
                  value={coverLetterForm.additional_info}
                  onChange={(e) => setCoverLetterForm(prev => ({ ...prev, additional_info: e.target.value }))}
                  placeholder="Ajoutez des informations spécifiques que vous souhaitez inclure..."
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={() => generateDocument('cover-letter', coverLetterForm)}
                disabled={loading || !coverLetterForm.opportunity_id || !coverLetterForm.company_name}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  'Générer la lettre de motivation'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CV */}
        <TabsContent value="cv">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Générer un CV optimisé
              </CardTitle>
              <CardDescription>
                Créez un CV adapté à un secteur d'activité spécifique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur d'activité</Label>
                  <Input
                    id="sector"
                    value={cvForm.sector}
                    onChange={(e) => setCvForm(prev => ({ ...prev, sector: e.target.value }))}
                    placeholder="Ex: Technologie, Finance, Marketing..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select 
                    value={cvForm.template} 
                    onValueChange={(value) => setCvForm(prev => ({ ...prev, template: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderne</SelectItem>
                      <SelectItem value="classic">Classique</SelectItem>
                      <SelectItem value="creative">Créatif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cv-format">Format</Label>
                  <Select 
                    value={cvForm.format} 
                    onValueChange={(value) => setCvForm(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="docx">Word</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={() => generateDocument('cv', cvForm)}
                disabled={loading || !cvForm.sector}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  'Générer le CV'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pitch deck */}
        <TabsContent value="pitch-deck">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PresentationChart className="h-5 w-5" />
                Générer un pitch deck
              </CardTitle>
              <CardDescription>
                Créez une présentation professionnelle pour votre projet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Nom du projet</Label>
                  <Input
                    id="project-name"
                    value={pitchDeckForm.project_name}
                    onChange={(e) => setPitchDeckForm(prev => ({ ...prev, project_name: e.target.value }))}
                    placeholder="Nom de votre projet"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target">Public cible</Label>
                  <Input
                    id="target"
                    value={pitchDeckForm.target_audience}
                    onChange={(e) => setPitchDeckForm(prev => ({ ...prev, target_audience: e.target.value }))}
                    placeholder="Ex: Investisseurs, Clients, Partenaires..."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description du projet</Label>
                <Textarea
                  id="description"
                  value={pitchDeckForm.project_description}
                  onChange={(e) => setPitchDeckForm(prev => ({ ...prev, project_description: e.target.value }))}
                  placeholder="Décrivez votre projet en quelques phrases..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Points clés à présenter</Label>
                {pitchDeckForm.key_points.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={point}
                      onChange={(e) => updateKeyPoint(index, e.target.value)}
                      placeholder={`Point clé ${index + 1}`}
                    />
                    {pitchDeckForm.key_points.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeKeyPoint(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addKeyPoint}
                  className="w-full"
                >
                  Ajouter un point clé
                </Button>
              </div>
              
              <Button 
                onClick={() => generateDocument('pitch-deck', pitchDeckForm)}
                disabled={loading || !pitchDeckForm.project_name || !pitchDeckForm.project_description}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  'Générer le pitch deck'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dossier de candidature */}
        <TabsContent value="application-file">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Générer un dossier de candidature complet
              </CardTitle>
              <CardDescription>
                Assemblez tous vos documents en un dossier cohérent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-opportunity">Opportunité</Label>
                <Select 
                  value={applicationFileForm.opportunity_id} 
                  onValueChange={(value) => setApplicationFileForm(prev => ({ ...prev, opportunity_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une opportunité" />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunities.map(opp => (
                      <SelectItem key={opp.id} value={opp.id.toString()}>
                        {opp.title} - {opp.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label>Documents à inclure</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-cover-letter"
                      checked={applicationFileForm.include_cover_letter}
                      onChange={(e) => setApplicationFileForm(prev => ({ 
                        ...prev, 
                        include_cover_letter: e.target.checked 
                      }))}
                    />
                    <Label htmlFor="include-cover-letter">Lettre de motivation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-cv"
                      checked={applicationFileForm.include_cv}
                      onChange={(e) => setApplicationFileForm(prev => ({ 
                        ...prev, 
                        include_cv: e.target.checked 
                      }))}
                    />
                    <Label htmlFor="include-cv">CV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-portfolio"
                      checked={applicationFileForm.include_portfolio}
                      onChange={(e) => setApplicationFileForm(prev => ({ 
                        ...prev, 
                        include_portfolio: e.target.checked 
                      }))}
                    />
                    <Label htmlFor="include-portfolio">Portfolio</Label>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => generateDocument('application-file', applicationFileForm)}
                disabled={loading || !applicationFileForm.opportunity_id}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  'Générer le dossier de candidature'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Historique des documents
              </CardTitle>
              <CardDescription>
                Gérez vos documents générés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun document généré pour le moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(doc.type)}
                        <div>
                          <p className="font-medium">{doc.filename}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{getDocumentTypeName(doc.type)}</Badge>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadDocument(doc.id, doc.filename)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentGeneration;

