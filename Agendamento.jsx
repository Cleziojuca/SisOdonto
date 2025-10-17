import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar } from '@/components/ui/calendar.jsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Bell, 
  User, 
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Send,
  MessageSquare
} from 'lucide-react'
// Funções de data simplificadas para evitar dependências externas
const formatDate = (date, formatStr) => {
  const d = new Date(date)
  if (formatStr === 'dd/MM/yyyy') {
    return d.toLocaleDateString('pt-BR')
  }
  if (formatStr === 'yyyy-MM-dd') {
    return d.toISOString().split('T')[0]
  }
  return d.toLocaleDateString('pt-BR')
}

const isSameDay = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.toDateString() === d2.toDateString()
}

const parseISO = (dateString) => {
  return new Date(dateString)
}

const Agendamento = () => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date())
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [busca, setBusca] = useState('')
  const [dialogNotificacao, setDialogNotificacao] = useState(false)
  const [agendamentoNotificacao, setAgendamentoNotificacao] = useState(null)

  const [formData, setFormData] = useState({
    paciente: '',
    telefone: '',
    email: '',
    data: new Date(),
    horario: '',
    procedimento: '',
    duracao: '60',
    observacoes: '',
    status: 'agendado'
  })

  const [mensagemNotificacao, setMensagemNotificacao] = useState('')

  // Dados simulados para demonstração
  const [agendamentos, setAgendamentos] = useState([
    {
      id: 1,
      paciente: 'João Silva',
      telefone: '(11) 99999-9999',
      email: 'joao.silva@email.com',
      data: '2024-10-03',
      horario: '09:00',
      procedimento: 'Limpeza',
      duracao: '60',
      observacoes: 'Paciente com sensibilidade',
      status: 'confirmado'
    },
    {
      id: 2,
      paciente: 'Maria Santos',
      telefone: '(11) 88888-8888',
      email: 'maria.santos@email.com',
      data: '2024-10-03',
      horario: '10:30',
      procedimento: 'Consulta',
      duracao: '30',
      observacoes: '',
      status: 'agendado'
    },
    {
      id: 3,
      paciente: 'Ana Costa',
      telefone: '(11) 77777-7777',
      email: 'ana.costa@email.com',
      data: '2024-10-04',
      horario: '14:00',
      procedimento: 'Tratamento de Canal',
      duracao: '120',
      observacoes: 'Primeira sessão',
      status: 'agendado'
    },
    {
      id: 4,
      paciente: 'Pedro Oliveira',
      telefone: '(11) 66666-6666',
      email: 'pedro.oliveira@email.com',
      data: '2024-10-02',
      horario: '15:00',
      procedimento: 'Consulta',
      duracao: '30',
      observacoes: '',
      status: 'cancelado'
    }
  ])

  const horariosDisponiveis = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ]

  const procedimentos = [
    'Consulta', 'Limpeza', 'Tratamento de Canal', 'Extração',
    'Implante', 'Prótese', 'Ortodontia', 'Clareamento'
  ]

  // Filtrar agendamentos
  const agendamentosFiltrados = useMemo(() => {
    return agendamentos.filter(agendamento => {
      const matchStatus = filtroStatus === 'todos' || agendamento.status === filtroStatus
      const matchBusca = busca === '' || 
        agendamento.paciente.toLowerCase().includes(busca.toLowerCase()) ||
        agendamento.procedimento.toLowerCase().includes(busca.toLowerCase())
      
      return matchStatus && matchBusca
    })
  }, [agendamentos, filtroStatus, busca])

  // Agendamentos do dia selecionado
  const agendamentosDoDia = useMemo(() => {
    return agendamentosFiltrados.filter(agendamento => 
      isSameDay(parseISO(agendamento.data), dataSelecionada)
    ).sort((a, b) => a.horario.localeCompare(b.horario))
  }, [agendamentosFiltrados, dataSelecionada])

  // Verificar se uma data tem agendamentos
  const temAgendamentos = (data) => {
    return agendamentos.some(agendamento => 
      isSameDay(parseISO(agendamento.data), data)
    )
  }

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const handleSalvar = () => {
    if (modoEdicao) {
      setAgendamentos(prev => prev.map(a => 
        a.id === agendamentoSelecionado.id 
          ? { ...formData, id: agendamentoSelecionado.id, data: format(formData.data, 'yyyy-MM-dd') }
          : a
      ))
    } else {
      const novoAgendamento = {
        ...formData,
        id: Date.now(),
        data: formatDate(formData.data, 'yyyy-MM-dd')
      }
      setAgendamentos(prev => [...prev, novoAgendamento])
    }
    
    setDialogAberto(false)
    resetForm()
  }

  const handleEditar = (agendamento) => {
    setAgendamentoSelecionado(agendamento)
    setFormData({
      ...agendamento,
      data: parseISO(agendamento.data)
    })
    setModoEdicao(true)
    setDialogAberto(true)
  }

  const handleNovo = () => {
    resetForm()
    setFormData(prev => ({ ...prev, data: dataSelecionada }))
    setModoEdicao(false)
    setDialogAberto(true)
  }

  const handleExcluir = (id) => {
    setAgendamentos(prev => prev.filter(a => a.id !== id))
  }

  const handleAlterarStatus = (id, novoStatus) => {
    setAgendamentos(prev => prev.map(a => 
      a.id === id ? { ...a, status: novoStatus } : a
    ))
  }

  const handleNotificar = (agendamento) => {
    setAgendamentoNotificacao(agendamento)
    setMensagemNotificacao(`Olá ${agendamento.paciente}! Lembramos que você tem uma consulta agendada para ${formatDate(parseISO(agendamento.data), 'dd/MM/yyyy')} às ${agendamento.horario}. Confirme sua presença.`)
    setDialogNotificacao(true)
  }

  const enviarNotificacao = () => {
    // Aqui seria implementada a lógica real de envio de notificação
    alert(`Notificação enviada para ${agendamentoNotificacao.paciente}!`)
    setDialogNotificacao(false)
    setMensagemNotificacao('')
    setAgendamentoNotificacao(null)
  }

  const resetForm = () => {
    setFormData({
      paciente: '',
      telefone: '',
      email: '',
      data: new Date(),
      horario: '',
      procedimento: '',
      duracao: '60',
      observacoes: '',
      status: 'agendado'
    })
    setAgendamentoSelecionado(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800'
      case 'agendado': return 'bg-blue-100 text-blue-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      case 'concluido': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmado': return <CheckCircle className="h-4 w-4" />
      case 'agendado': return <Clock className="h-4 w-4" />
      case 'cancelado': return <XCircle className="h-4 w-4" />
      case 'concluido': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros de Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="border-red-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar paciente ou procedimento..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 border-red-200"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="border-red-200 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Calendário da Dentista
            </CardTitle>
            <CardDescription>
              Selecione uma data para ver os agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={dataSelecionada}
              onSelect={setDataSelecionada}
              className="rounded-md border border-red-200"
              modifiers={{
                hasAppointments: (date) => temAgendamentos(date)
              }}
              modifiersStyles={{
                hasAppointments: { 
                  backgroundColor: '#fef2f2', 
                  color: '#dc2626',
                  fontWeight: 'bold'
                }
              }}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
                <span>Dias com agendamentos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Agendamentos do Dia */}
        <Card className="border-red-200 lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-red-600">
                  Agendamentos - {formatDate(dataSelecionada, 'dd/MM/yyyy')}
                </CardTitle>
                <CardDescription>
                  {agendamentosDoDia.length} agendamento(s) para este dia
                </CardDescription>
              </div>
              <Button onClick={handleNovo} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agendamentosDoDia.map((agendamento) => (
                <Card key={agendamento.id} className="border-red-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{agendamento.paciente}</h3>
                          <Badge className={`${getStatusColor(agendamento.status)} flex items-center space-x-1`}>
                            {getStatusIcon(agendamento.status)}
                            <span className="capitalize">{agendamento.status}</span>
                          </Badge>
                          <Badge variant="outline" className="border-red-200">
                            {agendamento.procedimento}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-red-500" />
                            <span>{agendamento.horario} ({agendamento.duracao}min)</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-red-500" />
                            <span>{agendamento.telefone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-red-500" />
                            <span>{agendamento.email}</span>
                          </div>
                        </div>
                        
                        {agendamento.observacoes && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-sm">
                            <strong>Obs:</strong> {agendamento.observacoes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditar(agendamento)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNotificar(agendamento)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExcluir(agendamento.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {agendamento.status === 'agendado' && (
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAlterarStatus(agendamento.id, 'confirmado')}
                              className="text-xs border-green-200 text-green-600 hover:bg-green-50"
                            >
                              Confirmar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAlterarStatus(agendamento.id, 'cancelado')}
                              className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {agendamentosDoDia.length === 0 && (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum agendamento para este dia
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Selecione outra data ou crie um novo agendamento
                  </p>
                  <Button onClick={handleNovo} className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Agendamento
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para Novo/Editar Agendamento */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {modoEdicao ? 'Editar Agendamento' : 'Novo Agendamento'}
            </DialogTitle>
            <DialogDescription>
              {modoEdicao ? 'Atualize as informações do agendamento' : 'Preencha os dados do novo agendamento'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paciente">Nome do Paciente *</Label>
              <Input
                id="paciente"
                value={formData.paciente}
                onChange={(e) => handleInputChange('paciente', e.target.value)}
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
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left border-red-200">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(formData.data, 'dd/MM/yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.data}
                    onSelect={(date) => handleInputChange('data', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="horario">Horário *</Label>
              <Select value={formData.horario} onValueChange={(value) => handleInputChange('horario', value)}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {horariosDisponiveis.map((horario) => (
                    <SelectItem key={horario} value={horario}>{horario}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="procedimento">Procedimento *</Label>
              <Select value={formData.procedimento} onValueChange={(value) => handleInputChange('procedimento', value)}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione o procedimento" />
                </SelectTrigger>
                <SelectContent>
                  {procedimentos.map((proc) => (
                    <SelectItem key={proc} value={proc}>{proc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duracao">Duração (minutos)</Label>
              <Select value={formData.duracao} onValueChange={(value) => handleInputChange('duracao', value)}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">60 minutos</SelectItem>
                  <SelectItem value="90">90 minutos</SelectItem>
                  <SelectItem value="120">120 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
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
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="bg-red-600 hover:bg-red-700">
              {modoEdicao ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Notificação */}
      <Dialog open={dialogNotificacao} onOpenChange={setDialogNotificacao}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Notificar Paciente
            </DialogTitle>
            <DialogDescription>
              Envie uma notificação para {agendamentoNotificacao?.paciente}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                value={mensagemNotificacao}
                onChange={(e) => setMensagemNotificacao(e.target.value)}
                className="border-red-200 focus:border-red-500"
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogNotificacao(false)}>
              Cancelar
            </Button>
            <Button onClick={enviarNotificacao} className="bg-red-600 hover:bg-red-700">
              <Send className="h-4 w-4 mr-2" />
              Enviar Notificação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Agendamento
