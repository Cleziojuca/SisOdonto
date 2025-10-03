import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
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
  Bell
} from 'lucide-react'
import CadastroPacientes from './components/CadastroPacientes.jsx'
import Relatorios from './components/Relatorios.jsx'
import Financeiro from './components/Financeiro.jsx'
import Agendamento from './components/Agendamento.jsx'
import Galeria from './components/Galeria.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

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
                <span className="text-sm font-medium">Dr. Maria Silva</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-white border border-red-200 rounded-lg p-1">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="cadastro" 
              className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Cadastro</span>
            </TabsTrigger>
            <TabsTrigger 
              value="relatorios" 
              className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
            <TabsTrigger 
              value="financeiro" 
              className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
            <TabsTrigger 
              value="agendamento" 
              className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Agenda</span>
            </TabsTrigger>
            <TabsTrigger 
              value="galeria" 
              className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Galeria</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-red-200 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Pacientes Hoje
                  </CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <p className="text-xs text-gray-500">
                    +2 desde ontem
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Receita Mensal
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">R$ 15.240</div>
                  <p className="text-xs text-gray-500">
                    +8% desde o mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Próximos Agendamentos
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">8</div>
                  <p className="text-xs text-gray-500">
                    Para as próximas 2 horas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Pendências
                  </CardTitle>
                  <Bell className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <p className="text-xs text-gray-500">
                    Pagamentos em atraso
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Agenda de Hoje</CardTitle>
                  <CardDescription>Próximos agendamentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">João Silva</p>
                        <p className="text-sm text-gray-500">Limpeza</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">09:00</p>
                        <p className="text-sm text-gray-500">Confirmado</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">Maria Santos</p>
                        <p className="text-sm text-gray-500">Consulta</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">10:30</p>
                        <p className="text-sm text-gray-500">Pendente</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Resumo Financeiro</CardTitle>
                  <CardDescription>Últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Receitas</span>
                      <span className="font-bold text-green-600">R$ 15.240</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Despesas</span>
                      <span className="font-bold text-red-600">R$ 3.850</span>
                    </div>
                    <hr className="border-red-200" />
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Lucro Líquido</span>
                      <span className="font-bold text-red-600 text-lg">R$ 11.390</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Placeholder para outras abas */}
          <TabsContent value="cadastro">
            <CadastroPacientes />
          </TabsContent>

          <TabsContent value="relatorios">
            <Relatorios />
          </TabsContent>

          <TabsContent value="financeiro">
            <Financeiro />
          </TabsContent>

          <TabsContent value="agendamento">
            <Agendamento />
          </TabsContent>

          <TabsContent value="galeria">
            <Galeria />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App
