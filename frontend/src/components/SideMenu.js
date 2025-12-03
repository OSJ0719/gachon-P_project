import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native';
import { X, User, Bookmark, Calendar, Sparkles, Settings, LogOut, Lock, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { COLORS } from '../theme';
import { logoutAPI } from '../api';

export default function SideMenu({ isOpen, onClose, navigation, userName }) {
  const [showAuthModal, setShowAuthModal] = useState(false); // 비밀번호 확인 모달 상태
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const menuItems = [
    { icon: User, label: '내 정보', page: 'MyPage', requireAuth: true }, // 인증 필요 표시
    { icon: Bookmark, label: '북마크', page: 'Bookmark' },
    { icon: Calendar, label: '일정 캘린더', page: 'Calendar' },
    { icon: Sparkles, label: '추천 복지 사업', page: 'Recommendation' },
    { icon: Settings, label: '설정', page: 'Settings' },
  ];

  const handleLogout = async () => {
    try { await logoutAPI(); } catch (e) {}
    onClose();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleNavigate = (item) => {
    if (item.requireAuth) {
      // 내 정보 클릭 시 -> 사이드메뉴 닫지 말고 인증 모달 띄움
      setPasswordInput('');
      setAuthError('');
      setShowAuthModal(true);
    } else {
      onClose();
      navigation.navigate(item.page);
    }
  };

  const handleAuthConfirm = () => {
    // 테스트용 비밀번호 로직
    if (passwordInput.length > 0) { // 어떤 비밀번호든 입력하면 통과 (데모용)
      setShowAuthModal(false);
      onClose();
      navigation.navigate('MyPage');
    } else {
      setAuthError('비밀번호를 입력해주세요.');
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>

        <View style={styles.menuContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>메뉴</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}><X size={28} color={COLORS.textDim} /></TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.avatar}><User size={32} color="white" /></View>
            <View>
              <Text style={styles.userName}>{userName}님</Text>
              <Text style={styles.userMsg}>오늘도 건강하세요!</Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={() => handleNavigate(item)}>
                <View style={styles.iconBox}><item.icon size={24} color={COLORS.primary} /></View>
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}><LogOut size={24} color={COLORS.error} /></View>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 🔐 비밀번호 확인 모달 (중첩 모달) */}
        <Modal visible={showAuthModal} transparent animationType="slide">
          <View style={styles.authOverlay}>
            <View style={styles.authContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <Text style={styles.authTitle}>본인 확인</Text>
                <TouchableOpacity onPress={() => setShowAuthModal(false)}><X size={24} color={COLORS.textDim} /></TouchableOpacity>
              </View>
              <Text style={styles.authDesc}>개인정보 보호를 위해 비밀번호를 입력해주세요.</Text>
              
              <TextInput 
                style={[styles.authInput, authError ? { borderColor: COLORS.error } : {}]}
                placeholder="비밀번호"
                secureTextEntry
                value={passwordInput}
                onChangeText={setPasswordInput}
                autoFocus
              />
              {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

              <TouchableOpacity style={styles.authBtn} onPress={handleAuthConfirm}>
                <Text style={styles.authBtnText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row' },
  background: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuContainer: { width: '80%', maxWidth: 320, backgroundColor: 'white', height: '100%', padding: 24, borderTopRightRadius: 30, borderBottomRightRadius: 30, elevation: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  closeBtn: { padding: 4 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  userMsg: { fontSize: 14, color: '#6b7280' },
  menuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, padding: 8, borderRadius: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuText: { fontSize: 18, fontWeight: '500', color: '#1f2937' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', padding: 8, marginTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 20 },
  logoutText: { fontSize: 18, fontWeight: 'bold', color: '#ef4444' },
  
  // Auth Modal Styles
  authOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  authContent: { backgroundColor: 'white', borderRadius: 24, padding: 24 },
  authTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  authDesc: { fontSize: 16, color: '#6b7280', marginBottom: 20 },
  authInput: { backgroundColor: '#f9fafb', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, fontSize: 18, marginBottom: 10 },
  authBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  authBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: COLORS.error, marginBottom: 10, marginLeft: 4 },
});