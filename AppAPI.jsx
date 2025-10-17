import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Home, 
  UserPlus, 
  FileText, 
  DollarSign, 
  Calendar, 
  Camera,
  Users,
  Edit,
  BarChart3,
  CreditCard,
  Bell,
  LogOut,
  Settings,
  Download,
  Upload,
  Trash2,
  Shield,
  Loader2
} from 'lucide-react'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import Login from './components/Login.jsx'
import CadastroPacientes from './components/CadastroPacientesAPI.jsx'
import Relatorios from './components/Relatorios.jsx'
import Financeiro from './components/Financeiro.jsx'
import Agendamento from './components/Agendamento.jsx'
import Galeria from './components/Galeria.jsx'
import apiService from './services/api.js'
import './App.css'

// Componente de Administração
const Administracao = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [estatisticas, setEstatisticas] = useState(null)
  const [backups, setBackups] = useState([])

  useEffect(() => {
    carregarEstatisticas()
    carregarBackups()
  }, [])

  const carregarEstatisticas = async () => {
    try {
      const data = await apiService.obterEstatisticas()
      setEstatisticas(data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const carregarBackups = async () => {
    try {
      const data = await apiService.listarBackups()
      setBackups(data)
    } catch (error) {
      console.error('Erro ao carregar backups:', error)
    }
  }

  const criarBackup = async () => {
    try {
      setLoading(true)
      setError('')
      const resultado = await apiService.criarBackup()
      setSuccess(`Backup criado com sucesso! ${resultado.total_pacientes} pacientes salvos.`)
      carregarBackups()
    } catch (error) {
      setError(`Erro ao criar backup: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const downloadBackup = async (filename) => {
    try {
      const blob = await apiService.downloadBackup(filename)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      setError(`Erro ao fazer download: ${error.message}`)
    }
  }

  const limparDados = async () => {
    if (!window.confirm('ATENÇÃO: Esta ação irá excluir TODOS os dados do sistema. Esta ação é IRREVERSÍVEL. Tem certeza?')) {
      return
    }

    if (!window.confirm('Última confirmação: Todos os pacientes, agendamentos e dados serão perdidos permanentemente. Continuar?')) {
      return
    }

    try {
      setLoading(true)
      setError('')
      const resultado = await apiService.limparDados()
      setSuccess(`Dados limpos com sucesso! ${resultado.pacientes_removidos} pacientes removidos.`)
      carregarEstatisticas()
    } catch (error) {
      setError(`Erro ao limpar dados: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      {estatisticas && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Estatísticas do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{estatisticas.total_pacientes}</div>
                <div className="text-sm text-gray-600">Total de Pacientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{estatisticas.pacientes_ativos}</div>
                <div className="text-sm text-gray-600">Pacientes Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{estatisticas.pacientes_inativos}</div>
                <div className="text-sm text-gray-600">Pacientes Inativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup e Restauração */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Backup e Restauração
          </CardTitle>
          <CardDescription>
            Faça backup dos seus dados regularmente para garantir a segurança das informações.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={criarBackup} 
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Criar Backup
            </Button>
          </div>

          {backups.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Backups Disponíveis:</h4>
              {backups.map((backup) => (
                <div key={backup.filename} className="flex items-center justify-between p-2 border border-red-200 rounded">
                  <div>
                    <div className="font-medium">{backup.filename}</div>
                    <div className="text-sm text-gray-500">
                      Criado em: {new Date(backup.created_at).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBackup(backup.filename)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <Trash2 className="h-5 w-5 mr-2" />
            Zona de Perigo
          </CardTitle>
          <CardDescription className="text-red-600">
            Ações irreversíveis que podem causar perda de dados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={limparDados}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Limpar Todos os Dados
          </Button>
          <p className="text-sm text-red-600 mt-2">
            Esta ação irá excluir permanentemente todos os pacientes e dados do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente principal da aplicação
const MainApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [estatisticas, setEstatisticas] = useState({
    totalPacientes: 0,
    pacientesAtivos: 0,
    agendamentosHoje: 0,
    receitaMensal: 0
  })
  const { logout } = useAuth()

  useEffect(() => {
    carregarEstatisticasDashboard()
  }, [])

  const carregarEstatisticasDashboard = async () => {
    try {
      const data = await apiService.obterEstatisticas()
      setEstatisticas({
        totalPacientes: data.total_pacientes,
        pacientesAtivos: data.pacientes_ativos,
        agendamentosHoje: 0, // TODO: implementar contagem de agendamentos
        receitaMensal: 0 // TODO: implementar cálculo de receita
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas do dashboard:', error)
    }
  }

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair do sistema?')) {
      await logout()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Consultório Odontológico</h1>
                <p className="text-red-100">Sistema de Gestão Completo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 cursor-pointer hover:text-red-200 transition-colors" />
              <div className="bg-red-700 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Dra. Janete Orestes</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white border border-red-200">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="cadastro" className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <UserPlus className="h-4 w-4" />
              <span>Cadastro</span>
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              <span>Relatórios</span>
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <DollarSign className="h-4 w-4" />
              <span>Financeiro</span>
            </TabsTrigger>
            <TabsTrigger value="agenda" className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Calendar className="h-4 w-4" />
              <span>Agenda</span>
            </TabsTrigger>
            <TabsTrigger value="galeria" className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Camera className="h-4 w-4" />
              <span>Galeria</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-600">Pacientes Cadastrados</CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{estatisticas.totalPacientes}</div>
                  <p className="text-xs text-gray-600">
                    {estatisticas.pacientesAtivos} ativos
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-600">Agendamentos Hoje</CardTitle>
                  <Calendar className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{estatisticas.agendamentosHoje}</div>
                  <p className="text-xs text-gray-600">
                    consultas marcadas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-600">Receita Mensal</CardTitle>
                  <DollarSign className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">R$ {estatisticas.receitaMensal.toLocaleString('pt-BR')}</div>
                  <p className="text-xs text-gray-600">
                    este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-600">Pendências</CardTitle>
                  <Bell className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <p className="text-xs text-gray-600">
                    itens pendentes
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Atividades Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-100 p-2 rounded-full">
                        <UserPlus className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sistema iniciado</p>
                        <p className="text-xs text-gray-600">Conectado ao banco de dados</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Próximos Agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum agendamento próximo</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Outras abas */}
          <TabsContent value="cadastro">
            <CadastroPacientes />
          </TabsContent>

          <TabsContent value="relatorios">
            <Relatorios />
          </TabsContent>

          <TabsContent value="financeiro">
            <Financeiro />
          </TabsContent>

          <TabsContent value="agenda">
            <Agendamento />
          </TabsContent>

          <TabsContent value="galeria">
            <Galeria />
          </TabsContent>

          <TabsContent value="admin">
            <Administracao />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Componente wrapper com autenticação
const AppWrapper = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-red-600">Carregando sistema...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <MainApp /> : <Login />
}

// Componente principal da aplicação
function App() {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  )
}

export default App
