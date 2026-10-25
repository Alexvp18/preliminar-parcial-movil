import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';

// ─────────────────────────────────────────────
//  Tipos de props
// ─────────────────────────────────────────────
interface CustomButtonProps extends TouchableOpacityProps {
  /** Texto mostrado en el botón */
  title: string;
  /** Callback al presionar el botón */
  onPress: () => void;
  /**
   * Modo outline:
   *  - true  → fondo transparente, borde y texto en azul #0449C4
   *  - false → fondo azul #0449C4, texto blanco (por defecto)
   */
  outline?: boolean;
  /** Muestra un spinner y deshabilita el botón mientras carga */
  loading?: boolean;
}

// ─────────────────────────────────────────────
//  Componente
// ─────────────────────────────────────────────
export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  outline = false,
  loading = false,
  disabled,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      style={[
        styles.button,
        outline ? styles.buttonOutline : styles.buttonFilled,
        isDisabled && styles.buttonDisabled,
      ]}
      {...rest}
    >
      {loading ? (
        /* Spinner mientras se procesa la acción */
        <ActivityIndicator
          color={outline ? '#0449C4' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            outline ? styles.labelOutline : styles.labelFilled,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────
//  Estilos — paleta Clickmóvil
//  Azul principal: #0449C4
//  Texto claro:    #FFFFFF
//  Deshabilitado:  opacidad reducida
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    minHeight: 52,
  },

  // ── Variante sólida (por defecto) ──────────
  buttonFilled: {
    backgroundColor: '#0449C4',
    borderWidth: 0,
  },

  // ── Variante outline ───────────────────────
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#0449C4',
  },

  // ── Estado deshabilitado ───────────────────
  buttonDisabled: {
    opacity: 0.5,
  },

  // ── Textos ────────────────────────────────
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  labelFilled: {
    color: '#FFFFFF',
  },
  labelOutline: {
    color: '#0449C4',
  },
});
