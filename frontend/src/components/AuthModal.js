import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2, AlertCircle } from 'lucide-react-native';
import { COLORS } from '../theme';

export default function AuthModal({ isOpen, type, message, onConfirm }) {
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={[styles.iconCircle, type === 'success' ? styles.bgSuccess : styles.bgError]}>
            {type === 'success' ? 
              <CheckCircle2 size={32} color={COLORS.success} /> : 
              <AlertCircle size={32} color={COLORS.error} />
            }
          </View>
          <Text style={styles.title}>{type === 'success' ? '성공' : '실패'}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity 
            style={[styles.button, type === 'success' ? {backgroundColor: COLORS.success} : {backgroundColor: '#374151'}]}
            onPress={onConfirm}
          >
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { backgroundColor: 'white', borderRadius: 24, padding: 24, width: '100%', maxWidth: 320, alignItems: 'center' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  bgSuccess: { backgroundColor: '#dcfce7' },
  bgError: { backgroundColor: '#fee2e2' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  message: { fontSize: 18, color: '#4b5563', textAlign: 'center', marginBottom: 24 },
  button: { width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});