import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { X, User, Bookmark, Calendar, Sparkles, Settings, LogOut } from 'lucide-react-native';
import { COLORS } from '../theme';
import { logoutAPI } from '../api';

export default function SideMenu({ isOpen, onClose, navigation, userName }) {
  
  const menuItems = [
    { icon: User, label: '내 정보', page: 'MyPage' },
    { icon: Bookmark, label: '북마크', page: 'Bookmark' },
    { icon: Calendar, label: '일정 캘린더', page: 'Calendar' },
    { icon: Sparkles, label: '추천 복지 사업', page: 'Recommendation' },
    { icon: Settings, label: '설정', page: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      await logoutAPI(); // 1. 서버에 로그아웃 요청
    } catch (e) {
      console.error('로그아웃 에러:', e);
    } finally {
      onClose();
      // 2. 로그인 화면으로 강제 이동 (스택 초기화)
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  const handleNavigate = (pageName) => {
    onClose();
    navigation.navigate(pageName);
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
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={28} color={COLORS.textDim} />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <User size={32} color="white" />
            </View>
            <View>
              <Text style={styles.userName}>{userName}님</Text>
              <Text style={styles.userMsg}>오늘도 건강하세요!</Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.menuItem} 
                onPress={() => handleNavigate(item.page)}
              >
                <View style={styles.iconBox}>
                  <item.icon size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
              <LogOut size={24} color={COLORS.error} />
            </View>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
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
});