import json
from datetime import datetime
from src.models.user import db

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    
    # CPF como chave primária
    cpf = db.Column(db.String(14), primary_key=True)  # Formato: 000.000.000-00
    
    # Dados pessoais básicos
    nome = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True)
    telefone = db.Column(db.String(20))
    data_nascimento = db.Column(db.String(10))  # Formato: YYYY-MM-DD
    endereco = db.Column(db.Text)
    cidade = db.Column(db.String(100))
    cep = db.Column(db.String(10))
    convenio = db.Column(db.String(100))
    observacoes = db.Column(db.Text)
    status = db.Column(db.String(20), default='Ativo')
    data_cadastro = db.Column(db.String(10), default=lambda: datetime.now().strftime('%Y-%m-%d'))
    
    # Dados da anamnese (armazenados como JSON)
    anamnese = db.Column(db.Text)  # JSON string
    
    # Agendamentos (armazenados como JSON)
    agendamentos = db.Column(db.Text)  # JSON string
    
    def __repr__(self):
        return f'<Paciente {self.nome} - CPF: {self.cpf}>'
    
    def set_anamnese(self, anamnese_dict):
        """Converte dicionário de anamnese para JSON string"""
        self.anamnese = json.dumps(anamnese_dict, ensure_ascii=False)
    
    def get_anamnese(self):
        """Converte JSON string de anamnese para dicionário"""
        if self.anamnese:
            return json.loads(self.anamnese)
        return {}
    
    def set_agendamentos(self, agendamentos_list):
        """Converte lista de agendamentos para JSON string"""
        self.agendamentos = json.dumps(agendamentos_list, ensure_ascii=False)
    
    def get_agendamentos(self):
        """Converte JSON string de agendamentos para lista"""
        if self.agendamentos:
            return json.loads(self.agendamentos)
        return []
    
    def add_agendamento(self, agendamento_dict):
        """Adiciona um novo agendamento à lista existente"""
        agendamentos_atuais = self.get_agendamentos()
        agendamentos_atuais.append(agendamento_dict)
        self.set_agendamentos(agendamentos_atuais)
    
    def to_dict(self):
        """Converte o objeto Paciente para dicionário"""
        return {
            'cpf': self.cpf,
            'nome': self.nome,
            'email': self.email,
            'telefone': self.telefone,
            'dataNascimento': self.data_nascimento,
            'endereco': self.endereco,
            'cidade': self.cidade,
            'cep': self.cep,
            'convenio': self.convenio,
            'observacoes': self.observacoes,
            'status': self.status,
            'dataCadastro': self.data_cadastro,
            'anamnese': self.get_anamnese(),
            'agendamentos': self.get_agendamentos()
        }
    
    @staticmethod
    def from_dict(data):
        """Cria um objeto Paciente a partir de um dicionário"""
        paciente = Paciente()
        paciente.cpf = data.get('cpf')
        paciente.nome = data.get('nome')
        paciente.email = data.get('email')
        paciente.telefone = data.get('telefone')
        paciente.data_nascimento = data.get('dataNascimento')
        paciente.endereco = data.get('endereco')
        paciente.cidade = data.get('cidade')
        paciente.cep = data.get('cep')
        paciente.convenio = data.get('convenio')
        paciente.observacoes = data.get('observacoes')
        paciente.status = data.get('status', 'Ativo')
        paciente.data_cadastro = data.get('dataCadastro', datetime.now().strftime('%Y-%m-%d'))
        
        # Configurar anamnese se fornecida
        if 'anamnese' in data:
            paciente.set_anamnese(data['anamnese'])
        
        # Configurar agendamentos se fornecidos
        if 'agendamentos' in data:
            paciente.set_agendamentos(data['agendamentos'])
        
        return paciente
