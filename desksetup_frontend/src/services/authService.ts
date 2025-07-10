const API_BASE_URL = 'http://localhost:3000/api';

export interface LoginData {
  usuario: string;
  contraseña: string;
}

export interface RegisterData {
  usuario: string;
  correo_electronico: string;
  contraseña: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  rol: 'cliente' | 'administrador';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  cliente?: {
    _id: string;
    usuario: string;
    correo_electronico: string;
    nombre: string;
    apellido: string;
    rol: 'cliente' | 'administrador';
  };
}

class AuthService {
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }
      
      if (data.cliente) {
        localStorage.setItem('user', JSON.stringify(data.cliente));
        // Disparar evento para notificar cambios
        window.dispatchEvent(new Event('storage'));
      }
      
      return {
        success: true,
        message: 'Login exitoso',
        cliente: data.cliente
      };
    } catch (error) {
      throw error;
    }
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      // Validaciones del lado del cliente
      if (registerData.contraseña.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      
      if (!registerData.correo_electronico.includes('@')) {
        throw new Error('El correo electrónico debe ser válido');
      }
      
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }
      
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        // Disparar evento para notificar cambios
        window.dispatchEvent(new Event('storage'));
      }
      
      return {
        success: true,
        message: 'Registro exitoso',
        cliente: data
      };
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    // Disparar evento para notificar cambios
    window.dispatchEvent(new Event('storage'));
  }

  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    try {
      const userData = JSON.parse(user);
      return !!userData && !!userData._id;
    } catch {
      // Si hay error al parsear, limpiar localStorage
      localStorage.removeItem('user');
      return false;
    }
  }

  getUser(): any {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      // Si hay error al parsear, limpiar localStorage
      localStorage.removeItem('user');
      return null;
    }
  }

  // Método para verificar si un usuario ya existe
  async checkUserExists(usuario: string, correo_electronico: string): Promise<{ usuarioExists: boolean; emailExists: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/check-exists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, correo_electronico })
      });
      
      if (!response.ok) {
        throw new Error('Error al verificar usuario existente');
      }
      
      const data = await response.json();
      return { 
        usuarioExists: data.usuarioExists, 
        emailExists: data.emailExists 
      };
    } catch (error) {
      console.error('Error al verificar usuario existente:', error);
      return { usuarioExists: false, emailExists: false };
    }
  }
}

export const authService = new AuthService();