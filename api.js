// Serviço de API para comunicação com o backend
const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  // Headers padrão para requisições
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Método genérico para fazer requisições
  async request(url, options = {}) {
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || `Erro HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // ===== AUTENTICAÇÃO =====
  
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async verifyToken() {
    return await this.request('/auth/verify-token');
  }

  async changePassword(currentPassword, newPassword) {
    return await this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  }

  // ===== PACIENTES =====
  
  async listarPacientes() {
    return await this.request('/pacientes');
  }

  async obterPaciente(cpf) {
    return await this.request(`/pacientes/${encodeURIComponent(cpf)}`);
  }

  async criarPaciente(pacienteData) {
    return await this.request('/pacientes', {
      method: 'POST',
      body: JSON.stringify(pacienteData),
    });
  }

  async atualizarPaciente(cpf, pacienteData) {
    return await this.request(`/pacientes/${encodeURIComponent(cpf)}`, {
      method: 'PUT',
      body: JSON.stringify(pacienteData),
    });
  }

  async excluirPaciente(cpf) {
    return await this.request(`/pacientes/${encodeURIComponent(cpf)}`, {
      method: 'DELETE',
    });
  }

  async buscarPacientes(termo) {
    return await this.request(`/pacientes/buscar?q=${encodeURIComponent(termo)}`);
  }

  // ===== ADMINISTRAÇÃO =====
  
  async criarBackup() {
    return await this.request('/auth/backup', {
      method: 'POST',
    });
  }

  async listarBackups() {
    return await this.request('/auth/backup/list');
  }

  async downloadBackup(filename) {
    const response = await fetch(`${API_BASE_URL}/auth/backup/download/${filename}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao fazer download do backup');
    }
    
    return response.blob();
  }

  async restaurarBackup(filename, limparAntes = false) {
    return await this.request('/auth/restore', {
      method: 'POST',
      body: JSON.stringify({
        filename,
        limpar_antes: limparAntes,
      }),
    });
  }

  async limparDados() {
    return await this.request('/auth/limpar-dados', {
      method: 'POST',
      body: JSON.stringify({
        confirmacao: 'LIMPAR_TUDO',
      }),
    });
  }

  async obterEstatisticas() {
    return await this.request('/auth/estatisticas');
  }

  // ===== UTILITÁRIOS =====
  
  isAuthenticated() {
    return !!this.token;
  }

  formatarCPF(cpf) {
    // Remove caracteres não numéricos
    const numeros = cpf.replace(/\D/g, '');
    
    // Aplica máscara
    if (numeros.length === 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return cpf;
  }

  validarCPF(cpf) {
    const numeros = cpf.replace(/\D/g, '');
    
    if (numeros.length !== 11) return false;
    if (numeros === numeros[0].repeat(11)) return false;
    
    return true;
  }
}

// Instância única do serviço
const apiService = new ApiService();

export default apiService;
