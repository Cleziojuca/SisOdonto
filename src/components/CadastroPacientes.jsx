import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  User,
  FileText,
  Save,
  X
} from 'lucide-react'

const CadastroPacientes = () => {
  const [pacientes, setPacientes] = useState([
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      dataNascimento: '1985-05-15',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      cep: '01234-567',
      convenio: 'Particular',
      observacoes: 'Paciente com histórico de sensibilidade',
      status: 'Ativo',
      dataCadastro: '2024-01-15'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      telefone: '(11) 88888-8888',
      cpf: '987.654.321-00',
      dataNascimento: '1990-08-22',
      endereco: 'Av. Paulista, 456',
      cidade: 'São Paulo',
      cep: '01310-100',
      convenio: 'Unimed',
      observacoes: 'Alergia a anestésicos locais',
      status: 'Ativo',
      dataCadastro: '2024-02-10'
    }
  ])

  const [filtro, setFiltro] = useState('')
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    endereco: '',
    cidade: '',
    cep: '',
    convenio: '',
    observacoes: '',
    status: 'Ativo'
  })

  const pacientesFiltrados = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    paciente.email.toLowerCase().includes(filtro.toLowerCase()) ||
    paciente.telefone.includes(filtro)
  )

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const handleSalvar = () => {
    if (modoEdicao) {
      setPacientes(prev => prev.map(p => 
        p.id === pacienteSelecionado.id 
          ? { ...formData, id: pacienteSelecionado.id, dataCadastro: pacienteSelecionado.dataCadastro }
          : p
      ))
    } else {
      const novoPaciente = {
        ...formData,
        id: Date.now(),
        dataCadastro: new Date().toISOString().split('T')[0]
      }
      setPacientes(prev => [...prev, novoPaciente])
    }
    
    setDialogAberto(false)
    resetForm()
  }

  const handleEditar = (paciente) => {
    setPacienteSelecionado(paciente)
    setFormData(paciente)
    setModoEdicao(true)
    setDialogAberto(true)
  }

  const handleNovo = () => {
    resetForm()
    setModoEdicao(false)
    setDialogAberto(true)
  }

  const handleExcluir = (id) => {
    setPacientes(prev => prev.filter(p => p.id !== id))
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      dataNascimento: '',
      endereco: '',
      cidade: '',
      cep: '',
      convenio: '',
      observacoes: '',
      status: 'Ativo'
    })
    setPacienteSelecionado(null)
  }

  return (
    <div className="space-y-6">
      {/* Header com busca e botão novo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar pacientes..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 border-red-200 focus:border-red-500"
          />
        </div>
        
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={handleNovo} className="bg-red-600 hover:bg-red-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-red-600">
                {modoEdicao ? 'Editar Paciente' : 'Novo Paciente'}
              </DialogTitle>
              <DialogDescription>
                {modoEdicao ? 'Atualize as informações do paciente' : 'Preencha os dados do novo paciente'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="convenio">Convênio</Label>
                <Select value={formData.convenio} onValueChange={(value) => handleInputChange('convenio', value)}>
                  <SelectTrigger className="border-red-200 focus:border-red-500">
                    <SelectValue placeholder="Selecione o convênio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Particular">Particular</SelectItem>
                    <SelectItem value="Unimed">Unimed</SelectItem>
                    <SelectItem value="Bradesco Saúde">Bradesco Saúde</SelectItem>
                    <SelectItem value="SulAmérica">SulAmérica</SelectItem>
                    <SelectItem value="Amil">Amil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="border-red-200 focus:border-red-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacoes">Observações Médicas</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSalvar} className="bg-red-600 hover:bg-red-700">
                <Save className="h-4 w-4 mr-2" />
                {modoEdicao ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de pacientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pacientesFiltrados.map((paciente) => (
          <Card key={paciente.id} className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-red-600 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {paciente.nome}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Cadastrado em {new Date(paciente.dataCadastro).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <Badge variant={paciente.status === 'Ativo' ? 'default' : 'secondary'}>
                  {paciente.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-red-500" />
                  {paciente.telefone}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-red-500" />
                  {paciente.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  {paciente.cidade}
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="h-4 w-4 mr-2 text-red-500" />
                  {paciente.convenio}
                </div>
              </div>
              
              {paciente.observacoes && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Obs:</strong> {paciente.observacoes}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditar(paciente)}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExcluir(paciente.id)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pacientesFiltrados.length === 0 && (
        <Card className="border-red-200">
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum paciente encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {filtro ? 'Tente ajustar os filtros de busca' : 'Comece cadastrando seu primeiro paciente'}
            </p>
            {!filtro && (
              <Button onClick={handleNovo} className="bg-red-600 hover:bg-red-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Paciente
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CadastroPacientes
