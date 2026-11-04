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
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../presentation/context/AuthContext';

// ─────────────────────────────────────────────────────────────
//  LoginScreen — Clickmóvil
//  Paleta: Azul #0449C4 · Fondo #F8F9FA · Texto #1F2937
// ─────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const { login } = useAuth();

  // ── Estado del formulario ─────────────────
  const [correo, setCorreo]               = useState('');
  const [password, setPassword]           = useState('');
  const [correoError, setCorreoError]     = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading]             = useState(false);

  // ── Validación al pulsar Continuar ────────
  const handleContinuar = async () => {
    const correoVacio = correo.trim().length === 0;
    const passVacio   = password.trim().length === 0;

    setCorreoError(correoVacio);
    setPasswordError(passVacio);

    if (correoVacio || passVacio) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const exito = login(correo, password);
    setLoading(false);

    if (exito) {
      router.replace('/home');
    } else {
      setCorreoError(true);
      setPasswordError(true);
      Alert.alert(
        'Acceso denegado',
        'El correo o la contraseña son incorrectos.\n\nPuedes ingresar con: admin@edu.pe / admin123 o registrar una nueva cuenta.',
      );
    }
  };

  const handleGoogle    = () => Alert.alert('Próximamente', 'Inicio con Google no disponible aún.');
  const handleWhatsApp  = () => Alert.alert('Próximamente', 'Código por WhatsApp no disponible aún.');
  const handleRegistrar = () => router.push('/crear-cuenta');
  const handleOlvide    = () => Alert.alert('Próximamente', 'Recuperación de contraseña no disponible aún.');

  // ── Render ────────────────────────────────
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

          {/* ── Logo ─────────────────────────── */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* ── Encabezado ───────────────────── */}
          <Text style={styles.titulo}>Iniciar sesión</Text>
          <Text style={styles.subtitulo}>Ingresa a tu cuenta ClickMovil</Text>

          {/* ── Formulario ───────────────────── */}
          <View style={styles.form}>

            <CustomInput
              label="Correo o número de celular"
              placeholder="ejemplo@correo.com o 999 000 111"
              value={correo}
              onChangeText={(text) => {
                setCorreo(text);
                if (correoError) setCorreoError(false);
              }}
              hasError={correoError}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
            {correoError && (
              <Text style={styles.textoError}>Este campo es requerido</Text>
            )}

            {/* Contraseña + enlace "¿Olvidaste tu contraseña?" */}
            <View style={styles.labelRow}>
              <Text style={styles.labelForgot} />
              <TouchableOpacity onPress={handleOlvide} hitSlop={{ top: 8, bottom: 8 }}>
                <Text style={styles.linkOlvide}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            <CustomInput
              label="Contraseña"
              placeholder="••••••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError(false);
              }}
              hasError={passwordError}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleContinuar}
            />
            {passwordError && (
              <Text style={styles.textoError}>Este campo es requerido</Text>
            )}

          </View>

          {/* ── Botón principal ──────────────── */}
          <CustomButton
            title={loading ? 'Verificando...' : 'Continuar'}
            onPress={handleContinuar}
            loading={loading}
          />

          {/* ── Separador "O CONTINÚA CON" ───── */}
          <View style={styles.separadorRow}>
            <View style={styles.separadorLinea} />
            <Text style={styles.separadorTexto}>O CONTINÚA CON</Text>
            <View style={styles.separadorLinea} />
          </View>

          {/* ── Botones alternativos ─────────── */}
          <CustomButton
            title="Continuar con Google"
            onPress={handleGoogle}
            outline
          />
          <CustomButton
            title="Codigo por WhatsApp"
            onPress={handleWhatsApp}
            outline
          />

          {/* ── Pie: enlace a registro de usuario (Crear Cuenta) ── */}
          <View style={styles.pie}>
            <Text style={styles.pieTexto}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={handleRegistrar} hitSlop={{ top: 8, bottom: 8 }}>
              <Text style={styles.pieLink}>Regístrate</Text>
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
    paddingTop: 20,
    paddingBottom: 60,
  },

  // ── Logo ───────────────────────────────────
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    height: 45,
    width: 120,
  },

  // ── Encabezado ─────────────────────────────
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 32,
  },

  // ── Formulario ─────────────────────────────
  form: {
    marginBottom: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -4,
    marginBottom: 6,
  },
  labelForgot: {
    flex: 1,
  },
  linkOlvide: {
    fontSize: 13,
    color: '#0449C4',
    fontWeight: '600',
  },
  textoError: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 2,
  },

  // ── Separador ──────────────────────────────
  separadorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separadorLinea: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separadorTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginHorizontal: 12,
  },

  // ── Pie de página ──────────────────────────
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
