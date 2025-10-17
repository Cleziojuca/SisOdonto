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
