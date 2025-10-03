import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Camera, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload,
  Filter,
  Search,
  Image as ImageIcon,
  Calendar,
  User,
  Tag,
  Download,
  Share2,
  ZoomIn
} from 'lucide-react'

const Galeria = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [busca, setBusca] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [dialogVisualizacao, setDialogVisualizacao] = useState(false)
  const [fotoSelecionada, setFotoSelecionada] = useState(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    paciente: '',
    data: '',
    tags: ''
  })

  // Dados simulados para demonstração
  const [fotos, setFotos] = useState([
    {
      id: 1,
      titulo: 'Antes - Tratamento Ortodôntico',
      descricao: 'Estado inicial dos dentes antes do tratamento ortodôntico',
      categoria: 'antes-depois',
      paciente: 'João Silva',
      data: '2024-09-15',
      tags: 'ortodontia, antes, tratamento',
      url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&h=150&fit=crop'
    },
    {
      id: 2,
      titulo: 'Depois - Tratamento Ortodôntico',
      descricao: 'Resultado final após 18 meses de tratamento ortodôntico',
      categoria: 'antes-depois',
      paciente: 'João Silva',
      data: '2024-10-01',
      tags: 'ortodontia, depois, resultado',
      url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&h=150&fit=crop'
    },
    {
      id: 3,
      titulo: 'Implante Dentário - Procedimento',
      descricao: 'Procedimento de colocação de implante dentário',
      categoria: 'procedimentos',
      paciente: 'Maria Santos',
      data: '2024-09-28',
      tags: 'implante, cirurgia, procedimento',
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop'
    },
    {
      id: 4,
      titulo: 'Limpeza Profissional',
      descricao: 'Resultado após limpeza e profilaxia dental',
      categoria: 'tratamentos',
      paciente: 'Ana Costa',
      data: '2024-10-02',
      tags: 'limpeza, profilaxia, higiene',
      url: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=200&h=150&fit=crop'
    },
    {
      id: 5,
      titulo: 'Clareamento Dental',
      descricao: 'Resultado do tratamento de clareamento dental',
      categoria: 'estetica',
      paciente: 'Pedro Oliveira',
      data: '2024-09-20',
      tags: 'clareamento, estética, branqueamento',
      url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=200&h=150&fit=crop'
    },
    {
      id: 6,
      titulo: 'Consultório - Sala de Atendimento',
      descricao: 'Nossa moderna sala de atendimento equipada com tecnologia de ponta',
      categoria: 'consultorio',
      paciente: '',
      data: '2024-08-15',
      tags: 'consultório, equipamentos, ambiente',
      url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=200&h=150&fit=crop'
    }
  ])

  const categorias = [
    { value: 'todas', label: 'Todas as Categorias' },
    { value: 'antes-depois', label: 'Antes e Depois' },
    { value: 'procedimentos', label: 'Procedimentos' },
    { value: 'tratamentos', label: 'Tratamentos' },
    { value: 'estetica', label: 'Estética' },
    { value: 'consultorio', label: 'Consultório' }
  ]

  // Filtrar fotos
  const fotosFiltradas = fotos.filter(foto => {
    const matchCategoria = filtroCategoria === 'todas' || foto.categoria === filtroCategoria
    const matchBusca = busca === '' || 
      foto.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      foto.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      foto.tags.toLowerCase().includes(busca.toLowerCase()) ||
      foto.paciente.toLowerCase().includes(busca.toLowerCase())
    
    return matchCategoria && matchBusca
  })

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const handleSalvar = () => {
    if (modoEdicao) {
      setFotos(prev => prev.map(f => 
        f.id === fotoSelecionada.id 
          ? { ...formData, id: fotoSelecionada.id }
          : f
      ))
    } else {
      const novaFoto = {
        ...formData,
        id: Date.now(),
        url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&h=150&fit=crop'
      }
      setFotos(prev => [...prev, novaFoto])
    }
    
    setDialogAberto(false)
    resetForm()
  }

  const handleEditar = (foto) => {
    setFotoSelecionada(foto)
    setFormData(foto)
    setModoEdicao(true)
    setDialogAberto(true)
  }

  const handleNovo = () => {
    resetForm()
    setModoEdicao(false)
    setDialogAberto(true)
  }

  const handleExcluir = (id) => {
    setFotos(prev => prev.filter(f => f.id !== id))
  }

  const handleVisualizar = (foto) => {
    setFotoSelecionada(foto)
    setDialogVisualizacao(true)
  }

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      categoria: '',
      paciente: '',
      data: '',
      tags: ''
    })
    setFotoSelecionada(null)
  }

  const getCategoriaLabel = (categoria) => {
    const cat = categorias.find(c => c.value === categoria)
    return cat ? cat.label : categoria
  }

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case 'antes-depois': return 'bg-blue-100 text-blue-800'
      case 'procedimentos': return 'bg-green-100 text-green-800'
      case 'tratamentos': return 'bg-purple-100 text-purple-800'
      case 'estetica': return 'bg-pink-100 text-pink-800'
      case 'consultorio': return 'bg-gray-100 text-gray-800'
      default: return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros da Galeria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="border-red-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por título, descrição, tags ou paciente..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 border-red-200"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header da Galeria */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-red-600 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Galeria de Fotos
              </CardTitle>
              <CardDescription>
                {fotosFiltradas.length} foto(s) encontrada(s)
              </CardDescription>
            </div>
            <Button onClick={handleNovo} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Foto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Grid de Fotos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fotosFiltradas.map((foto) => (
              <Card key={foto.id} className="border-red-100 hover:shadow-lg transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={foto.thumbnail}
                    alt={foto.titulo}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleVisualizar(foto)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditar(foto)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleExcluir(foto.id)}
                        className="bg-white/90 hover:bg-white text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg line-clamp-2">{foto.titulo}</h3>
                      <Badge className={getCategoriaColor(foto.categoria)}>
                        {getCategoriaLabel(foto.categoria)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">{foto.descricao}</p>
                    
                    <div className="space-y-2 text-xs text-gray-500">
                      {foto.paciente && (
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>{foto.paciente}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(foto.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {foto.tags && (
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          <span className="line-clamp-1">{foto.tags}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {fotosFiltradas.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma foto encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                Ajuste os filtros ou adicione novas fotos à galeria
              </p>
              <Button onClick={handleNovo} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Foto
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Nova/Editar Foto */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {modoEdicao ? 'Editar Foto' : 'Nova Foto'}
            </DialogTitle>
            <DialogDescription>
              {modoEdicao ? 'Atualize as informações da foto' : 'Adicione uma nova foto à galeria'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {!modoEdicao && (
              <div className="space-y-2">
                <Label htmlFor="upload">Upload da Foto *</Label>
                <div className="border-2 border-dashed border-red-200 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Clique para fazer upload ou arraste a foto aqui
                  </p>
                  <p className="text-xs text-gray-400">
                    Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                  </p>
                  <Button variant="outline" className="mt-4 border-red-200">
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Arquivo
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                  <SelectTrigger className="border-red-200 focus:border-red-500">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.slice(1).map((categoria) => (
                      <SelectItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paciente">Paciente</Label>
                <Input
                  id="paciente"
                  value={formData.paciente}
                  onChange={(e) => handleInputChange('paciente', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                  placeholder="Nome do paciente (se aplicável)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                className="border-red-200 focus:border-red-500"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="border-red-200 focus:border-red-500"
                placeholder="Separe as tags por vírgula (ex: ortodontia, antes, tratamento)"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="bg-red-600 hover:bg-red-700">
              {modoEdicao ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Visualização */}
      <Dialog open={dialogVisualizacao} onOpenChange={setDialogVisualizacao}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {fotoSelecionada && (
            <>
              <DialogHeader>
                <DialogTitle className="text-red-600">{fotoSelecionada.titulo}</DialogTitle>
                <DialogDescription>
                  <Badge className={getCategoriaColor(fotoSelecionada.categoria)}>
                    {getCategoriaLabel(fotoSelecionada.categoria)}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={fotoSelecionada.url}
                    alt={fotoSelecionada.titulo}
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Descrição:</strong>
                    <p className="text-gray-600 mt-1">{fotoSelecionada.descricao}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {fotoSelecionada.paciente && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-red-500" />
                        <span><strong>Paciente:</strong> {fotoSelecionada.paciente}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-red-500" />
                      <span><strong>Data:</strong> {new Date(fotoSelecionada.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {fotoSelecionada.tags && (
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-red-500" />
                        <span><strong>Tags:</strong> {fotoSelecionada.tags}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setDialogVisualizacao(false)
                      handleEditar(fotoSelecionada)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Galeria
