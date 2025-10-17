import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
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
  X,
  ClipboardList,
  Heart,
  AlertTriangle,
  Pill,
  Activity,
  Clock,
  CalendarPlus,
  Loader2
} from 'lucide-react'
import apiService from '../services/api'

const CadastroPacientes = () => {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filtro, setFiltro] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)

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
    status: 'Ativo',
    anamnese: {
      profissao: '',
      estadoCivil: '',
      indicacao: '',
      problemasSaude: '',
      medicamentos: '',
      alergias: '',
      cirurgias: '',
      hospitalizacoes: '',
      ultimaConsulta: '',
      motivoConsulta: '',
      dorDente: false,
      sangramento: false,
      sensibilidade: false,
      mauHalito: false,
      escovacao: '',
      fioDental: '',
      enxaguante: false,
      fumo: false,
      alcool: false,
      roerUnhas: false,
      rangerDentes: false,
      pressaoArterial: '',
      observacoesClinicas: '',
      planoTratamento: '',
      gravidez: false,
      amamentacao: false,
      diabetes: false,
      hipertensao: false,
      cardiopatia: false,
      hepatite: false,
      hiv: false,
      epilepsia: false,
      observacoesAnamnese: ''
    },
    agendamento: {
      dataConsulta: '',
      horaConsulta: '',
      procedimento: '',
      duracao: '',
      status: 'Agendado',
      valor: '',
      observacoes: '',
      enviarLembrete: false,
      enviarEmail: false,
      antecedenciaLembrete: '24',
      prioridade: 'Normal'
    }
  })

  // Carrega pacientes ao montar o componente
  useEffect(() => {
    carregarPacientes()
  }, [])

  const carregarPacientes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await apiService.listarPacientes()
      setPacientes(data)
    } catch (error) {
      setError(`Erro ao carregar pacientes: ${error.message}`)
      console.error('Erro ao carregar pacientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const pacientesFiltrados = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    paciente.email?.toLowerCase().includes(filtro.toLowerCase()) ||
    paciente.telefone?.includes(filtro) ||
    paciente.cpf?.includes(filtro)
  )

  const handleInputChange = (campo, valor) => {
    if (campo.startsWith('anamnese.')) {
      const anamneseCampo = campo.replace('anamnese.', '')
      setFormData(prev => ({
        ...prev,
        anamnese: {
          ...prev.anamnese,
          [anamneseCampo]: valor
        }
      }))
    } else if (campo.startsWith('agendamento.')) {
      const agendamentoCampo = campo.replace('agendamento.', '')
      setFormData(prev => ({
        ...prev,
        agendamento: {
          ...prev.agendamento,
          [agendamentoCampo]: valor
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [campo]: valor
      }))
    }
  }

  const handleSalvar = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      // Validações básicas
      if (!formData.nome.trim()) {
        setError('Nome é obrigatório')
        return
      }

      if (!formData.cpf.trim()) {
        setError('CPF é obrigatório')
        return
      }

      // Formatar CPF
      const cpfFormatado = apiService.formatarCPF(formData.cpf)
      if (!apiService.validarCPF(cpfFormatado)) {
        setError('CPF inválido')
        return
      }

      const dadosParaEnviar = {
        ...formData,
        cpf: cpfFormatado
      }

      if (modoEdicao) {
        // Atualizar paciente existente
        const pacienteAtualizado = await apiService.atualizarPaciente(pacienteSelecionado.cpf, dadosParaEnviar)
        setPacientes(prev => prev.map(p => 
          p.cpf === pacienteSelecionado.cpf ? pacienteAtualizado : p
        ))
        setSuccess('Paciente atualizado com sucesso!')
      } else {
        // Criar novo paciente
        const novoPaciente = await apiService.criarPaciente(dadosParaEnviar)
        setPacientes(prev => [...prev, novoPaciente])
        setSuccess('Paciente cadastrado com sucesso!')
      }

      setDialogAberto(false)
      resetForm()
    } catch (error) {
      setError(error.message)
      console.error('Erro ao salvar paciente:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleEditar = (paciente) => {
    setPacienteSelecionado(paciente)
    setFormData({
      ...paciente,
      anamnese: paciente.anamnese || {},
      agendamento: paciente.agendamento || {}
    })
    setModoEdicao(true)
    setDialogAberto(true)
    setError('')
    setSuccess('')
  }

  const handleNovo = () => {
    resetForm()
    setModoEdicao(false)
    setDialogAberto(true)
    setError('')
    setSuccess('')
  }

  const handleExcluir = async (cpf) => {
    if (!window.confirm('Tem certeza que deseja excluir este paciente?')) {
      return
    }

    try {
      await apiService.excluirPaciente(cpf)
      setPacientes(prev => prev.filter(p => p.cpf !== cpf))
      setSuccess('Paciente excluído com sucesso!')
    } catch (error) {
      setError(`Erro ao excluir paciente: ${error.message}`)
      console.error('Erro ao excluir paciente:', error)
    }
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
      status: 'Ativo',
      anamnese: {
        profissao: '',
        estadoCivil: '',
        indicacao: '',
        problemasSaude: '',
        medicamentos: '',
        alergias: '',
        cirurgias: '',
        hospitalizacoes: '',
        ultimaConsulta: '',
        motivoConsulta: '',
        dorDente: false,
        sangramento: false,
        sensibilidade: false,
        mauHalito: false,
        escovacao: '',
        fioDental: '',
        enxaguante: false,
        fumo: false,
        alcool: false,
        roerUnhas: false,
        rangerDentes: false,
        pressaoArterial: '',
        observacoesClinicas: '',
        planoTratamento: '',
        gravidez: false,
        amamentacao: false,
        diabetes: false,
        hipertensao: false,
        cardiopatia: false,
        hepatite: false,
        hiv: false,
        epilepsia: false,
        observacoesAnamnese: ''
      },
      agendamento: {
        dataConsulta: '',
        horaConsulta: '',
        procedimento: '',
        duracao: '',
        status: 'Agendado',
        valor: '',
        observacoes: '',
        enviarLembrete: false,
        enviarEmail: false,
        antecedenciaLembrete: '24',
        prioridade: 'Normal'
      }
    })
    setPacienteSelecionado(null)
  }

  // Limpar mensagens após alguns segundos
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <span className="ml-2 text-red-600">Carregando pacientes...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mensagens de feedback */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-600">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Header e Filtros */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-red-600 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Cadastro de Pacientes
              </CardTitle>
              <CardDescription>
                Gerencie os dados dos pacientes e suas anamneses ({pacientes.length} pacientes cadastrados)
              </CardDescription>
            </div>
            <Button onClick={handleNovo} className="bg-red-600 hover:bg-red-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email, telefone ou CPF..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-10 border-red-200 focus:border-red-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pacientes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pacientesFiltrados.map((paciente) => (
          <Card key={paciente.cpf} className="border-red-100 hover:border-red-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-red-600 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {paciente.nome}
                  </CardTitle>
                  <Badge variant={paciente.status === 'Ativo' ? 'default' : 'secondary'} className="mt-1">
                    {paciente.status}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Cadastrado em {paciente.dataCadastro}
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="h-3 w-3 mr-2 text-gray-400" />
                {paciente.telefone}
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-3 w-3 mr-2 text-gray-400" />
                {paciente.email}
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                {paciente.cidade}
              </div>
              <div className="flex items-center text-sm">
                <FileText className="h-3 w-3 mr-2 text-gray-400" />
                {paciente.convenio}
              </div>
              
              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditar(paciente)}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExcluir(paciente.cpf)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pacientesFiltrados.length === 0 && !loading && (
        <Card className="border-red-200">
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {filtro ? 'Nenhum paciente encontrado com os critérios de busca.' : 'Nenhum paciente cadastrado ainda.'}
            </p>
            {!filtro && (
              <Button onClick={handleNovo} className="mt-4 bg-red-600 hover:bg-red-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Paciente
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {modoEdicao ? 'Editar Paciente' : 'Novo Paciente'}
            </DialogTitle>
            <DialogDescription>
              {modoEdicao ? 'Atualize as informações do paciente' : 'Preencha os dados do novo paciente'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dados" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Dados Pessoais
              </TabsTrigger>
              <TabsTrigger value="anamnese" className="flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                Anamnese
              </TabsTrigger>
              <TabsTrigger value="agendamento" className="flex items-center">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Agendamento
              </TabsTrigger>
            </TabsList>

            {/* Aba Dados Pessoais */}
            <TabsContent value="dados" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="border-red-200 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    className="border-red-200 focus:border-red-500"
                    disabled={modoEdicao} // CPF não pode ser alterado
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="Bradesco">Bradesco Saúde</SelectItem>
                      <SelectItem value="SulAmérica">SulAmérica</SelectItem>
                      <SelectItem value="Amil">Amil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Médicas</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Aba Anamnese - Conteúdo similar ao original mas usando handleInputChange */}
            <TabsContent value="anamnese" className="space-y-6">
              {/* Dados Pessoais Complementares */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center text-lg">
                    <User className="h-5 w-5 mr-2" />
                    Dados Pessoais Complementares
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Profissão</Label>
                      <Input
                        value={formData.anamnese.profissao}
                        onChange={(e) => handleInputChange('anamnese.profissao', e.target.value)}
                        className="border-red-200 focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estado Civil</Label>
                      <Select value={formData.anamnese.estadoCivil} onValueChange={(value) => handleInputChange('anamnese.estadoCivil', value)}>
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                          <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                          <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                          <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                          <SelectItem value="União Estável">União Estável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Como chegou até nós? (Indicação)</Label>
                    <Input
                      value={formData.anamnese.indicacao}
                      onChange={(e) => handleInputChange('anamnese.indicacao', e.target.value)}
                      className="border-red-200 focus:border-red-500"
                      placeholder="Ex: Indicação de amigo, internet, etc."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Histórico Médico */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center text-lg">
                    <Heart className="h-5 w-5 mr-2" />
                    Histórico Médico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Possui algum problema de saúde?</Label>
                    <Textarea
                      value={formData.anamnese.problemasSaude}
                      onChange={(e) => handleInputChange('anamnese.problemasSaude', e.target.value)}
                      className="border-red-200 focus:border-red-500"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Faz uso de algum medicamento?</Label>
                    <Textarea
                      value={formData.anamnese.medicamentos}
                      onChange={(e) => handleInputChange('anamnese.medicamentos', e.target.value)}
                      className="border-red-200 focus:border-red-500"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Possui alguma alergia?</Label>
                    <Textarea
                      value={formData.anamnese.alergias}
                      onChange={(e) => handleInputChange('anamnese.alergias', e.target.value)}
                      className="border-red-200 focus:border-red-500"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Já fez alguma cirurgia?</Label>
                      <Textarea
                        value={formData.anamnese.cirurgias}
                        onChange={(e) => handleInputChange('anamnese.cirurgias', e.target.value)}
                        className="border-red-200 focus:border-red-500"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Já foi hospitalizado?</Label>
                      <Textarea
                        value={formData.anamnese.hospitalizacoes}
                        onChange={(e) => handleInputChange('anamnese.hospitalizacoes', e.target.value)}
                        className="border-red-200 focus:border-red-500"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Questionário Específico */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center text-lg">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Questionário Específico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'diabetes', label: 'Diabetes' },
                      { key: 'hipertensao', label: 'Hipertensão' },
                      { key: 'cardiopatia', label: 'Problemas Cardíacos (Cardiopatia)' },
                      { key: 'hepatite', label: 'Hepatite' },
                      { key: 'hiv', label: 'HIV' },
                      { key: 'epilepsia', label: 'Epilepsia' },
                      { key: 'gravidez', label: 'Gravidez' },
                      { key: 'amamentacao', label: 'Amamentação' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={item.key}
                          checked={formData.anamnese[item.key]}
                          onCheckedChange={(checked) => handleInputChange(`anamnese.${item.key}`, checked)}
                        />
                        <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Histórico Odontológico */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2" />
                    Histórico Odontológico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Última consulta odontológica</Label>
                      <Input
                        type="date"
                        value={formData.anamnese.ultimaConsulta}
                        onChange={(e) => handleInputChange('anamnese.ultimaConsulta', e.target.value)}
                        className="border-red-200 focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pressão Arterial</Label>
                      <Input
                        value={formData.anamnese.pressaoArterial}
                        onChange={(e) => handleInputChange('anamnese.pressaoArterial', e.target.value)}
                        className="border-red-200 focus:border-red-500"
                        placeholder="Ex: 120x80"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Motivo da consulta atual</Label>
                    <Textarea
                      value={formData.anamnese.motivoConsulta}
                      onChange={(e) => handleInputChange('anamnese.motivoConsulta', e.target.value)}
                      className="border-red-200 focus:border-red-500"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sintomas atuais</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'dorDente', label: 'Dor de dente' },
                        { key: 'sangramento', label: 'Sangramento' },
                        { key: 'sensibilidade', label: 'Sensibilidade' },
                        { key: 'mauHalito', label: 'Mau hálito' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.key}
                            checked={formData.anamnese[item.key]}
                            onCheckedChange={(checked) => handleInputChange(`anamnese.${item.key}`, checked)}
                          />
                          <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hábitos de Higiene e Comportamentais */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center text-lg">
                    <Pill className="h-5 w-5 mr-2" />
                    Hábitos de Higiene e Comportamentais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Frequência de escovação</Label>
                      <Select value={formData.anamnese.escovacao} onValueChange={(value) => handleInputChange('anamnese.escovacao', value)}>
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1x ao dia">1x ao dia</SelectItem>
                          <SelectItem value="2x ao dia">2x ao dia</SelectItem>
                          <SelectItem value="3x ao dia">3x ao dia</SelectItem>
                          <SelectItem value="Mais de 3x ao dia">Mais de 3x ao dia</SelectItem>
                          <SelectItem value="Raramente">Raramente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Uso do fio dental</Label>
                      <Select value={formData.anamnese.fioDental} onValueChange={(value) => handleInputChange('anamnese.fioDental', value)}>
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diariamente">Diariamente</SelectItem>
                          <SelectItem value="Algumas vezes por semana">Algumas vezes por semana</SelectItem>
                          <SelectItem value="Raramente">Raramente</SelectItem>
                          <SelectItem value="Nunca">Nunca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Hábitos</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'enxaguante', label: 'Usa enxaguante bucal' },
                        { key: 'fumo', label: 'Fumante' },
                        { key: 'alcool', label: 'Consome álcool' },
                        { key: 'roerUnhas', label: 'Roer unhas' },
                        { key: 'rangerDentes', label: 'Ranger os dentes' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.key}
                            checked={formData.anamnese[item.key]}
                            onCheckedChange={(checked) => handleInputChange(`anamnese.${item.key}`, checked)}
                          />
                          <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Observações e Plano de Tratamento */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center text-lg">
                    <FileText className="h-5 w-5 mr-2" />
                    Observações e Plano de Tratamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Observações do Exame Clínico</Label>
                    <Textarea
                      value={formData.anamnese.observacoesClinicas}
                      onChange={(e) => handleInputChange('anamnese.observacoesClinicas', e.target.value)}
                      className="border-red-200 focus:border-red-500"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Plano de Tratamento</Label>
                    <Textarea
                      value={formData.anamnese.planoTratamento}
                      onChange={(e) => handleInputChange('anamnese.planoTratamento', e.target.value)}
                      className="border-red-200 focus:border-red-500"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Observações Gerais da Anamnese</Label>
                    <Textarea
                      value={formData.anamnese.observacoesAnamnese}
                      onChange={(e) => handleInputChange('anamnese.observacoesAnamnese', e.target.value)}
                      className="border-red-200 focus:border-red-500"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Agendamento - Conteúdo similar ao original */}
            <TabsContent value="agendamento" className="space-y-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center">
                    <CalendarPlus className="h-5 w-5 mr-2" />
                    Agendar Nova Consulta
                  </CardTitle>
                  <CardDescription>
                    Defina data, hora e detalhes da consulta para este paciente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data da Consulta *</Label>
                      <Input
                        type="date"
                        value={formData.agendamento.dataConsulta}
                        onChange={(e) => handleInputChange('agendamento.dataConsulta', e.target.value)}
                        className="border-red-200 focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Horário *</Label>
                      <Select value={formData.agendamento.horaConsulta} onValueChange={(value) => handleInputChange('agendamento.horaConsulta', value)}>
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'].map(hora => (
                            <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Procedimento/Tratamento *</Label>
                      <Select value={formData.agendamento.procedimento} onValueChange={(value) => handleInputChange('agendamento.procedimento', value)}>
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue placeholder="Selecione o procedimento" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Consulta', 'Limpeza', 'Restauração', 'Extração', 'Canal', 'Prótese', 
                            'Ortodontia', 'Implante', 'Clareamento', 'Emergência', 'Retorno', 'Avaliação'].map(proc => (
                            <SelectItem key={proc} value={proc}>{proc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Duração Estimada</Label>
                      <Select value={formData.agendamento.duracao} onValueChange={(value) => handleInputChange('agendamento.duracao', value)}>
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue placeholder="Selecione a duração" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30min">30 minutos</SelectItem>
                          <SelectItem value="1h">1 hora</SelectItem>
                          <SelectItem value="1h30min">1 hora e 30 minutos</SelectItem>
                          <SelectItem value="2h">2 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formData.agendamento.status} onValueChange={(value) => handleInputChange('agendamento.status', value)}>
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Agendado">Agendado</SelectItem>
                          <SelectItem value="Confirmado">Confirmado</SelectItem>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Valor da Consulta (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={formData.agendamento.valor}
                        onChange={(e) => handleInputChange('agendamento.valor', e.target.value)}
                        className="border-red-200 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Observações da Consulta</Label>
                    <Textarea
                      value={formData.agendamento.observacoes}
                      onChange={(e) => handleInputChange('agendamento.observacoes', e.target.value)}
                      className="border-red-200 focus:border-red-500"
                      rows={3}
                      placeholder="Observações específicas sobre a consulta, preparos necessários, etc."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Configurações de Lembrete */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Configurações de Lembrete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enviarLembrete"
                        checked={formData.agendamento.enviarLembrete}
                        onCheckedChange={(checked) => handleInputChange('agendamento.enviarLembrete', checked)}
                      />
                      <Label htmlFor="enviarLembrete">Enviar lembrete por WhatsApp/SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enviarEmail"
                        checked={formData.agendamento.enviarEmail}
                        onCheckedChange={(checked) => handleInputChange('agendamento.enviarEmail', checked)}
                      />
                      <Label htmlFor="enviarEmail">Enviar confirmação por email</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Antecedência do Lembrete</Label>
                      <Select value={formData.agendamento.antecedenciaLembrete} onValueChange={(value) => handleInputChange('agendamento.antecedenciaLembrete', value)}>
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 horas antes</SelectItem>
                          <SelectItem value="24">1 dia antes</SelectItem>
                          <SelectItem value="48">2 dias antes</SelectItem>
                          <SelectItem value="72">3 dias antes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select value={formData.agendamento.prioridade} onValueChange={(value) => handleInputChange('agendamento.prioridade', value)}>
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="bg-red-600 hover:bg-red-700" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {modoEdicao ? 'Atualizar' : 'Salvar'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CadastroPacientes
