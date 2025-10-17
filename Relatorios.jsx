import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const Relatorios = () => {
  // Estados para os 3 filtros principais
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroPeriodo, setFiltroPeriodo] = useState('mes_atual')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  
  const [tipoRelatorio, setTipoRelatorio] = useState('pacientes')

  // Dados simulados para demonstração
  const dadosPacientes = [
    { id: 1, nome: 'João Silva', idade: 38, convenio: 'Particular', status: 'Ativo', ultimaConsulta: '2024-09-15', valor: 250 },
    { id: 2, nome: 'Maria Santos', idade: 33, convenio: 'Unimed', status: 'Ativo', ultimaConsulta: '2024-09-20', valor: 180 },
    { id: 3, nome: 'Ana Costa', idade: 45, convenio: 'Particular', status: 'Ativo', ultimaConsulta: '2024-10-01', valor: 320 },
    { id: 4, nome: 'Pedro Oliveira', idade: 28, convenio: 'Bradesco', status: 'Inativo', ultimaConsulta: '2024-08-10', valor: 150 },
    { id: 5, nome: 'Carla Mendes', idade: 52, convenio: 'SulAmérica', status: 'Ativo', ultimaConsulta: '2024-09-25', valor: 280 }
  ]

  const dadosFinanceiros = [
    { mes: 'Jan', receitas: 12500, despesas: 3200, lucro: 9300 },
    { mes: 'Fev', receitas: 14200, despesas: 3800, lucro: 10400 },
    { mes: 'Mar', receitas: 13800, despesas: 3500, lucro: 10300 },
    { mes: 'Abr', receitas: 15600, despesas: 4100, lucro: 11500 },
    { mes: 'Mai', receitas: 16200, despesas: 4300, lucro: 11900 },
    { mes: 'Jun', receitas: 15800, despesas: 4000, lucro: 11800 },
    { mes: 'Jul', receitas: 17200, despesas: 4500, lucro: 12700 },
    { mes: 'Ago', receitas: 16800, despesas: 4200, lucro: 12600 },
    { mes: 'Set', receitas: 18500, despesas: 4800, lucro: 13700 },
    { mes: 'Out', receitas: 15240, despesas: 3850, lucro: 11390 }
  ]

  const dadosAgendamentos = [
    { data: '2024-10-01', total: 12, confirmados: 10, cancelados: 2, pendentes: 0 },
    { data: '2024-10-02', total: 15, confirmados: 13, cancelados: 1, pendentes: 1 },
    { data: '2024-10-03', total: 8, confirmados: 6, cancelados: 0, pendentes: 2 },
    { data: '2024-10-04', total: 18, confirmados: 16, cancelados: 2, pendentes: 0 },
    { data: '2024-10-05', total: 14, confirmados: 12, cancelados: 1, pendentes: 1 }
  ]

  const dadosConvenios = [
    { nome: 'Particular', quantidade: 45, valor: 12500, cor: '#dc2626' },
    { nome: 'Unimed', quantidade: 32, valor: 8900, cor: '#ea580c' },
    { nome: 'Bradesco', quantidade: 28, valor: 7200, cor: '#d97706' },
    { nome: 'SulAmérica', quantidade: 22, valor: 6100, cor: '#ca8a04' },
    { nome: 'Amil', quantidade: 18, valor: 4800, cor: '#65a30d' }
  ]

  // Função para filtrar dados baseado nos 3 filtros principais
  const dadosFiltrados = useMemo(() => {
    let dados = dadosPacientes

    // Filtro 1: Tipo (Convênio)
    if (filtroTipo !== 'todos') {
      dados = dados.filter(item => item.convenio.toLowerCase() === filtroTipo.toLowerCase())
    }

    // Filtro 2: Período (baseado na última consulta)
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const inicioAno = new Date(hoje.getFullYear(), 0, 1)

    if (filtroPeriodo === 'mes_atual') {
      dados = dados.filter(item => new Date(item.ultimaConsulta) >= inicioMes)
    } else if (filtroPeriodo === 'ano_atual') {
      dados = dados.filter(item => new Date(item.ultimaConsulta) >= inicioAno)
    }

    // Filtro 3: Status
    if (filtroStatus !== 'todos') {
      dados = dados.filter(item => item.status.toLowerCase() === filtroStatus.toLowerCase())
    }

    return dados
  }, [filtroTipo, filtroPeriodo, filtroStatus])

  const estatisticas = useMemo(() => {
    const total = dadosFiltrados.length
    const ativos = dadosFiltrados.filter(p => p.status === 'Ativo').length
    const valorTotal = dadosFiltrados.reduce((sum, p) => sum + p.valor, 0)
    const idadeMedia = total > 0 ? Math.round(dadosFiltrados.reduce((sum, p) => sum + p.idade, 0) / total) : 0

    return { total, ativos, valorTotal, idadeMedia }
  }, [dadosFiltrados])

  const exportarRelatorio = () => {
    const dados = {
      tipo: tipoRelatorio,
      filtros: { filtroTipo, filtroPeriodo, filtroStatus },
      dados: dadosFiltrados,
      estatisticas,
      dataGeracao: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_${tipoRelatorio}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header com filtros principais */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros de Relatório
          </CardTitle>
          <CardDescription>
            Configure os 3 filtros principais para personalizar seus relatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro 1: Tipo/Convênio */}
            <div className="space-y-2">
              <Label htmlFor="filtro-tipo">Filtro 1: Tipo/Convênio</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Convênios</SelectItem>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="unimed">Unimed</SelectItem>
                  <SelectItem value="bradesco">Bradesco</SelectItem>
                  <SelectItem value="sulamérica">SulAmérica</SelectItem>
                  <SelectItem value="amil">Amil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro 2: Período */}
            <div className="space-y-2">
              <Label htmlFor="filtro-periodo">Filtro 2: Período</Label>
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Períodos</SelectItem>
                  <SelectItem value="mes_atual">Mês Atual</SelectItem>
                  <SelectItem value="ano_atual">Ano Atual</SelectItem>
                  <SelectItem value="ultimos_30_dias">Últimos 30 Dias</SelectItem>
                  <SelectItem value="ultimos_90_dias">Últimos 90 Dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro 3: Status */}
            <div className="space-y-2">
              <Label htmlFor="filtro-status">Filtro 3: Status</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pacientes</p>
                <p className="text-2xl font-bold text-red-600">{estatisticas.total}</p>
              </div>
              <Users className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pacientes Ativos</p>
                <p className="text-2xl font-bold text-green-600">{estatisticas.ativos}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-red-600">R$ {estatisticas.valorTotal.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Idade Média</p>
                <p className="text-2xl font-bold text-red-600">{estatisticas.idadeMedia} anos</p>
              </div>
              <Activity className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tipos de relatórios */}
      <Tabs value={tipoRelatorio} onValueChange={setTipoRelatorio}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-md grid-cols-4 bg-white border border-red-200">
            <TabsTrigger value="pacientes" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="agendamentos" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Agenda
            </TabsTrigger>
            <TabsTrigger value="convenios" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Convênios
            </TabsTrigger>
          </TabsList>
          
          <Button onClick={exportarRelatorio} className="bg-red-600 hover:bg-red-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Relatório de Pacientes */}
        <TabsContent value="pacientes" className="space-y-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Relatório de Pacientes</CardTitle>
              <CardDescription>
                Lista detalhada dos pacientes filtrados ({dadosFiltrados.length} registros)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-red-200">
                      <th className="text-left p-3 font-medium text-gray-700">Nome</th>
                      <th className="text-left p-3 font-medium text-gray-700">Idade</th>
                      <th className="text-left p-3 font-medium text-gray-700">Convênio</th>
                      <th className="text-left p-3 font-medium text-gray-700">Status</th>
                      <th className="text-left p-3 font-medium text-gray-700">Última Consulta</th>
                      <th className="text-right p-3 font-medium text-gray-700">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosFiltrados.map((paciente) => (
                      <tr key={paciente.id} className="border-b border-gray-100 hover:bg-red-50">
                        <td className="p-3 font-medium">{paciente.nome}</td>
                        <td className="p-3">{paciente.idade} anos</td>
                        <td className="p-3">{paciente.convenio}</td>
                        <td className="p-3">
                          <Badge variant={paciente.status === 'Ativo' ? 'default' : 'secondary'}>
                            {paciente.status}
                          </Badge>
                        </td>
                        <td className="p-3">{new Date(paciente.ultimaConsulta).toLocaleDateString('pt-BR')}</td>
                        <td className="p-3 text-right font-medium text-red-600">
                          R$ {paciente.valor.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório Financeiro */}
        <TabsContent value="financeiro" className="space-y-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Relatório Financeiro</CardTitle>
              <CardDescription>Evolução das receitas, despesas e lucro ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosFinanceiros}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, '']} />
                    <Bar dataKey="receitas" fill="#dc2626" name="Receitas" />
                    <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                    <Bar dataKey="lucro" fill="#16a34a" name="Lucro" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Agendamentos */}
        <TabsContent value="agendamentos" className="space-y-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Relatório de Agendamentos</CardTitle>
              <CardDescription>Status dos agendamentos por dia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosAgendamentos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')} />
                    <Line type="monotone" dataKey="confirmados" stroke="#16a34a" name="Confirmados" />
                    <Line type="monotone" dataKey="cancelados" stroke="#dc2626" name="Cancelados" />
                    <Line type="monotone" dataKey="pendentes" stroke="#eab308" name="Pendentes" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Convênios */}
        <TabsContent value="convenios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Distribuição por Convênio</CardTitle>
                <CardDescription>Quantidade de pacientes por convênio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosConvenios}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="quantidade"
                        label={({ nome, quantidade }) => `${nome}: ${quantidade}`}
                      >
                        {dadosConvenios.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Receita por Convênio</CardTitle>
                <CardDescription>Valor total gerado por cada convênio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dadosConvenios.map((convenio) => (
                    <div key={convenio.nome} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: convenio.cor }}
                        />
                        <span className="font-medium">{convenio.nome}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">R$ {convenio.valor.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{convenio.quantidade} pacientes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Relatorios
