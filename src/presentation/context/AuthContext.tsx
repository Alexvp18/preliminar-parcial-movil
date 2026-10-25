import { Usuario } from '@/domain/entities/Usuario';
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

interface AuthContextValue {
  usuarios: Usuario[];
  usuarioActual: Usuario | null;
  registrarUsuario: (usuario: Omit<Usuario, 'id'>) => { ok: boolean; error?: string };
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Almacén en memoria a nivel de módulo (persiste entre cambios de vistas y remontajes de componentes)
const usuariosMemoria: Usuario[] = [
  {
    id: '1',
    nombre: 'Administrador',
    email: 'admin@edu.pe',
    password: 'admin123',
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  // Estado en memoria: los usuarios se mantienen durante la sesión de la app
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosMemoria);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  const registrarUsuario = (datos: Omit<Usuario, 'id'>): { ok: boolean; error?: string } => {
    const emailNormalizado = datos.email.trim().toLowerCase();

    // Validar si el usuario ya existe en memoria
    const existe = usuariosMemoria.some(
      (u) => u.email.trim().toLowerCase() === emailNormalizado
    );

    if (existe) {
      return { ok: false, error: 'Este correo electrónico ya se encuentra registrado.' };
    }

    const nuevoUsuario: Usuario = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      nombre: datos.nombre.trim(),
      email: emailNormalizado,
      password: datos.password.trim(),
    };

    usuariosMemoria.push(nuevoUsuario);
    setUsuarios([...usuariosMemoria]);
    return { ok: true };
  };

  const login = (email: string, password: string): boolean => {
    const emailNormalizado = email.trim().toLowerCase();
    const passNormalizado = password.trim();

    // Buscar en la lista de usuarios en memoria (incluye admin y registrados)
    const encontrado = usuariosMemoria.find(
      (u) =>
        u.email.trim().toLowerCase() === emailNormalizado &&
        (u.password === password || u.password.trim() === passNormalizado)
    );

    if (encontrado) {
      setUsuarioActual(encontrado);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUsuarioActual(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuarios,
        usuarioActual,
        registrarUsuario,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }
  return context;
}
