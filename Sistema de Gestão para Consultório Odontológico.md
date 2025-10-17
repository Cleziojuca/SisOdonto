# Sistema de Gestão para Consultório Odontológico

## 📋 Visão Geral

Sistema web responsivo completo desenvolvido especificamente para consultórios odontológicos, oferecendo uma solução integrada para gestão de pacientes, agendamentos, controle financeiro, relatórios e galeria de fotos.

## 🎨 Design e Interface

- **Cores Tema**: Vermelho e branco conforme solicitado

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

- **Interface Moderna**: Utiliza componentes profissionais com animações suaves

- **Navegação Intuitiva**: Sistema de abas para fácil acesso às funcionalidades

## 🚀 Funcionalidades Principais

### 1. Dashboard

- **Métricas em Tempo Real**: Pacientes do dia, receita mensal, próximos agendamentos

- **Agenda de Hoje**: Lista dos próximos agendamentos com status

- **Resumo Financeiro**: Receitas, despesas e lucro líquido dos últimos 30 dias

- **Alertas**: Pendências e pagamentos em atraso

### 2. Cadastro de Pacientes

- **Cadastro Completo**: Nome, telefone, email, endereço, convênio

- **Busca Avançada**: Por nome, email ou telefone

- **Edição e Exclusão**: Gerenciamento completo dos dados

- **Validação**: Campos obrigatórios e formatação automática

### 3. Sistema de Relatórios

- **3 Filtros Principais** conforme solicitado:
  - Filtro 1: Tipo/Convênio (Particular, Unimed, Bradesco, SulAmérica, Amil)
  - Filtro 2: Período (Mês atual, ano atual, últimos 30/90 dias)
  - Filtro 3: Status (Ativos, inativos ou todos)

- **4 Tipos de Relatórios**:
  - Relatório de Pacientes (tabela detalhada)
  - Relatório Financeiro (gráfico de barras)
  - Relatório de Agenda (gráfico de linha)
  - Relatório de Convênios (gráfico de pizza)

- **Exportação**: Dados em formato JSON

- **Estatísticas Dinâmicas**: Atualizadas conforme filtros

### 4. Controle Financeiro

- **Gestão de Receitas e Despesas**: Cadastro completo com categorização

- **Controle de Pagamentos Mensais**: Com datas de lançamento e vencimento

- **Status de Pagamento**: Pendente, Pago, Atrasado com cores distintas

- **Filtros Avançados**: Por mês, ano, status e busca textual

- **Estatísticas Automáticas**: Total de receitas, despesas e lucro líquido

- **Vinculação com Pacientes**: Associação de receitas a pacientes específicos

### 5. Sistema de Agendamento

- **Calendário da Dentista**: Interface visual com indicação de dias ocupados

- **Gestão Completa**: Criar, editar, excluir e alterar status dos agendamentos

- **Informações Detalhadas**: Paciente, procedimento, duração, observações

- **Status Dinâmicos**: Agendado, Confirmado, Cancelado, Concluído

- **Sistema de Notificações**: Envio de lembretes personalizados para pacientes

- **Filtros**: Por status e busca por paciente/procedimento

- **Horários Pré-definidos**: Lista de horários disponíveis

### 6. Galeria de Fotos

- **Categorização**: Antes e Depois, Procedimentos, Tratamentos, Estética, Consultório

- **Upload de Fotos**: Interface para adicionar novas imagens

- **Metadados Completos**: Título, descrição, paciente, data, tags

- **Visualização Ampliada**: Modal com imagem em alta resolução

- **Filtros Avançados**: Por categoria e busca textual

- **Ações**: Download, compartilhamento e edição de fotos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 com Vite

- **Estilização**: Tailwind CSS

- **Componentes**: Shadcn/UI

- **Ícones**: Lucide React

- **Gráficos**: Recharts

- **Calendário**: React Day Picker

- **Responsividade**: Mobile-first design

## 📱 Compatibilidade

- **Desktop**: Windows, macOS, Linux

- **Mobile**: iOS, Android

- **Navegadores**: Chrome, Firefox, Safari, Edge

- **PWA Ready**: Pode ser instalado como aplicativo

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js 18+

- npm ou pnpm

### Passos para Instalação

```bash
# 1. Navegar para o diretório do projeto
cd consultorio_odontologico/sistema-odontologico

# 2. Instalar dependências
npm install

# 3. Executar em modo desenvolvimento
npm run dev

# 4. Acessar no navegador
http://localhost:5173
```

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Visualizar build localmente
npm run preview
```

## 📊 Estrutura do Projeto

```
sistema-odontologico/
├── src/
│   ├── components/
│   │   ├── CadastroPacientes.jsx
│   │   ├── Relatorios.jsx
│   │   ├── Financeiro.jsx
│   │   ├── Agendamento.jsx
│   │   └── Galeria.jsx
│   ├── components/ui/
│   │   └── [componentes shadcn/ui]
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

## 🎯 Funcionalidades Específicas Implementadas

### ✅ Requisitos Atendidos

- [x] Sistema responsivo (site e app)

- [x] Cores vermelho e branco

- [x] Abas de navegação

- [x] Fotos integradas

- [x] Aba de cadastro com edição

- [x] Relatórios com 3 filtros diferentes

- [x] Vários tipos de relatórios

- [x] Aba financeiro com controle de pagamentos

- [x] Datas de lançamento

- [x] Aba de agendamento

- [x] Sistema de notificação para pacientes

- [x] Calendário da dentista

### 🔄 Dados de Demonstração

O sistema inclui dados de exemplo para demonstração:

- 3 pacientes cadastrados

- Transações financeiras de exemplo

- Agendamentos simulados

- 6 fotos na galeria

- Relatórios com dados realistas

## 🚀 Deploy e Hospedagem

O sistema está pronto para deploy em qualquer plataforma de hospedagem:

- **Vercel** (recomendado para React)

- **Netlify**

- **GitHub Pages**

- **Servidor próprio**

## 📞 Suporte e Manutenção

### Características Técnicas

- **Performance**: Otimizado para carregamento rápido

- **SEO**: Clezio Jucá

- **Acessibilidade**: Componentes acessíveis

- **Segurança**: Validação de dados no frontend

### Possíveis Melhorias Futuras

- Integração com banco de dados real

- Sistema de autenticação

- Backup automático

- Integração com WhatsApp/SMS

- Relatórios em PDF

- Sincronização com agenda Google

## 📋 Manual de Uso Rápido

1. **Dashboard**: Visão geral do consultório

1. **Cadastro**: Adicionar/editar pacientes

1. **Relatórios**: Visualizar estatísticas com filtros

1. **Financeiro**: Controlar receitas e despesas

1. **Agenda**: Gerenciar agendamentos e notificar pacientes

1. **Galeria**: Organizar fotos por categoria

---

**Sistema desenvolvido com foco na experiência do usuário e eficiência operacional do consultório odontológico.**

