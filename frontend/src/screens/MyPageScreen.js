import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Phone, MapPin, Lock } from 'lucide-react-native';
import { COLORS } from '../theme';

export default function MyPageScreen({ navigation, route }) {
  // 로그인 화면에서 전달받은 user 정보 사용 (없을 경우 기본값 표시)
  const user = route.params?.user || { name: '사용자', username: '-', region: '-' };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 정보 관리</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={40} color="white" />
          </View>
          <Text style={styles.name}>{user.name || '이름 없음'}님</Text>
          <Text style={styles.id}>아이디: {user.username || user}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>기본 정보</Text>
          <View style={styles.row}>
            <Phone size={20} color={COLORS.textDim} />
            <Text style={styles.value}>010-1234-5678</Text>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>변경</Text></TouchableOpacity>
          </View>
          <View style={styles.row}>
            <MapPin size={20} color={COLORS.textDim} />
            <Text style={styles.value}>{user.region || '지역 미설정'}</Text>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>변경</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>보안</Text>
          <TouchableOpacity style={styles.row}>
            <Lock size={20} color={COLORS.textDim} />
            <Text style={styles.value}>비밀번호 변경</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  profileCard: { backgroundColor: 'white', padding: 30, borderRadius: 24, alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  id: { fontSize: 16, color: '#6b7280', marginTop: 4 },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#6b7280', marginBottom: 8, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 8 },
  value: { flex: 1, fontSize: 18, fontWeight: '500', marginLeft: 12, color: '#111827' },
  editBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { color: '#4b5563', fontWeight: 'bold' },
  arrow: { fontSize: 20, color: '#9ca3af' },
});