Text file: App.jsx
Latest content with line numbers:
2	import { Button } from '@/components/ui/button.jsx'
3	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
4	import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
5	import { 
6	  Home, 
7	  UserPlus, 
8	  FileText, 
9	  DollarSign, 
10	  Calendar, 
11	  Camera,
12	  Users,
13	  Edit,
14	  BarChart3,
15	  CreditCard,
16	  Bell
17	} from 'lucide-react'
18	import CadastroPacientes from './components/CadastroPacientes.jsx'
19	import Relatorios from './components/Relatorios.jsx'
20	import Financeiro from './components/Financeiro.jsx'
21	import Agendamento from './components/Agendamento.jsx'
22	import Galeria from './components/Galeria.jsx'
23	import './App.css'
24	
25	function App() {
26	  const [activeTab, setActiveTab] = useState('dashboard')
27	
28	  return (
29	    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
30	      {/* Header */}
31	      <header className="bg-red-600 text-white shadow-lg">
32	        <div className="container mx-auto px-4 py-6">
33	          <div className="flex items-center justify-between">
34	            <div className="flex items-center space-x-3">
35	              <div className="bg-white p-2 rounded-full">
36	                <Users className="h-8 w-8 text-red-600" />
37	              </div>
38	              <div>
39	                <h1 className="text-2xl font-bold">Consultório Odontológico</h1>
40	                <p className="text-red-100">Sistema de Gestão Completo</p>
41	              </div>
42	            </div>
43	            <div className="flex items-center space-x-4">
44	              <Bell className="h-6 w-6 cursor-pointer hover:text-red-200 transition-colors" />
45	              <div className="bg-red-700 px-4 py-2 rounded-lg">
46	                <span className="text-sm font-medium">Dra. Janete Orestes</span>
47	              </div>
48	            </div>
49	          </div>
50	        </div>