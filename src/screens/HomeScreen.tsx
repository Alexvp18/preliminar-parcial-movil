import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../presentation/context/AuthContext';

// ─────────────────────────────────────────────────────────────
//  TypeScript Interfaces — Clickmóvil
// ─────────────────────────────────────────────────────────────
interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  imageUrl: string;
  iconName: keyof typeof Ionicons.glyphMap;
  cardBg: string;
}

interface Category {
  id: string;
  label: string;
}

// ─────────────────────────────────────────────────────────────
//  Datos de categorías
// ─────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: 'all',      label: 'Novedades'  },
  { id: 'apple',    label: 'Apple'      },
  { id: 'samsung',  label: 'Samsung'    },
  { id: 'xiaomi',   label: 'Xiaomi'     },
  { id: 'motorola', label: 'Motorola'   },
];

// ─────────────────────────────────────────────────────────────
//  Datos semilla de productos
// ─────────────────────────────────────────────────────────────
const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    brand: 'Apple',
    name: 'iPhone 18 Pro',
    price: 6820,
    imageUrl: '',
    iconName: 'phone-portrait-outline',
    cardBg: '#EEF2FF',
  },
  {
    id: '2',
    brand: 'Samsung',
    name: 'Galaxy S26 Ultra',
    price: 5999,
    imageUrl: '',
    iconName: 'phone-portrait-outline',
    cardBg: '#E0F2FE',
  },
  {
    id: '3',
    brand: 'Xiaomi',
    name: 'Xiaomi 15 Ultra',
    price: 3499,
    imageUrl: '',
    iconName: 'phone-portrait-outline',
    cardBg: '#FFF7ED',
  },
  {
    id: '4',
    brand: 'Infinix',
    name: 'Hot 70 Pro',
    price: 799,
    imageUrl: '',
    iconName: 'phone-portrait-outline',
    cardBg: '#F5F3FF',
  },
  {
    id: '5',
    brand: 'Motorola',
    name: 'Edge 60 Fusion',
    price: 1299,
    imageUrl: '',
    iconName: 'phone-portrait-outline',
    cardBg: '#ECFDF5',
  },
  {
    id: '6',
    brand: 'Apple',
    name: 'iPhone 18',
    price: 4999,
    imageUrl: '',
    iconName: 'phone-portrait-outline',
    cardBg: '#F1F5F9',
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

// ─────────────────────────────────────────────────────────────
//  Pantalla Principal — Clickmóvil Home
// ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { usuarioActual, logout } = useAuth();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  // ── Proteger pantalla: solo usuarios autenticados ─────────
  useEffect(() => {
    if (!usuarioActual) {
      router.replace('/login');
    }
  }, [usuarioActual]);

  // ── Cerrar sesión ─────────────────────────
  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // ── Navegar al CRUD de Solicitudes de forma segura ─────────
  const handleIrASolicitudes = () => {
    if (!usuarioActual) {
      Alert.alert(
        'Acceso restringido',
        'Debes iniciar sesión para acceder al panel de solicitudes.',
        [{ text: 'Iniciar sesión', onPress: () => router.replace('/login') }]
      );
      return;
    }
    router.push('/registro');
  };

  // ── Filtrado reactivo de productos ────────
  const productosFiltrados: Product[] = SEED_PRODUCTS.filter((p) => {
    const coincideCategoria =
      activeCategory === 'all' ||
      p.brand.toLowerCase() === activeCategory.toLowerCase();
    const coincideBusqueda =
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchText.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  // ── Tarjeta de producto ───────────────────
  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <TouchableOpacity
      style={[styles.card, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}
      activeOpacity={0.85}
      onPress={() => Alert.alert(item.name, `Precio: S/ ${item.price.toLocaleString()}`)}
    >
      {/* Icono del producto */}
      <View style={[styles.imageContainer, { backgroundColor: item.cardBg }]}>
        <Ionicons name={item.iconName} size={48} color="#0449C4" />
      </View>

      {/* Marca */}
      <Text style={styles.cardBrand}>{item.brand.toUpperCase()}</Text>

      {/* Nombre */}
      <Text style={styles.cardName} numberOfLines={2}>
        {item.name}
      </Text>

      {/* Precio + botón agregar */}
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>
          S/ {item.price.toLocaleString()}
        </Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => Alert.alert('Carrito', `${item.name} agregado al carrito.`)}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.container}>

        {/* ─── Header ─────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSaludo}>
              Hola, {usuarioActual?.nombre?.split(' ')[0] ?? 'Visitante'}
            </Text>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.headerLogoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerIconos}>
            {/* Busqueda */}
            <TouchableOpacity style={styles.iconoBtn} activeOpacity={0.7}>
              <Ionicons name="search-outline" size={22} color="#1F2937" />
            </TouchableOpacity>

            {/* Carrito con badge */}
            <TouchableOpacity style={styles.iconoBtn} activeOpacity={0.7}>
              <Ionicons name="cart-outline" size={22} color="#1F2937" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>

            {/* Avatar / Perfil */}
            <TouchableOpacity
              style={styles.iconoBtn}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  'Mi cuenta',
                  `Usuario: ${usuarioActual?.nombre ?? ''}\nSesión activa: ${usuarioActual?.email ?? ''}`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Cerrar sesión', style: 'destructive', onPress: handleLogout },
                  ],
                )
              }
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetra}>
                  {usuarioActual?.nombre?.[0]?.toUpperCase() ?? 'U'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Barra de búsqueda ───────────── */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por modelo o marca..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Banner de acceso rápido al CRUD de Solicitudes ───────────── */}
        <TouchableOpacity
          style={styles.crudBanner}
          onPress={handleIrASolicitudes}
          activeOpacity={0.85}
        >
          <View style={styles.crudBannerIcon}>
            <Ionicons name="file-tray-full-outline" size={24} color="#0449C4" />
          </View>
          <View style={styles.crudBannerTexts}>
            <Text style={styles.crudBannerTitle}>Gestión de Solicitudes (CRUD)</Text>
            <Text style={styles.crudBannerSubtitle}>Registrar y administrar pedidos de clientes</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#0449C4" />
        </TouchableOpacity>

        {/* ─── Pills de categorías ─────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsScroll}
          contentContainerStyle={styles.pillsContent}
        >
          {CATEGORIES.map((cat) => {
            const activo = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.pill, activo && styles.pillActivo]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillTexto, activo && styles.pillTextoActivo]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ─── Título de sección ───────────── */}
        <View style={styles.seccionHeader}>
          <Text style={styles.seccionTitulo}>
            {CATEGORIES.find((c) => c.id === activeCategory)?.label ?? 'Novedades'}
          </Text>
          <TouchableOpacity>
            <Text style={styles.seccionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Grid de productos ───────────── */}
        <FlatList<Product>
          data={productosFiltrados}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#9CA3AF" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTexto}>
                Sin resultados para "{searchText}"
              </Text>
            </View>
          }
        />

        {/* ─── Bottom Navigation ───────────── */}
        <View style={styles.bottomNav}>
          {[
            {
              icon: 'home-outline' as const,
              label: 'Inicio',
              activo: true,
              onPress: () => {},
            },
            {
              icon: 'document-text-outline' as const,
              label: 'Solicitudes',
              activo: false,
              onPress: handleIrASolicitudes,
            },
            {
              icon: 'flash-outline' as const,
              label: 'Cyber',
              activo: false,
              onPress: () => Alert.alert('Cyber Click', 'Próximamente ofertas exclusivas.'),
            },
            {
              icon: 'person-outline' as const,
              label: 'Cuenta',
              activo: false,
              onPress: () =>
                Alert.alert(
                  'Mi cuenta',
                  `Usuario: ${usuarioActual?.nombre ?? ''}\nSesión activa: ${usuarioActual?.email ?? ''}`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Cerrar sesión', style: 'destructive', onPress: handleLogout },
                  ],
                ),
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.navItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={item.activo ? '#0449C4' : '#9CA3AF'}
                style={{ marginBottom: 3 }}
              />
              <Text style={[styles.navLabel, item.activo && styles.navLabelActivo]}>
                {item.label}
              </Text>
              {item.activo && <View style={styles.navPunto} />}
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  Estilos — paleta Clickmóvil
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // ── Header ──────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#F8F9FA',
  },
  headerSaludo: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  headerLogoImage: {
    height: 38,
    width: 110,
  },
  headerIconos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconoBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0449C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0449C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetra: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Búsqueda ────────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    height: '100%',
  },

  // ── Banner CRUD Solicitudes ─────────────────
  crudBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    marginHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  crudBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  crudBannerTexts: {
    flex: 1,
  },
  crudBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0449C4',
  },
  crudBannerSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },

  // ── Pills ───────────────────────────────────
  pillsScroll: {
    marginBottom: 14,
    maxHeight: 44,
  },
  pillsContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  pillActivo: {
    backgroundColor: '#0449C4',
    borderColor: '#0449C4',
  },
  pillTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  pillTextoActivo: {
    color: '#FFFFFF',
  },

  // ── Sección ─────────────────────────────────
  seccionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  seccionLink: {
    fontSize: 13,
    color: '#0449C4',
    fontWeight: '600',
  },

  // ── Grid ────────────────────────────────────
  gridContent: {
    paddingHorizontal: 14,
    paddingBottom: 110,
  },

  // ── Card ────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    width: CARD_WIDTH,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  cardLeft: {
    marginRight: 6,
  },
  cardRight: {
    marginLeft: 6,
  },
  imageContainer: {
    height: 110,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
    lineHeight: 18,
    minHeight: 36,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0449C4',
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0449C4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Empty state ─────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTexto: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // ── Bottom Nav ──────────────────────────────
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    paddingHorizontal: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  navLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  navLabelActivo: {
    color: '#0449C4',
  },
  navPunto: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0449C4',
    marginTop: 3,
  },
});

