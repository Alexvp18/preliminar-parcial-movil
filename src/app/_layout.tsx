import 'react-native-reanimated';
import '../global.css';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/presentation/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="registro" />
        <Stack.Screen name="home" />
        <Stack.Screen
          name="clickmovil"
          options={{ headerShown: true, title: 'Clickmóvil · Login', headerBackTitle: 'Panel' }}
        />
      </Stack>
    </AuthProvider>
  );
}
