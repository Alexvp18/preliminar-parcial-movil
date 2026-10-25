import React, { useState } from 'react';
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
} from 'react-native';
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
  emoji: string;
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
    emoji: '📱',
    cardBg: '#EEF2FF',
  },
  {
    id: '2',
    brand: 'Samsung',
    name: 'Galaxy S26 Ultra',
    price: 5999,
    imageUrl: '',
    emoji: '📲',
    cardBg: '#E0F2FE',
  },
  {
    id: '3',
    brand: 'Xiaomi',
    name: 'Xiaomi 15 Ultra',
    price: 3499,
    imageUrl: '',
    emoji: '📡',
    cardBg: '#FFF7ED',
  },
  {
    id: '4',
    brand: 'Infinix',
    name: 'Hot 70 Pro',
    price: 799,
    imageUrl: '',
    emoji: '☎️',
    cardBg: '#F5F3FF',
  },
  {
    id: '5',
    brand: 'Motorola',
    name: 'Edge 60 Fusion',
    price: 1299,
    imageUrl: '',
    emoji: '🔵',
    cardBg: '#ECFDF5',
  },
  {
    id: '6',
    brand: 'Apple',
    name: 'iPhone 18',
    price: 4999,
    imageUrl: '',
    emoji: '⬛',
    cardBg: '#F1F5F9',
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2; // 20 + 20 padding + 12 gap / 2

// ─────────────────────────────────────────────────────────────
//  Pantalla Principal — Clickmóvil Home
// ─────────────────────────────────────────────────────────────
export default function HomeRoute() {
  const { usuarioActual, logout } = useAuth();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  // ── Cerrar sesión ─────────────────────────
  const handleLogout = () => {
    logout();
    router.replace('/login');
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
      {/* Imagen del producto */}
      <View style={[styles.imageContainer, { backgroundColor: item.cardBg }]}>
        <Text style={styles.imageEmoji}>{item.emoji}</Text>
      </View>

      {/* Marca en mayúsculas pequeñas y grises */}
      <Text style={styles.cardBrand}>{item.brand.toUpperCase()}</Text>

      {/* Nombre del modelo */}
      <Text style={styles.cardName} numberOfLines={2}>
        {item.name}
      </Text>

      {/* Precio + botón "+" */}
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>
          S/ {item.price.toLocaleString()}
        </Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => Alert.alert('Carrito', `${item.name} agregado 🛒`)}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // ── Render principal ──────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.container}>

        {/* ─── Header ─────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSaludo}>
              Hola, {usuarioActual?.nombre?.split(' ')[0] ?? 'Visitante'} 👋
            </Text>
            <Text style={styles.headerMarca}>ClickMovil</Text>
          </View>

          <View style={styles.headerIconos}>
            {/* Búsqueda */}
            <TouchableOpacity style={styles.iconoBtn}>
              <Text style={styles.iconoEmoji}>🔍</Text>
            </TouchableOpacity>

            {/* Carrito con badge "2" */}
            <TouchableOpacity style={styles.iconoBtn}>
              <Text style={styles.iconoEmoji}>🛒</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>

            {/* Avatar / Perfil → abre opción de cerrar sesión */}
            <TouchableOpacity
              style={styles.iconoBtn}
              onPress={() =>
                Alert.alert(
                  'Mi cuenta',
                  `Sesión activa: ${usuarioActual?.email ?? ''}`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Cerrar sesión', style: 'destructive', onPress: handleLogout },
                  ],
                )
              }
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetra}>
                  {usuarioActual?.nombre?.[0]?.toUpperCase() ?? '?'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Barra de búsqueda ───────────── */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcono}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por modelo o marca..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

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
              <Text style={styles.emptyEmoji}>🔎</Text>
              <Text style={styles.emptyTexto}>
                Sin resultados para "{searchText}"
              </Text>
            </View>
          }
        />

        {/* ─── Bottom Navigation ───────────── */}
        <View style={styles.bottomNav}>
          {[
            { icono: '🏠', label: 'Inicio', activo: true, onPress: () => {} },
            {
              icono: '📝',
              label: 'Solicitudes',
              activo: false,
              onPress: () => router.push('/registro'),
            },
            {
              icono: '⚡',
              label: 'Cyber',
              activo: false,
              onPress: () => Alert.alert('Cyber Click', 'Próximamente ofertas exclusivas.'),
            },
            {
              icono: '👤',
              label: 'Cuenta',
              activo: false,
              onPress: () =>
                Alert.alert(
                  'Mi cuenta',
                  `Sesión activa: ${usuarioActual?.email ?? ''}`,
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
              <Text style={styles.navIcono}>{item.icono}</Text>
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
    marginBottom: 1,
  },
  headerMarca: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0449C4',
    letterSpacing: 0.3,
  },
  headerIconos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconoBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconoEmoji: {
    fontSize: 22,
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
    marginBottom: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  searchIcono: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    height: '100%',
  },
  searchClear: {
    fontSize: 13,
    color: '#9CA3AF',
    paddingLeft: 8,
  },

  // ── Pills ───────────────────────────────────
  pillsScroll: {
    marginBottom: 16,
  },
  pillsContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
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
    paddingBottom: 110, // espacio para bottom nav y margen inferior cómodo
  },

  // ── Card ────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    width: CARD_WIDTH,
  },
  cardLeft: {
    marginRight: 6,
  },
  cardRight: {
    marginLeft: 6,
  },
  imageContainer: {
    height: 118,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imageEmoji: {
    fontSize: 58,
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
    marginBottom: 12,
    lineHeight: 20,
    minHeight: 40,
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
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 28,
    textAlign: 'center',
  },

  // ── Empty state ─────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 12,
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
  navIcono: {
    fontSize: 20,
    marginBottom: 3,
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
