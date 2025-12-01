// src/theme.js
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#ea580c',      // Orange-600
  primaryLight: '#fff7ed', // Orange-50
  secondary: '#fb923c',    // Orange-400
  background: '#ffffff',
  surface: '#f9fafb',      // Gray-50
  text: '#111827',         // Gray-900
  textDim: '#6b7280',      // Gray-500
  border: '#e5e7eb',
  white: '#ffffff',
  error: '#ef4444',
  success: '#16a34a',
  inputBg: '#f3f3f5',
};

export const COMMON_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textDim,
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});