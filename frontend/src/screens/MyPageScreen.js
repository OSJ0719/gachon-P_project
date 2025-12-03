import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Phone, MapPin, Lock, Edit2 } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getUserProfileAPI } from '../api'; // API import

export default function MyPageScreen({ navigation, route }) {
  // 초기값은 로그인 시 받은 데이터지만, 최신 정보를 위해 state 관리
  const [userData, setUserData] = useState(route.params?.user || {});

  useEffect(() => {
    // 화면 진입 시 최신 내 정보 불러오기
    const fetchProfile = async () => {
      try {
        const res = await getUserProfileAPI();
        if (res.success) {
          setUserData(res.data);
        }
      } catch (e) {
        console.error('프로필 로드 실패:', e);
      }
    };
    fetchProfile();
  }, []);

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
          <View style={styles.avatar}><User size={40} color="white" /></View>
          <Text style={styles.name}>{userData.name || '이름 없음'}님</Text>
          <Text style={styles.id}>아이디: {userData.username || '-'}</Text>
          
          <TouchableOpacity 
            style={styles.editProfileBtn} 
            onPress={() => navigation.navigate('InitialSetup', { user: userData })}
          >
            <Edit2 size={16} color="white" />
            <Text style={{color:'white', fontWeight:'bold', marginLeft:4}}>설정 변경하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>기본 정보</Text>
          <View style={styles.row}>
            <Phone size={20} color={COLORS.textDim} />
            <Text style={styles.value}>{userData.phone || '전화번호 없음'}</Text>
          </View>
          <View style={styles.row}>
            <MapPin size={20} color={COLORS.textDim} />
            <Text style={styles.value}>
              {userData.region ? `${userData.region.city} ${userData.region.district}` : '지역 정보 없음'}
            </Text>
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
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  profileCard: { backgroundColor: 'white', padding: 30, borderRadius: 24, alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  id: { fontSize: 16, color: '#6b7280', marginTop: 4 },
  editProfileBtn: { marginTop: 16, flexDirection: 'row', backgroundColor: COLORS.secondary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#6b7280', marginBottom: 8, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 8 },
  value: { flex: 1, fontSize: 18, fontWeight: '500', marginLeft: 12, color: '#111827' },
  arrow: { fontSize: 20, color: '#9ca3af' },
});