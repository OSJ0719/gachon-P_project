import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { X, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { COLORS, COMMON_STYLES } from '../theme';

export default function FindAccountModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('id');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) { setTab('id'); setResult(null); setName(''); setPhone(''); }
  }, [isOpen]);

  const handleFind = () => {
    if (!name || !phone) {
      setResult({ type: 'fail', msg: '이름과 전화번호를 입력해주세요.' });
      return;
    }
    // Mock Logic
    if (tab === 'id') {
      setResult({ type: 'success', msg: `회원님의 아이디는\n[ park123 ] 입니다.` });
    } else {
      setResult({ type: 'success', msg: `임시 비밀번호를\n문자로 발송했습니다.` });
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>계정 찾기</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={COLORS.textDim} /></TouchableOpacity>
          </View>

          {/* 탭 버튼 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => { setTab('id'); setResult(null); }} style={[styles.tab, tab === 'id' && styles.tabActive]}>
              <Text style={[styles.tabText, tab === 'id' && styles.tabTextActive]}>아이디 찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setTab('pw'); setResult(null); }} style={[styles.tab, tab === 'pw' && styles.tabActive]}>
              <Text style={[styles.tabText, tab === 'pw' && styles.tabTextActive]}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>

          {!result ? (
            <View>
              <Text style={COMMON_STYLES.label}>이름</Text>
              <TextInput style={COMMON_STYLES.input} placeholder="홍길동" value={name} onChangeText={setName} />
              <Text style={COMMON_STYLES.label}>전화번호</Text>
              <TextInput style={COMMON_STYLES.input} placeholder="010-0000-0000" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
              
              <TouchableOpacity style={COMMON_STYLES.buttonPrimary} onPress={handleFind}>
                <Text style={COMMON_STYLES.buttonText}>{tab === 'id' ? '아이디 찾기' : '비밀번호 재설정'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <View style={[styles.resultIcon, result.type === 'success' ? {backgroundColor: '#dcfce7'} : {backgroundColor: '#fee2e2'}]}>
                {result.type === 'success' ? <CheckCircle2 size={28} color={COLORS.success} /> : <AlertCircle size={28} color={COLORS.error} />}
              </View>
              <Text style={styles.resultText}>{result.msg}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => setResult(null)}>
                <Text style={styles.retryText}>다시하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  content: { backgroundColor: 'white', borderRadius: 24, padding: 24, width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderRadius: 12, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  tabText: { fontSize: 16, color: '#6b7280', fontWeight: 'bold' },
  tabTextActive: { color: COLORS.primary },
  resultIcon: { padding: 10, borderRadius: 50, marginBottom: 15 },
  resultText: { fontSize: 18, textAlign: 'center', marginBottom: 20, lineHeight: 28 },
  retryButton: { width: '100%', padding: 15, backgroundColor: '#e5e7eb', borderRadius: 12, alignItems: 'center' },
  retryText: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
});