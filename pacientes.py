from flask import Blueprint, request, jsonify, current_app
from functools import wraps
from src.models.paciente import Paciente, db
from src.models.auth import Admin
import re

pacientes_bp = Blueprint('pacientes', __name__)

def token_required(f):
    """Decorator para verificar autenticação via token JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'erro': 'Token de acesso necessário'}), 401
        
        try:
            # Remove 'Bearer ' do início do token se presente
            if token.startswith('Bearer '):
                token = token[7:]
            
            payload = Admin.verify_token(token, current_app.config['SECRET_KEY'])
            if payload is None:
                return jsonify({'erro': 'Token inválido ou expirado'}), 401
            
            # Adiciona informações do usuário ao contexto da requisição
            request.current_user = payload
            
        except Exception as e:
            return jsonify({'erro': 'Token inválido'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

def validar_cpf(cpf):
    """Valida formato básico do CPF"""
    # Remove caracteres não numéricos
    cpf_numeros = re.sub(r'[^0-9]', '', cpf)
    
    # Verifica se tem 11 dígitos
    if len(cpf_numeros) != 11:
        return False
    
    # Verifica se não são todos os dígitos iguais
    if cpf_numeros == cpf_numeros[0] * 11:
        return False
    
    return True

def formatar_cpf(cpf):
    """Formata CPF no padrão 000.000.000-00"""
    cpf_numeros = re.sub(r'[^0-9]', '', cpf)
    if len(cpf_numeros) == 11:
        return f"{cpf_numeros[:3]}.{cpf_numeros[3:6]}.{cpf_numeros[6:9]}-{cpf_numeros[9:]}"
    return cpf

@pacientes_bp.route('/pacientes', methods=['GET'])
@token_required
def listar_pacientes():
    """Lista todos os pacientes"""
    try:
        pacientes = Paciente.query.all()
        return jsonify([paciente.to_dict() for paciente in pacientes]), 200
    except Exception as e:
        return jsonify({'erro': f'Erro ao listar pacientes: {str(e)}'}), 500

@pacientes_bp.route('/pacientes/<cpf>', methods=['GET'])
@token_required
def obter_paciente(cpf):
    """Obtém um paciente específico pelo CPF"""
    try:
        cpf_formatado = formatar_cpf(cpf)
        paciente = Paciente.query.get(cpf_formatado)
        
        if not paciente:
            return jsonify({'erro': 'Paciente não encontrado'}), 404
        
        return jsonify(paciente.to_dict()), 200
    except Exception as e:
        return jsonify({'erro': f'Erro ao obter paciente: {str(e)}'}), 500

@pacientes_bp.route('/pacientes', methods=['POST'])
@token_required
def criar_paciente():
    """Cria um novo paciente"""
    try:
        dados = request.get_json()
        
        if not dados:
            return jsonify({'erro': 'Dados não fornecidos'}), 400
        
        # Validações obrigatórias
        if not dados.get('cpf'):
            return jsonify({'erro': 'CPF é obrigatório'}), 400
        
        if not dados.get('nome'):
            return jsonify({'erro': 'Nome é obrigatório'}), 400
        
        # Valida CPF
        cpf = dados['cpf']
        if not validar_cpf(cpf):
            return jsonify({'erro': 'CPF inválido'}), 400
        
        cpf_formatado = formatar_cpf(cpf)
        
        # Verifica se já existe paciente com este CPF
        paciente_existente = Paciente.query.get(cpf_formatado)
        if paciente_existente:
            return jsonify({'erro': 'Já existe um paciente com este CPF'}), 409
        
        # Cria novo paciente
        dados['cpf'] = cpf_formatado
        paciente = Paciente.from_dict(dados)
        
        db.session.add(paciente)
        db.session.commit()
        
        return jsonify(paciente.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao criar paciente: {str(e)}'}), 500

@pacientes_bp.route('/pacientes/<cpf>', methods=['PUT'])
@token_required
def atualizar_paciente(cpf):
    """Atualiza um paciente existente"""
    try:
        cpf_formatado = formatar_cpf(cpf)
        paciente = Paciente.query.get(cpf_formatado)
        
        if not paciente:
            return jsonify({'erro': 'Paciente não encontrado'}), 404
        
        dados = request.get_json()
        if not dados:
            return jsonify({'erro': 'Dados não fornecidos'}), 400
        
        # Atualiza campos básicos
        if 'nome' in dados:
            paciente.nome = dados['nome']
        if 'email' in dados:
            paciente.email = dados['email']
        if 'telefone' in dados:
            paciente.telefone = dados['telefone']
        if 'dataNascimento' in dados:
            paciente.data_nascimento = dados['dataNascimento']
        if 'endereco' in dados:
            paciente.endereco = dados['endereco']
        if 'cidade' in dados:
            paciente.cidade = dados['cidade']
        if 'cep' in dados:
            paciente.cep = dados['cep']
        if 'convenio' in dados:
            paciente.convenio = dados['convenio']
        if 'observacoes' in dados:
            paciente.observacoes = dados['observacoes']
        if 'status' in dados:
            paciente.status = dados['status']
        
        # Atualiza anamnese se fornecida
        if 'anamnese' in dados:
            paciente.set_anamnese(dados['anamnese'])
        
        # Atualiza agendamentos se fornecidos
        if 'agendamentos' in dados:
            paciente.set_agendamentos(dados['agendamentos'])
        
        db.session.commit()
        
        return jsonify(paciente.to_dict()), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao atualizar paciente: {str(e)}'}), 500

@pacientes_bp.route('/pacientes/<cpf>', methods=['DELETE'])
@token_required
def excluir_paciente(cpf):
    """Exclui um paciente"""
    try:
        cpf_formatado = formatar_cpf(cpf)
        paciente = Paciente.query.get(cpf_formatado)
        
        if not paciente:
            return jsonify({'erro': 'Paciente não encontrado'}), 404
        
        db.session.delete(paciente)
        db.session.commit()
        
        return jsonify({'mensagem': 'Paciente excluído com sucesso'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao excluir paciente: {str(e)}'}), 500

@pacientes_bp.route('/pacientes/buscar', methods=['GET'])
@token_required
def buscar_pacientes():
    """Busca pacientes por nome, email ou telefone"""
    try:
        termo = request.args.get('q', '').strip()
        
        if not termo:
            return jsonify([]), 200
        
        # Busca por nome, email ou telefone
        pacientes = Paciente.query.filter(
            db.or_(
                Paciente.nome.ilike(f'%{termo}%'),
                Paciente.email.ilike(f'%{termo}%'),
                Paciente.telefone.ilike(f'%{termo}%')
            )
        ).all()
        
        return jsonify([paciente.to_dict() for paciente in pacientes]), 200
    
    except Exception as e:
        return jsonify({'erro': f'Erro ao buscar pacientes: {str(e)}'}), 500
