import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../presentation/context/AuthContext';

// ─────────────────────────────────────────────────────────────
//  CrearCuentaScreen — Registro de nuevos usuarios de Clickmóvil
//  Paleta: Azul #0449C4 · Fondo #F8F9FA · Texto #1F2937
// ─────────────────────────────────────────────────────────────
export default function CrearCuentaScreen() {
  const { registrarUsuario } = useAuth();

  // ── Estado del formulario ─────────────────
  const [nombre, setNombre]       = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  // ── Estado de errores ─────────────────────
  const [nombreError, setNombreError]     = useState(false);
  const [emailError, setEmailError]       = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading]             = useState(false);

  // ── Manejar creación de cuenta ────────────
  const handleCrearCuenta = async () => {
    const nombreVacio   = nombre.trim().length === 0;
    const emailVacio    = email.trim().length === 0;
    const passwordVacio = password.trim().length === 0;

    setNombreError(nombreVacio);
    setEmailError(emailVacio);
    setPasswordError(passwordVacio);

    if (nombreVacio || emailVacio || passwordVacio) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos para crear tu cuenta.');
      return;
    }

    if (password.trim().length < 6) {
      setPasswordError(true);
      Alert.alert('Contraseña corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    // Simular un breve tiempo de respuesta
    await new Promise((resolve) => setTimeout(resolve, 600));

    const resultado = registrarUsuario({
      nombre: nombre.trim(),
      email: email.trim(),
      password: password.trim(),
    });

    setLoading(false);

    if (resultado.ok) {
      Alert.alert(
        'Cuenta creada',
        'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
        [
          {
            text: 'Iniciar sesión',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } else {
      Alert.alert('Error de registro', resultado.error ?? 'No fue posible crear la cuenta.');
    }
  };

  const handleVolver = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Botón Volver ─────────────────── */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={handleVolver}
              style={styles.backButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={20} color="#0449C4" />
            </TouchableOpacity>
          </View>

          {/* ── Header con Logo ──────────────── */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* ── Encabezado ───────────────────── */}
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>Regístrate para acceder a todos los servicios</Text>

          {/* ── Formulario ───────────────────── */}
          <View style={styles.form}>
            <CustomInput
              label="Nombre completo"
              placeholder="Ej. Alejandro Torres"
              value={nombre}
              onChangeText={(text) => {
                setNombre(text);
                if (nombreError) setNombreError(false);
              }}
              hasError={nombreError}
              autoCapitalize="words"
              returnKeyType="next"
            />
            {nombreError && (
              <Text style={styles.textoError}>El nombre completo es requerido</Text>
            )}

            <CustomInput
              label="Correo electrónico"
              placeholder="ejemplo@correo.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError(false);
              }}
              hasError={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
            {emailError && (
              <Text style={styles.textoError}>Ingresa un correo electrónico válido</Text>
            )}

            <CustomInput
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError(false);
              }}
              hasError={passwordError}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleCrearCuenta}
            />
            {passwordError && (
              <Text style={styles.textoError}>La contraseña debe tener mínimo 6 caracteres</Text>
            )}
          </View>

          {/* ── Botón Principal ──────────────── */}
          <CustomButton
            title={loading ? 'Creando cuenta...' : 'Crear cuenta'}
            onPress={handleCrearCuenta}
            loading={loading}
          />

          {/* ── Pie: enlace a Login ──────────── */}
          <View style={styles.pie}>
            <Text style={styles.pieTexto}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={handleVolver} hitSlop={{ top: 8, bottom: 8 }}>
              <Text style={styles.pieLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  Estilos
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 60,
  },
  topBar: {
    marginBottom: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  logoImage: {
    height: 45,
    width: 120,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 28,
  },
  form: {
    marginBottom: 8,
  },
  textoError: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 2,
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  pieTexto: {
    fontSize: 14,
    color: '#6B7280',
  },
  pieLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0449C4',
  },
});

