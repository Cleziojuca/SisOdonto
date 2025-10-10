import { useState } from 'react'
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
  CalendarPlus
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
      dataCadastro: '2024-01-15',
      anamnese: {
        profissao: 'Engenheiro',
        estadoCivil: 'Casado(a)',
        indicacao: 'Indicação de amigo',
        problemasSaude: 'Hipertensão controlada',
        medicamentos: 'Losartana 50mg',
        alergias: 'Nenhuma conhecida',
        cirurgias: '',
        hospitalizacoes: '',
        ultimaConsulta: '2023-12-15',
        motivoConsulta: 'Limpeza e avaliação',
        dorDente: false,
        sangramento: true,
        sensibilidade: true,
        mauHalito: false,
        escovacao: '3x ao dia',
        fioDental: 'Diariamente',
        enxaguante: true,
        fumo: false,
        alcool: false,
        roerUnhas: false,
        rangerDentes: false,
        pressaoArterial: '130x85',
        observacoesClinicas: 'Gengivite leve, necessário profilaxia',
        planoTratamento: 'Limpeza profissional e orientação de higiene',
        gravidez: false,
        amamentacao: false,
        diabetes: false,
        hipertensao: true,
        cardiopatia: false,
        hepatite: false,
        hiv: false,
        epilepsia: false,
        observacoesAnamnese: 'Paciente colaborativo'
      }
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
      observacoes: 'Paciente ansiosa',
      status: 'Ativo',
      dataCadastro: '2024-02-10',
      anamnese: {
        profissao: 'Professora',
        estadoCivil: 'Solteiro(a)',
        indicacao: 'Internet',
        problemasSaude: '',
        medicamentos: '',
        alergias: 'Penicilina',
        cirurgias: '',
        hospitalizacoes: '',
        ultimaConsulta: '2024-01-20',
        motivoConsulta: 'Dor no dente',
        dorDente: true,
        sangramento: false,
        sensibilidade: false,
        mauHalito: false,
        escovacao: '2x ao dia',
        fioDental: 'Algumas vezes por semana',
        enxaguante: false,
        fumo: false,
        alcool: false,
        roerUnhas: true,
        rangerDentes: true,
        pressaoArterial: '120x80',
        observacoesClinicas: 'Cárie no molar superior direito',
        planoTratamento: 'Restauração e orientação sobre bruxismo',
        gravidez: false,
        amamentacao: false,
        diabetes: false,
        hipertensao: false,
        cardiopatia: false,
        hepatite: false,
        hiv: false,
        epilepsia: false,
        observacoesAnamnese: 'Paciente com ansiedade odontológica'
      }
    },
    {
      id: 3,
      nome: 'Ana Costa',
      email: 'ana.costa@email.com',
      telefone: '(11) 77777-7777',
      cpf: '456.789.123-00',
      dataNascimento: '1988-03-10',
      endereco: 'Rua Augusta, 789',
      cidade: 'São Paulo',
      cep: '01305-000',
      convenio: 'Bradesco Saúde',
      observacoes: 'Primeira consulta',
      status: 'Ativo',
      dataCadastro: '2024-10-03',
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
      }
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
    }
  })

  const pacientesFiltrados = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    paciente.email.toLowerCase().includes(filtro.toLowerCase()) ||
    paciente.telefone.includes(filtro)
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

  return (
    <div className="space-y-6">
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
                Gerencie os dados dos pacientes e suas anamneses
              </CardDescription>
            </div>
            <Button onClick={handleNovo} className="bg-red-600 hover:bg-red-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="max-w-sm border-red-200 focus:border-red-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal de Cadastro/Edição */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {modoEdicao ? 'Editar Paciente' : 'Novo Paciente'}
            </DialogTitle>
            <DialogDescription>
              {modoEdicao ? 'Atualize as informações do paciente' : 'Cadastre um novo paciente no sistema'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs defaultValue="dados-pessoais" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dados-pessoais" className="flex items-center">
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
              
              <TabsContent value="dados-pessoais" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </TabsContent>
              
              <TabsContent value="anamnese" className="space-y-6 mt-4">
                {/* Dados Pessoais Complementares */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center text-lg">
                      <User className="h-5 w-5 mr-2" />
                      Dados Pessoais Complementares
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="profissao">Profissão</Label>
                        <Input
                          id="profissao"
                          value={formData.anamnese.profissao}
                          onChange={(e) => handleInputChange('anamnese.profissao', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="estadoCivil">Estado Civil</Label>
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
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="indicacao">Como chegou até nós?</Label>
                        <Input
                          id="indicacao"
                          value={formData.anamnese.indicacao}
                          onChange={(e) => handleInputChange('anamnese.indicacao', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          placeholder="Ex: Indicação de amigo, internet, etc."
                        />
                      </div>
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
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="problemasSaude">Possui algum problema de saúde?</Label>
                        <Textarea
                          id="problemasSaude"
                          value={formData.anamnese.problemasSaude}
                          onChange={(e) => handleInputChange('anamnese.problemasSaude', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          rows={2}
                          placeholder="Descreva problemas de saúde atuais ou passados"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="medicamentos">Faz uso de algum medicamento?</Label>
                        <Textarea
                          id="medicamentos"
                          value={formData.anamnese.medicamentos}
                          onChange={(e) => handleInputChange('anamnese.medicamentos', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          rows={2}
                          placeholder="Liste os medicamentos em uso"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="alergias">Possui alguma alergia?</Label>
                        <Textarea
                          id="alergias"
                          value={formData.anamnese.alergias}
                          onChange={(e) => handleInputChange('anamnese.alergias', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          rows={2}
                          placeholder="Alergias a medicamentos, alimentos, materiais, etc."
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cirurgias">Já fez alguma cirurgia?</Label>
                          <Textarea
                            id="cirurgias"
                            value={formData.anamnese.cirurgias}
                            onChange={(e) => handleInputChange('anamnese.cirurgias', e.target.value)}
                            className="border-red-200 focus:border-red-500"
                            rows={2}
                            placeholder="Descreva cirurgias realizadas"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="hospitalizacoes">Já foi hospitalizado?</Label>
                          <Textarea
                            id="hospitalizacoes"
                            value={formData.anamnese.hospitalizacoes}
                            onChange={(e) => handleInputChange('anamnese.hospitalizacoes', e.target.value)}
                            className="border-red-200 focus:border-red-500"
                            rows={2}
                            placeholder="Motivo e período das hospitalizações"
                          />
                        </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="diabetes"
                          checked={formData.anamnese.diabetes}
                          onCheckedChange={(checked) => handleInputChange('anamnese.diabetes', checked)}
                        />
                        <Label htmlFor="diabetes">Diabetes</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hipertensao"
                          checked={formData.anamnese.hipertensao}
                          onCheckedChange={(checked) => handleInputChange('anamnese.hipertensao', checked)}
                        />
                        <Label htmlFor="hipertensao">Hipertensão</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cardiopatia"
                          checked={formData.anamnese.cardiopatia}
                          onCheckedChange={(checked) => handleInputChange('anamnese.cardiopatia', checked)}
                        />
                        <Label htmlFor="cardiopatia">Problemas Cardíacos</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hepatite"
                          checked={formData.anamnese.hepatite}
                          onCheckedChange={(checked) => handleInputChange('anamnese.hepatite', checked)}
                        />
                        <Label htmlFor="hepatite">Hepatite</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hiv"
                          checked={formData.anamnese.hiv}
                          onCheckedChange={(checked) => handleInputChange('anamnese.hiv', checked)}
                        />
                        <Label htmlFor="hiv">HIV</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="epilepsia"
                          checked={formData.anamnese.epilepsia}
                          onCheckedChange={(checked) => handleInputChange('anamnese.epilepsia', checked)}
                        />
                        <Label htmlFor="epilepsia">Epilepsia</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="gravidez"
                          checked={formData.anamnese.gravidez}
                          onCheckedChange={(checked) => handleInputChange('anamnese.gravidez', checked)}
                        />
                        <Label htmlFor="gravidez">Gravidez</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="amamentacao"
                          checked={formData.anamnese.amamentacao}
                          onCheckedChange={(checked) => handleInputChange('anamnese.amamentacao', checked)}
                        />
                        <Label htmlFor="amamentacao">Amamentação</Label>
                      </div>
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
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ultimaConsulta">Última consulta odontológica</Label>
                          <Input
                            id="ultimaConsulta"
                            type="date"
                            value={formData.anamnese.ultimaConsulta}
                            onChange={(e) => handleInputChange('anamnese.ultimaConsulta', e.target.value)}
                            className="border-red-200 focus:border-red-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pressaoArterial">Pressão Arterial</Label>
                          <Input
                            id="pressaoArterial"
                            value={formData.anamnese.pressaoArterial}
                            onChange={(e) => handleInputChange('anamnese.pressaoArterial', e.target.value)}
                            className="border-red-200 focus:border-red-500"
                            placeholder="Ex: 120x80"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="motivoConsulta">Motivo da consulta atual</Label>
                        <Textarea
                          id="motivoConsulta"
                          value={formData.anamnese.motivoConsulta}
                          onChange={(e) => handleInputChange('anamnese.motivoConsulta', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          rows={2}
                          placeholder="Descreva o motivo da consulta"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Sintomas atuais:</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="dorDente"
                              checked={formData.anamnese.dorDente}
                              onCheckedChange={(checked) => handleInputChange('anamnese.dorDente', checked)}
                            />
                            <Label htmlFor="dorDente">Dor de dente</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="sangramento"
                              checked={formData.anamnese.sangramento}
                              onCheckedChange={(checked) => handleInputChange('anamnese.sangramento', checked)}
                            />
                            <Label htmlFor="sangramento">Sangramento</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="sensibilidade"
                              checked={formData.anamnese.sensibilidade}
                              onCheckedChange={(checked) => handleInputChange('anamnese.sensibilidade', checked)}
                            />
                            <Label htmlFor="sensibilidade">Sensibilidade</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="mauHalito"
                              checked={formData.anamnese.mauHalito}
                              onCheckedChange={(checked) => handleInputChange('anamnese.mauHalito', checked)}
                            />
                            <Label htmlFor="mauHalito">Mau hálito</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hábitos de Higiene */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center text-lg">
                      <Pill className="h-5 w-5 mr-2" />
                      Hábitos de Higiene e Comportamentais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="escovacao">Frequência de escovação</Label>
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
                          <Label htmlFor="fioDental">Uso do fio dental</Label>
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
                      
                      <div className="space-y-3">
                        <Label>Hábitos:</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="enxaguante"
                              checked={formData.anamnese.enxaguante}
                              onCheckedChange={(checked) => handleInputChange('anamnese.enxaguante', checked)}
                            />
                            <Label htmlFor="enxaguante">Usa enxaguante bucal</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fumo"
                              checked={formData.anamnese.fumo}
                              onCheckedChange={(checked) => handleInputChange('anamnese.fumo', checked)}
                            />
                            <Label htmlFor="fumo">Fumante</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="alcool"
                              checked={formData.anamnese.alcool}
                              onCheckedChange={(checked) => handleInputChange('anamnese.alcool', checked)}
                            />
                            <Label htmlFor="alcool">Consome álcool</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="roerUnhas"
                              checked={formData.anamnese.roerUnhas}
                              onCheckedChange={(checked) => handleInputChange('anamnese.roerUnhas', checked)}
                            />
                            <Label htmlFor="roerUnhas">Roer unhas</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="rangerDentes"
                              checked={formData.anamnese.rangerDentes}
                              onCheckedChange={(checked) => handleInputChange('anamnese.rangerDentes', checked)}
                            />
                            <Label htmlFor="rangerDentes">Ranger os dentes</Label>
                          </div>
                        </div>
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
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="observacoesClinicas">Observações do Exame Clínico</Label>
                        <Textarea
                          id="observacoesClinicas"
                          value={formData.anamnese.observacoesClinicas}
                          onChange={(e) => handleInputChange('anamnese.observacoesClinicas', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          rows={3}
                          placeholder="Observações do dentista sobre o exame clínico"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="planoTratamento">Plano de Tratamento</Label>
                        <Textarea
                          id="planoTratamento"
                          value={formData.anamnese.planoTratamento}
                          onChange={(e) => handleInputChange('anamnese.planoTratamento', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          rows={3}
                          placeholder="Plano de tratamento proposto"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="observacoesAnamnese">Observações Gerais da Anamnese</Label>
                        <Textarea
                          id="observacoesAnamnese"
                          value={formData.anamnese.observacoesAnamnese}
                          onChange={(e) => handleInputChange('anamnese.observacoesAnamnese', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          rows={3}
                          placeholder="Outras observações importantes"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="agendamento" className="space-y-6 mt-4">
                {/* Agendamento de Consulta */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center text-lg">
                      <CalendarPlus className="h-5 w-5 mr-2" />
                      Agendar Nova Consulta
                    </CardTitle>
                    <CardDescription>
                      Defina data, hora e detalhes da consulta para este paciente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dataConsulta">Data da Consulta *</Label>
                        <Input
                          id="dataConsulta"
                          type="date"
                          value={formData.agendamento?.dataConsulta || ''}
                          onChange={(e) => handleInputChange('agendamento.dataConsulta', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="horaConsulta">Horário *</Label>
                        <Select value={formData.agendamento?.horaConsulta || ''} onValueChange={(value) => handleInputChange('agendamento.horaConsulta', value)}>
                          <SelectTrigger className="border-red-200 focus:border-red-500">
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00">08:00</SelectItem>
                            <SelectItem value="08:30">08:30</SelectItem>
                            <SelectItem value="09:00">09:00</SelectItem>
                            <SelectItem value="09:30">09:30</SelectItem>
                            <SelectItem value="10:00">10:00</SelectItem>
                            <SelectItem value="10:30">10:30</SelectItem>
                            <SelectItem value="11:00">11:00</SelectItem>
                            <SelectItem value="11:30">11:30</SelectItem>
                            <SelectItem value="14:00">14:00</SelectItem>
                            <SelectItem value="14:30">14:30</SelectItem>
                            <SelectItem value="15:00">15:00</SelectItem>
                            <SelectItem value="15:30">15:30</SelectItem>
                            <SelectItem value="16:00">16:00</SelectItem>
                            <SelectItem value="16:30">16:30</SelectItem>
                            <SelectItem value="17:00">17:00</SelectItem>
                            <SelectItem value="17:30">17:30</SelectItem>
                            <SelectItem value="18:00">18:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="procedimento">Procedimento/Tratamento *</Label>
                        <Select value={formData.agendamento?.procedimento || ''} onValueChange={(value) => handleInputChange('agendamento.procedimento', value)}>
                          <SelectTrigger className="border-red-200 focus:border-red-500">
                            <SelectValue placeholder="Selecione o procedimento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Consulta">Consulta</SelectItem>
                            <SelectItem value="Limpeza">Limpeza</SelectItem>
                            <SelectItem value="Restauração">Restauração</SelectItem>
                            <SelectItem value="Extração">Extração</SelectItem>
                            <SelectItem value="Canal">Canal</SelectItem>
                            <SelectItem value="Prótese">Prótese</SelectItem>
                            <SelectItem value="Ortodontia">Ortodontia</SelectItem>
                            <SelectItem value="Implante">Implante</SelectItem>
                            <SelectItem value="Clareamento">Clareamento</SelectItem>
                            <SelectItem value="Emergência">Emergência</SelectItem>
                            <SelectItem value="Retorno">Retorno</SelectItem>
                            <SelectItem value="Avaliação">Avaliação</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="duracao">Duração Estimada</Label>
                        <Select value={formData.agendamento?.duracao || ''} onValueChange={(value) => handleInputChange('agendamento.duracao', value)}>
                          <SelectTrigger className="border-red-200 focus:border-red-500">
                            <SelectValue placeholder="Selecione a duração" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="60">1 hora</SelectItem>
                            <SelectItem value="90">1h 30min</SelectItem>
                            <SelectItem value="120">2 horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="statusAgendamento">Status</Label>
                        <Select value={formData.agendamento?.status || 'Agendado'} onValueChange={(value) => handleInputChange('agendamento.status', value)}>
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
                        <Label htmlFor="valorConsulta">Valor da Consulta (R$)</Label>
                        <Input
                          id="valorConsulta"
                          type="number"
                          step="0.01"
                          value={formData.agendamento?.valor || ''}
                          onChange={(e) => handleInputChange('agendamento.valor', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          placeholder="0,00"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="observacoesAgendamento">Observações da Consulta</Label>
                        <Textarea
                          id="observacoesAgendamento"
                          value={formData.agendamento?.observacoes || ''}
                          onChange={(e) => handleInputChange('agendamento.observacoes', e.target.value)}
                          className="border-red-200 focus:border-red-500"
                          rows={3}
                          placeholder="Observações específicas sobre a consulta, preparos necessários, etc."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações de Contato e Lembrete */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center text-lg">
                      <Clock className="h-5 w-5 mr-2" />
                      Configurações de Lembrete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enviarLembrete"
                          checked={formData.agendamento?.enviarLembrete || false}
                          onCheckedChange={(checked) => handleInputChange('agendamento.enviarLembrete', checked)}
                        />
                        <Label htmlFor="enviarLembrete">Enviar lembrete por WhatsApp/SMS</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enviarEmail"
                          checked={formData.agendamento?.enviarEmail || false}
                          onCheckedChange={(checked) => handleInputChange('agendamento.enviarEmail', checked)}
                        />
                        <Label htmlFor="enviarEmail">Enviar confirmação por email</Label>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="antecedenciaLembrete">Antecedência do Lembrete</Label>
                          <Select value={formData.agendamento?.antecedenciaLembrete || '24'} onValueChange={(value) => handleInputChange('agendamento.antecedenciaLembrete', value)}>
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
                          <Label htmlFor="prioridade">Prioridade</Label>
                          <Select value={formData.agendamento?.prioridade || 'Normal'} onValueChange={(value) => handleInputChange('agendamento.prioridade', value)}>
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
                    </div>
                  </CardContent>
                </Card>

                {/* Resumo do Agendamento */}
                {(formData.agendamento?.dataConsulta && formData.agendamento?.horaConsulta && formData.agendamento?.procedimento) && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-600 flex items-center text-lg">
                        <Calendar className="h-5 w-5 mr-2" />
                        Resumo do Agendamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <strong className="mr-2">Paciente:</strong>
                          <span>{formData.nome}</span>
                        </div>
                        <div className="flex items-center">
                          <strong className="mr-2">Data:</strong>
                          <span>{new Date(formData.agendamento.dataConsulta + 'T00:00:00').toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center">
                          <strong className="mr-2">Horário:</strong>
                          <span>{formData.agendamento.horaConsulta}</span>
                        </div>
                        <div className="flex items-center">
                          <strong className="mr-2">Procedimento:</strong>
                          <span>{formData.agendamento.procedimento}</span>
                        </div>
                        {formData.agendamento.duracao && (
                          <div className="flex items-center">
                            <strong className="mr-2">Duração:</strong>
                            <span>{formData.agendamento.duracao} minutos</span>
                          </div>
                        )}
                        {formData.agendamento.valor && (
                          <div className="flex items-center">
                            <strong className="mr-2">Valor:</strong>
                            <span>R$ {parseFloat(formData.agendamento.valor).toFixed(2).replace('.', ',')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
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
              
              <div className="flex justify-between items-center pt-3 border-t">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditar(paciente)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExcluir(paciente.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </div>
                {paciente.anamnese && (paciente.anamnese.profissao || paciente.anamnese.problemasSaude) && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <ClipboardList className="h-3 w-3 mr-1" />
                    Anamnese
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {pacientesFiltrados.length === 0 && (
        <Card className="border-red-200">
          <CardContent className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum paciente encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {filtro ? 'Ajuste o filtro de busca ou' : ''} Cadastre o primeiro paciente
            </p>
            <Button onClick={handleNovo} className="bg-red-600 hover:bg-red-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CadastroPacientes
