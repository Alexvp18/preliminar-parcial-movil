import React from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';

// ─────────────────────────────────────────────
//  Tipos de props
// ─────────────────────────────────────────────
interface CustomInputProps extends TextInputProps {
  /** Etiqueta mostrada encima del input (se convierte a mayúsculas internamente) */
  label: string;
  /** Texto de ayuda dentro del campo */
  placeholder?: string;
  /** Valor controlado del input */
  value: string;
  /** Callback que se llama cada vez que el usuario escribe */
  onChangeText: (text: string) => void;
  /** Muestra el borde en rojo y señala un error de validación */
  hasError?: boolean;
  /** Oculta el texto escrito (contraseñas) */
  secureTextEntry?: boolean;
}

// ─────────────────────────────────────────────
//  Componente
// ─────────────────────────────────────────────
export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  hasError = false,
  secureTextEntry = false,
  ...rest
}) => {
  return (
    <View style={styles.wrapper}>

      {/* Label en mayúsculas pequeñas y gris */}
      <Text style={styles.label}>{label.toUpperCase()}</Text>

      {/* Contenedor del input: borde rojo si hay error, gris sutil si no */}
      <View
        style={[
          styles.inputContainer,
          hasError && styles.inputContainerError,
          rest.multiline && styles.inputContainerMultiline,
        ]}
      >
        <TextInput
          style={[styles.input, rest.multiline && styles.inputMultiline]}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />

        {/* Espacio reservado a la derecha para un ícono futuro */}
        {!rest.multiline && <View style={styles.iconSlot} />}
      </View>

    </View>
  );
};

// ─────────────────────────────────────────────
//  Estilos — paleta Clickmóvil
//  Azul:       #0449C4
//  Fondo app:  #F8F9FA
//  Blanco:     #FFFFFF
//  Texto:      #1F2937
//  Placeholder:#9CA3AF
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',         // Borde gris sutil por defecto
    paddingHorizontal: 14,
    height: 52,
  },
  inputContainerError: {
    borderColor: '#EF4444',         // Rojo cuando hasError es true
    backgroundColor: '#FFF5F5',
  },
  inputContainerMultiline: {
    height: 84,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingRight: 8,                // Espacio para el ícono futuro
  },
  inputMultiline: {
    textAlignVertical: 'top',
    height: '100%',
  },
  iconSlot: {
    width: 24,                      // Reserva espacio para un ícono a la derecha
  },
});
