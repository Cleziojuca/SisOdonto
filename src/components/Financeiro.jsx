import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Calendar } from '@/components/ui/calendar.jsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx'
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Banknote,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Search
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const Financeiro = () => {
  const [activeTab, setActiveTab] = useState('receitas')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState(null)
  const [filtroMes, setFiltroMes] = useState(new Date().getMonth() + 1)
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear())
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [busca, setBusca] = useState('')

  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    categoria: '',
    dataLancamento: new Date(),
    dataVencimento: new Date(),
    status: 'pendente',
    paciente: '',
    observacoes: '',
    tipo: 'receita'
  })

  // Dados simulados para demonstração
  const [transacoes, setTransacoes] = useState([
    {
      id: 1,
      descricao: 'Consulta - João Silva',
      valor: 250.00,
      categoria: 'Consulta',
      dataLancamento: '2024-10-01',
      dataVencimento: '2024-10-01',
      status: 'pago',
      paciente: 'João Silva',
      tipo: 'receita',
      observacoes: 'Limpeza e avaliação'
    },
    {
      id: 2,
      descricao: 'Tratamento Canal - Maria Santos',
      valor: 800.00,
      categoria: 'Tratamento',
      dataLancamento: '2024-10-02',
      dataVencimento: '2024-10-15',
      status: 'pendente',
      paciente: 'Maria Santos',
      tipo: 'receita',
      observacoes: 'Primeira sessão de 3'
    },
    {
      id: 3,
      descricao: 'Material Odontológico',
      valor: 450.00,
      categoria: 'Material',
      dataLancamento: '2024-10-01',
      dataVencimento: '2024-10-01',
      status: 'pago',
      paciente: '',
      tipo: 'despesa',
      observacoes: 'Resinas e anestésicos'
    },
    {
      id: 4,
      descricao: 'Aluguel do Consultório',
      valor: 2500.00,
      categoria: 'Aluguel',
      dataLancamento: '2024-10-01',
      dataVencimento: '2024-10-05',
      status: 'pago',
      paciente: '',
      tipo: 'despesa',
      observacoes: 'Outubro 2024'
    },
    {
      id: 5,
      descricao: 'Implante - Ana Costa',
      valor: 1200.00,
      categoria: 'Cirurgia',
      dataLancamento: '2024-10-03',
      dataVencimento: '2024-10-20',
      status: 'atrasado',
      paciente: 'Ana Costa',
      tipo: 'receita',
      observacoes: 'Pagamento parcelado'
    }
  ])

  const categorias = {
    receita: ['Consulta', 'Tratamento', 'Cirurgia', 'Limpeza', 'Ortodontia', 'Prótese'],
    despesa: ['Material', 'Aluguel', 'Energia', 'Telefone', 'Internet', 'Equipamentos', 'Salários']
  }

  // Filtrar transações
  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter(transacao => {
      const dataLancamento = new Date(transacao.dataLancamento)
      const mesTransacao = dataLancamento.getMonth() + 1
      const anoTransacao = dataLancamento.getFullYear()
      
      const matchMes = filtroMes === 'todos' || mesTransacao === parseInt(filtroMes)
      const matchAno = anoTransacao === parseInt(filtroAno)
      const matchStatus = filtroStatus === 'todos' || transacao.status === filtroStatus
      const matchTipo = activeTab === 'todas' || transacao.tipo === activeTab.slice(0, -1) // remove 's' do final
      const matchBusca = busca === '' || 
        transacao.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        transacao.paciente.toLowerCase().includes(busca.toLowerCase())
      
      return matchMes && matchAno && matchStatus && matchTipo && matchBusca
    })
  }, [transacoes, filtroMes, filtroAno, filtroStatus, activeTab, busca])

  // Calcular estatísticas
  const estatisticas = useMemo(() => {
    const receitas = transacoesFiltradas.filter(t => t.tipo === 'receita')
    const despesas = transacoesFiltradas.filter(t => t.tipo === 'despesa')
    
    const totalReceitas = receitas.reduce((sum, t) => sum + t.valor, 0)
    const totalDespesas = despesas.reduce((sum, t) => sum + t.valor, 0)
    const lucro = totalReceitas - totalDespesas
    
    const receitasPagas = receitas.filter(t => t.status === 'pago').reduce((sum, t) => sum + t.valor, 0)
    const receitasPendentes = receitas.filter(t => t.status === 'pendente').reduce((sum, t) => sum + t.valor, 0)
    const receitasAtrasadas = receitas.filter(t => t.status === 'atrasado').reduce((sum, t) => sum + t.valor, 0)
    
    return {
      totalReceitas,
      totalDespesas,
      lucro,
      receitasPagas,
      receitasPendentes,
      receitasAtrasadas,
      totalTransacoes: transacoesFiltradas.length
    }
  }, [transacoesFiltradas])

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const handleSalvar = () => {
    if (modoEdicao) {
      setTransacoes(prev => prev.map(t => 
        t.id === itemSelecionado.id 
          ? { ...formData, id: itemSelecionado.id }
          : t
      ))
    } else {
      const novaTransacao = {
        ...formData,
        id: Date.now(),
        valor: parseFloat(formData.valor),
        dataLancamento: format(formData.dataLancamento, 'yyyy-MM-dd'),
        dataVencimento: format(formData.dataVencimento, 'yyyy-MM-dd')
      }
      setTransacoes(prev => [...prev, novaTransacao])
    }
    
    setDialogAberto(false)
    resetForm()
  }

  const handleEditar = (transacao) => {
    setItemSelecionado(transacao)
    setFormData({
      ...transacao,
      dataLancamento: new Date(transacao.dataLancamento),
      dataVencimento: new Date(transacao.dataVencimento)
    })
    setModoEdicao(true)
    setDialogAberto(true)
  }

  const handleNovo = (tipo) => {
    resetForm()
    setFormData(prev => ({ ...prev, tipo }))
    setModoEdicao(false)
    setDialogAberto(true)
  }

  const handleExcluir = (id) => {
    setTransacoes(prev => prev.filter(t => t.id !== id))
  }

  const resetForm = () => {
    setFormData({
      descricao: '',
      valor: '',
      categoria: '',
      dataLancamento: new Date(),
      dataVencimento: new Date(),
      status: 'pendente',
      paciente: '',
      observacoes: '',
      tipo: 'receita'
    })
    setItemSelecionado(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800'
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      case 'atrasado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pago': return <CheckCircle className="h-4 w-4" />
      case 'pendente': return <Clock className="h-4 w-4" />
      case 'atrasado': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Mês</Label>
              <Select value={filtroMes.toString()} onValueChange={setFiltroMes}>
                <SelectTrigger className="border-red-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Meses</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {format(new Date(2024, i, 1), 'MMMM', { locale: ptBR })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ano</Label>
              <Select value={filtroAno.toString()} onValueChange={setFiltroAno}>
                <SelectTrigger className="border-red-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="border-red-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 border-red-200"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {estatisticas.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {estatisticas.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
                <p className={`text-2xl font-bold ${estatisticas.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {estatisticas.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Atraso</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {estatisticas.receitasAtrasadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Transações */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-white border border-red-200">
            <TabsTrigger value="receitas" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Receitas
            </TabsTrigger>
            <TabsTrigger value="despesas" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Despesas
            </TabsTrigger>
            <TabsTrigger value="todas" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Todas
            </TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button onClick={() => handleNovo('receita')} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Receita
            </Button>
            <Button onClick={() => handleNovo('despesa')} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="space-y-4">
          {transacoesFiltradas.map((transacao) => (
            <Card key={transacao.id} className="border-red-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{transacao.descricao}</h3>
                      <Badge className={`${getStatusColor(transacao.status)} flex items-center space-x-1`}>
                        {getStatusIcon(transacao.status)}
                        <span className="capitalize">{transacao.status}</span>
                      </Badge>
                      <Badge variant="outline" className="border-red-200">
                        {transacao.categoria}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-red-500" />
                        <span>Lançamento: {format(new Date(transacao.dataLancamento), 'dd/MM/yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-red-500" />
                        <span>Vencimento: {format(new Date(transacao.dataVencimento), 'dd/MM/yyyy')}</span>
                      </div>
                      {transacao.paciente && (
                        <div className="flex items-center">
                          <Receipt className="h-4 w-4 mr-2 text-red-500" />
                          <span>Paciente: {transacao.paciente}</span>
                        </div>
                      )}
                      {transacao.observacoes && (
                        <div className="flex items-center">
                          <span className="text-gray-500">{transacao.observacoes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                        {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditar(transacao)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExcluir(transacao.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {transacoesFiltradas.length === 0 && (
          <Card className="border-red-200">
            <CardContent className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma transação encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                Ajuste os filtros ou adicione uma nova transação
              </p>
            </CardContent>
          </Card>
        )}
      </Tabs>

      {/* Dialog para Nova/Editar Transação */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {modoEdicao ? 'Editar Transação' : `Nova ${formData.tipo === 'receita' ? 'Receita' : 'Despesa'}`}
            </DialogTitle>
            <DialogDescription>
              {modoEdicao ? 'Atualize as informações da transação' : 'Preencha os dados da nova transação'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                className="border-red-200 focus:border-red-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor">Valor *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => handleInputChange('valor', e.target.value)}
                className="border-red-200 focus:border-red-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias[formData.tipo]?.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Data de Lançamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left border-red-200">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.dataLancamento, 'dd/MM/yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dataLancamento}
                    onSelect={(date) => handleInputChange('dataLancamento', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left border-red-200">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.dataVencimento, 'dd/MM/yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dataVencimento}
                    onSelect={(date) => handleInputChange('dataVencimento', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
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
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                className="border-red-200 focus:border-red-500"
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
    </div>
  )
}

export default Financeiro
