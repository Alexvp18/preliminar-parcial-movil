import React, { useState, useEffect } from 'react';
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
//  Interfaz TypeScript estricta — Requerimiento de la rúbrica
// ─────────────────────────────────────────────────────────────
export interface FormRequest {
  id: string;
  nombre: string;
  telefono: string;
  tipo: string;
  descripcion: string;
}

// ─────────────────────────────────────────────────────────────
//  Datos semilla iniciales en memoria (simula Read inmediato)
// ─────────────────────────────────────────────────────────────
const INITIAL_SOLICITUDES: FormRequest[] = [
  {
    id: '1',
    nombre: 'Carlos Mendoza',
    telefono: '987 654 321',
    tipo: 'Compra',
    descripcion: 'Cotización por iPhone 18 Pro 256GB en color titanio.',
  },
  {
    id: '2',
    nombre: 'Lucía Fernández',
    telefono: '912 345 678',
    tipo: 'Reparación',
    descripcion: 'Cambio de pantalla para Samsung Galaxy S26 Ultra.',
  },
];

// Tipos sugeridos como ayuda visual
const TIPOS_SUGERIDOS = ['Compra', 'Reparación', 'Cotización', 'Garantía'];

// ─────────────────────────────────────────────────────────────
//  Pantalla: Registro de Solicitudes (CRUD en memoria)
// ─────────────────────────────────────────────────────────────
export default function RegistroScreen() {
  const { usuarioActual } = useAuth();

  // ── Proteger pantalla CRUD: solo accesible tras login ──────
  useEffect(() => {
    if (!usuarioActual) {
      Alert.alert(
        'Acceso restringido',
        'Debes iniciar sesión para acceder al registro de solicitudes.',
        [{ text: 'Iniciar sesión', onPress: () => router.replace('/login') }]
      );
    }
  }, [usuarioActual]);

  // ── Estado del formulario actual ──────────
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    tipo: '',
    descripcion: '',
  });

  // ── Estado de errores de validación ───────
  const [errors, setErrors] = useState({
    nombre: false,
    telefono: false,
    tipo: false,
  });

  // ── Estado en memoria: Lista de solicitudes (CRUD) ───
  const [solicitudes, setSolicitudes] = useState<FormRequest[]>(INITIAL_SOLICITUDES);

  // ── Manejador para campos del formulario ──
  const handleInputChange = (field: 'nombre' | 'telefono' | 'tipo' | 'descripcion', value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Si el campo tenía error, se desactiva al escribir
    if (field in errors && errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // ── Selección rápida de tipo ──────────────
  const handleSelectTipo = (tipo: string) => {
    setForm((prev) => ({ ...prev, tipo }));
    if (errors.tipo) {
      setErrors((prev) => ({ ...prev, tipo: false }));
    }
  };

  // ── Guardar Solicitud (Create) ────────────
  const handleGuardarSolicitud = () => {
    const nombreInvalido = form.nombre.trim().length === 0;
    const telefonoInvalido = form.telefono.trim().length === 0;
    const tipoInvalido = form.tipo.trim().length === 0;

    // Activar estado de error en los inputs vacíos
    setErrors({
      nombre: nombreInvalido,
      telefono: telefonoInvalido,
      tipo: tipoInvalido,
    });

    if (nombreInvalido || telefonoInvalido || tipoInvalido) {
      Alert.alert(
        'Campos requeridos',
        'Por favor completa Nombre del cliente, Teléfono y Tipo de solicitud para continuar.',
      );
      return;
    }

    // Crear nueva solicitud con ID único
    const nuevaSolicitud: FormRequest = {
      id: Date.now().toString(),
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      tipo: form.tipo.trim(),
      descripcion: form.descripcion.trim(),
    };

    // Guardar en arreglo temporal en memoria (al inicio)
    setSolicitudes((prev) => [nuevaSolicitud, ...prev]);

    // Limpiar formulario y resetear errores
    setForm({
      nombre: '',
      telefono: '',
      tipo: '',
      descripcion: '',
    });
    setErrors({
      nombre: false,
      telefono: false,
      tipo: false,
    });

    // Mensaje de éxito
    Alert.alert(
      '¡Solicitud Guardada!',
      `Se registró con éxito la solicitud de "${nuevaSolicitud.nombre}" en memoria.`,
    );
  };

  // ── Eliminar Solicitud (Delete) ───────────
  const handleEliminarSolicitud = (id: string, nombre: string) => {
    Alert.alert(
      'Eliminar solicitud',
      `¿Estás seguro de que deseas eliminar la solicitud de "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setSolicitudes((prev) => prev.filter((item) => item.id !== id));
            Alert.alert('Registro eliminado', 'La solicitud fue retirada de la memoria.');
          },
        },
      ],
    );
  };

  // ── Volver atrás ──────────────────────────
  const handleVolver = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Encabezado de la pantalla ────── */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleVolver}
              style={styles.backButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={20} color="#0449C4" />
            </TouchableOpacity>

            <View style={styles.headerTitles}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <Text style={styles.headerTitle}>Registro de Solicitudes</Text>
              <Text style={styles.headerSubtitle}>Gestion de clientes y servicios (CRUD)</Text>
            </View>

            <View style={styles.badgeCounter}>
              <Text style={styles.badgeCounterText}>{solicitudes.length}</Text>
            </View>
          </View>

          {/* ─── Formulario de Registro ───────── */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View style={styles.formHeaderIcon}>
                <Ionicons name="create-outline" size={20} color="#0449C4" />
              </View>
              <View>
                <Text style={styles.formHeaderTitle}>Nueva Solicitud</Text>
                <Text style={styles.formHeaderSubtitle}>Ingresa los datos para registrar en memoria</Text>
              </View>
            </View>

            {/* Input 1: Nombre del cliente (Obligatorio) */}
            <CustomInput
              label="Nombre del cliente *"
              placeholder="Ej. Alejandro Torres"
              value={form.nombre}
              onChangeText={(text) => handleInputChange('nombre', text)}
              hasError={errors.nombre}
              returnKeyType="next"
            />
            {errors.nombre && (
              <Text style={styles.errorText}>* El nombre del cliente es obligatorio</Text>
            )}

            {/* Input 2: Teléfono (Obligatorio) */}
            <CustomInput
              label="Teléfono *"
              placeholder="Ej. 999 000 111"
              value={form.telefono}
              onChangeText={(text) => handleInputChange('telefono', text)}
              hasError={errors.telefono}
              keyboardType="phone-pad"
              returnKeyType="next"
            />
            {errors.telefono && (
              <Text style={styles.errorText}>* El número de teléfono es obligatorio</Text>
            )}

            {/* Input 3: Tipo de solicitud (Obligatorio) */}
            <CustomInput
              label="Tipo de solicitud *"
              placeholder="Ej. Compra, Reparación, Cotización..."
              value={form.tipo}
              onChangeText={(text) => handleInputChange('tipo', text)}
              hasError={errors.tipo}
              returnKeyType="next"
            />
            {errors.tipo && (
              <Text style={styles.errorText}>* El tipo de solicitud es obligatorio</Text>
            )}

            {/* Sugerencias rápidas para el tipo */}
            <View style={styles.chipsContainer}>
              <Text style={styles.chipsLabel}>Sugerencias rápidas:</Text>
              <View style={styles.chipsRow}>
                {TIPOS_SUGERIDOS.map((t) => {
                  const isSelected = form.tipo.trim().toLowerCase() === t.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => handleSelectTipo(t)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Input 4: Descripción (Opcional) */}
            <CustomInput
              label="Descripción"
              placeholder="Detalles de la consulta, modelo o falla..."
              value={form.descripcion}
              onChangeText={(text) => handleInputChange('descripcion', text)}
              multiline
              numberOfLines={3}
            />

            {/* Botón principal: Guardar Solicitud */}
            <View style={styles.submitButtonContainer}>
              <CustomButton
                title="Guardar Solicitud"
                onPress={handleGuardarSolicitud}
              />
            </View>
          </View>

          {/* ─── Sección: Lista de Solicitudes (Read del CRUD) ─── */}
          <View style={styles.listSectionHeader}>
            <View>
              <Text style={styles.listSectionTitle}>Solicitudes Registradas</Text>
              <Text style={styles.listSectionSubtitle}>
                {solicitudes.length === 1
                  ? '1 registro activo en memoria'
                  : `${solicitudes.length} registros activos en memoria`}
              </Text>
            </View>
            <View style={styles.pillCount}>
              <Text style={styles.pillCountText}>{solicitudes.length}</Text>
            </View>
          </View>

          {/* Renderizado de la lista */}
          {solicitudes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard-outline" size={44} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Sin solicitudes aun</Text>
              <Text style={styles.emptySubtitle}>
                Completa el formulario de arriba y presiona "Guardar Solicitud".
              </Text>
            </View>
          ) : (
            solicitudes.map((item) => (
              <View key={item.id} style={styles.card}>
                {/* Cabecera de la tarjeta: Nombre + Badge Tipo */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleContainer}>
                    <View style={styles.clientAvatar}>
                      <Text style={styles.clientAvatarText}>
                        {item.nombre.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.clientInfo}>
                      <Text style={styles.cardClientName} numberOfLines={1}>
                        {item.nombre}
                      </Text>
                      <Text style={styles.cardPhone}>{item.telefono}</Text>
                    </View>
                  </View>

                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{item.tipo.toUpperCase()}</Text>
                  </View>
                </View>

                {/* Descripción (si se ingresó) */}
                {item.descripcion.length > 0 && (
                  <View style={styles.cardDescriptionContainer}>
                    <Text style={styles.cardDescriptionText}>{item.descripcion}</Text>
                  </View>
                )}

                {/* Footer de la tarjeta: ID/Fecha y Botón Eliminar (Delete) */}
                <View style={styles.cardFooter}>
                  <Text style={styles.cardIdText}>ID: #{item.id.slice(-5)}</Text>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleEliminarSolicitud(item.id, item.nombre)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={14} color="#EF4444" style={{ marginRight: 4 }} />
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Espaciador inferior */}
          <View style={styles.footerSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  Estilos — Sistema de Diseño Clickmóvil
//  Azul:       #0449C4
//  Fondo:      #F8F9FA
//  Blanco:     #FFFFFF
//  Oscuro:     #1F2937
//  Gris:       #9CA3AF / #6B7280 / #E5E7EB
//  Rojo:       #EF4444
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 60,
  },

  // ── Encabezado ─────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 4,
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
    marginRight: 14,
  },
  backArrow: {
    fontSize: 20,
    color: '#0449C4',
    fontWeight: '700',
  },
  headerTitles: {
    flex: 1,
  },
  headerLogo: {
    height: 22,
    width: 80,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  badgeCounter: {
    backgroundColor: '#0449C4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeCounterText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },

  // ── Tarjeta del Formulario ──────────────────
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  formHeaderIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  formHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  formHeaderSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: -10,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: '500',
  },

  // ── Chips de tipo sugerido ─────────────────
  chipsContainer: {
    marginBottom: 16,
    marginTop: -4,
  },
  chipsLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 6,
    marginLeft: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: '#0449C4',
    borderColor: '#0449C4',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  submitButtonContainer: {
    marginTop: 6,
  },

  // ── Encabezado de la Lista ─────────────────
  listSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  listSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
  },
  listSectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  pillCount: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  pillCountText: {
    color: '#0449C4',
    fontWeight: '700',
    fontSize: 12,
  },

  // ── Tarjeta de Solicitud (Lista Read) ──────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  clientAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0449C4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  clientAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  clientInfo: {
    flex: 1,
  },
  cardClientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  cardPhone: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardBadge: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardBadgeText: {
    color: '#0449C4',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardDescriptionContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0449C4',
  },
  cardDescriptionText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cardIdText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Estado vacío ───────────────────────────
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  footerSpacing: {
    height: 30,
  },
});
