from flask import Blueprint, request, jsonify, current_app, send_file
from src.models.auth import Admin, db, create_default_admin
from src.models.paciente import Paciente
import os
import json
import shutil
from datetime import datetime
from functools import wraps

auth_bp = Blueprint('auth', __name__)

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

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de login para autenticação"""
    try:
        dados = request.get_json()
        
        if not dados:
            return jsonify({'erro': 'Dados não fornecidos'}), 400
        
        username = dados.get('username')
        password = dados.get('password')
        
        if not username or not password:
            return jsonify({'erro': 'Username e password são obrigatórios'}), 400
        
        # Busca o administrador
        admin = Admin.query.filter_by(username=username).first()
        
        if not admin or not admin.check_password(password):
            return jsonify({'erro': 'Credenciais inválidas'}), 401
        
        # Gera token JWT
        token = admin.generate_token(current_app.config['SECRET_KEY'])
        
        return jsonify({
            'token': token,
            'user': admin.to_dict(),
            'mensagem': 'Login realizado com sucesso'
        }), 200
    
    except Exception as e:
        return jsonify({'erro': f'Erro no login: {str(e)}'}), 500

@auth_bp.route('/verify-token', methods=['GET'])
@token_required
def verify_token():
    """Verifica se o token atual é válido"""
    return jsonify({
        'valido': True,
        'user': request.current_user,
        'mensagem': 'Token válido'
    }), 200

@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password():
    """Altera a senha do administrador"""
    try:
        dados = request.get_json()
        
        if not dados:
            return jsonify({'erro': 'Dados não fornecidos'}), 400
        
        current_password = dados.get('current_password')
        new_password = dados.get('new_password')
        
        if not current_password or not new_password:
            return jsonify({'erro': 'Senha atual e nova senha são obrigatórias'}), 400
        
        if len(new_password) < 6:
            return jsonify({'erro': 'Nova senha deve ter pelo menos 6 caracteres'}), 400
        
        # Busca o administrador atual
        admin = Admin.query.get(request.current_user['user_id'])
        
        if not admin or not admin.check_password(current_password):
            return jsonify({'erro': 'Senha atual incorreta'}), 401
        
        # Atualiza a senha
        admin.set_password(new_password)
        db.session.commit()
        
        return jsonify({'mensagem': 'Senha alterada com sucesso'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao alterar senha: {str(e)}'}), 500

@auth_bp.route('/backup', methods=['POST'])
@token_required
def criar_backup():
    """Cria um backup completo dos dados"""
    try:
        # Obtém todos os pacientes
        pacientes = Paciente.query.all()
        
        # Converte para dicionário
        dados_backup = {
            'timestamp': datetime.now().isoformat(),
            'total_pacientes': len(pacientes),
            'pacientes': [paciente.to_dict() for paciente in pacientes]
        }
        
        # Cria diretório de backup se não existir
        backup_dir = os.path.join(os.path.dirname(current_app.instance_path), 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        # Nome do arquivo de backup
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f'backup_consultorio_{timestamp}.json'
        backup_path = os.path.join(backup_dir, backup_filename)
        
        # Salva o backup
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(dados_backup, f, ensure_ascii=False, indent=2)
        
        return jsonify({
            'mensagem': 'Backup criado com sucesso',
            'arquivo': backup_filename,
            'total_pacientes': len(pacientes),
            'timestamp': dados_backup['timestamp']
        }), 200
    
    except Exception as e:
        return jsonify({'erro': f'Erro ao criar backup: {str(e)}'}), 500

@auth_bp.route('/backup/download/<filename>', methods=['GET'])
@token_required
def download_backup(filename):
    """Faz download de um arquivo de backup"""
    try:
        backup_dir = os.path.join(os.path.dirname(current_app.instance_path), 'backups')
        backup_path = os.path.join(backup_dir, filename)
        
        if not os.path.exists(backup_path):
            return jsonify({'erro': 'Arquivo de backup não encontrado'}), 404
        
        return send_file(backup_path, as_attachment=True, download_name=filename)
    
    except Exception as e:
        return jsonify({'erro': f'Erro ao fazer download do backup: {str(e)}'}), 500

@auth_bp.route('/backup/list', methods=['GET'])
@token_required
def listar_backups():
    """Lista todos os arquivos de backup disponíveis"""
    try:
        backup_dir = os.path.join(os.path.dirname(current_app.instance_path), 'backups')
        
        if not os.path.exists(backup_dir):
            return jsonify([]), 200
        
        backups = []
        for filename in os.listdir(backup_dir):
            if filename.endswith('.json') and filename.startswith('backup_consultorio_'):
                filepath = os.path.join(backup_dir, filename)
                stat = os.stat(filepath)
                
                backups.append({
                    'filename': filename,
                    'size': stat.st_size,
                    'created_at': datetime.fromtimestamp(stat.st_ctime).isoformat()
                })
        
        # Ordena por data de criação (mais recente primeiro)
        backups.sort(key=lambda x: x['created_at'], reverse=True)
        
        return jsonify(backups), 200
    
    except Exception as e:
        return jsonify({'erro': f'Erro ao listar backups: {str(e)}'}), 500

@auth_bp.route('/restore', methods=['POST'])
@token_required
def restaurar_backup():
    """Restaura dados de um arquivo de backup"""
    try:
        dados = request.get_json()
        
        if not dados or 'filename' not in dados:
            return jsonify({'erro': 'Nome do arquivo de backup é obrigatório'}), 400
        
        backup_dir = os.path.join(os.path.dirname(current_app.instance_path), 'backups')
        backup_path = os.path.join(backup_dir, dados['filename'])
        
        if not os.path.exists(backup_path):
            return jsonify({'erro': 'Arquivo de backup não encontrado'}), 404
        
        # Lê o arquivo de backup
        with open(backup_path, 'r', encoding='utf-8') as f:
            dados_backup = json.load(f)
        
        # Limpa dados existentes (se solicitado)
        if dados.get('limpar_antes', False):
            Paciente.query.delete()
        
        # Restaura pacientes
        pacientes_restaurados = 0
        for paciente_data in dados_backup.get('pacientes', []):
            # Verifica se já existe
            paciente_existente = Paciente.query.get(paciente_data['cpf'])
            if not paciente_existente:
                paciente = Paciente.from_dict(paciente_data)
                db.session.add(paciente)
                pacientes_restaurados += 1
        
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Backup restaurado com sucesso',
            'pacientes_restaurados': pacientes_restaurados,
            'timestamp_backup': dados_backup.get('timestamp')
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao restaurar backup: {str(e)}'}), 500

@auth_bp.route('/limpar-dados', methods=['POST'])
@token_required
def limpar_dados():
    """Limpa todos os dados do sistema (CUIDADO!)"""
    try:
        dados = request.get_json()
        
        # Verificação de segurança
        if not dados or dados.get('confirmacao') != 'LIMPAR_TUDO':
            return jsonify({'erro': 'Confirmação necessária. Envie {"confirmacao": "LIMPAR_TUDO"}'}), 400
        
        # Conta quantos registros serão removidos
        total_pacientes = Paciente.query.count()
        
        # Remove todos os pacientes
        Paciente.query.delete()
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Dados limpos com sucesso',
            'pacientes_removidos': total_pacientes
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao limpar dados: {str(e)}'}), 500

@auth_bp.route('/estatisticas', methods=['GET'])
@token_required
def estatisticas():
    """Retorna estatísticas gerais do sistema"""
    try:
        total_pacientes = Paciente.query.count()
        pacientes_ativos = Paciente.query.filter_by(status='Ativo').count()
        pacientes_inativos = Paciente.query.filter_by(status='Inativo').count()
        
        return jsonify({
            'total_pacientes': total_pacientes,
            'pacientes_ativos': pacientes_ativos,
            'pacientes_inativos': pacientes_inativos,
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({'erro': f'Erro ao obter estatísticas: {str(e)}'}), 500
