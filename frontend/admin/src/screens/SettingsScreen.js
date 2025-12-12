import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Calendar, Sparkles } from 'lucide-react-native';
import { COLORS } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { getSettingsAPI, updateSettingsAPI } from '../api';

export default function SettingsScreen({ navigation }) {
  const { fontSizeMode, setFontSizeMode } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifyPolicyChanges: true,
    notifyCalendarAlerts: true,
    notifyMarketing: false
  });

  // 서버에서 설정 불러오기
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettingsAPI();
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch (e) {
        console.error('설정 로드 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 설정 변경 핸들러
  const handleToggle = async (key) => {
    // 1. UI 먼저 변경
    const prevSettings = { ...settings };
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    try {
      // 2. 서버에 저장 요청
      const res = await updateSettingsAPI(newSettings);
      if (!res.success) {
        throw new Error(res.message);
      }
    } catch (e) {
      // 실패 시 원복 및 알림
      setSettings(prevSettings);
      Alert.alert('오류', '설정을 저장하지 못했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          
          <Text style={styles.sectionHeader}>알림 설정</Text>
          <View style={styles.card}>
            {/* 1. 정책 변경 알림 */}
            <View style={styles.row}>
              <View style={styles.iconLabel}>
                <Bell size={24} color={COLORS.primary} />
                <Text style={styles.label}>정책 변경 알림</Text>
              </View>
              <Switch 
                value={settings.notifyPolicyChanges} 
                onValueChange={() => handleToggle('notifyPolicyChanges')}
                trackColor={{ false: "#d1d5db", true: COLORS.secondary }}
                thumbColor={settings.notifyPolicyChanges ? COLORS.primary : "#f4f3f4"}
              />
            </View>

            <View style={styles.divider} />

            {/* 2. 일정 알림 */}
            <View style={styles.row}>
              <View style={styles.iconLabel}>
                <Calendar size={24} color={COLORS.primary} />
                <Text style={styles.label}>나의 일정 알림</Text>
              </View>
              <Switch 
                value={settings.notifyCalendarAlerts} 
                onValueChange={() => handleToggle('notifyCalendarAlerts')}
                trackColor={{ false: "#d1d5db", true: COLORS.secondary }}
                thumbColor={settings.notifyCalendarAlerts ? COLORS.primary : "#f4f3f4"}
              />
            </View>

            <View style={styles.divider} />

            {/* 3. 마케팅/혜택 알림 */}
            <View style={styles.row}>
              <View style={styles.iconLabel}>
                <Sparkles size={24} color={COLORS.primary} />
                <Text style={styles.label}>혜택/소식 알림</Text>
              </View>
              <Switch 
                value={settings.notifyMarketing} 
                onValueChange={() => handleToggle('notifyMarketing')}
                trackColor={{ false: "#d1d5db", true: COLORS.secondary }}
                thumbColor={settings.notifyMarketing ? COLORS.primary : "#f4f3f4"}
              />
            </View>
          </View>

          <Text style={styles.sectionHeader}>화면 설정</Text>
          <View style={styles.card}>
            <Text style={styles.subTitle}>글자 크기</Text>
            <View style={styles.sizeOptions}>
              {['small', 'medium', 'large'].map((mode) => (
                <TouchableOpacity 
                  key={mode}
                  style={[styles.sizeBtn, fontSizeMode === mode && styles.activeBtn]}
                  onPress={() => setFontSizeMode(mode)}
                >
                  <Text style={{
                    fontSize: mode === 'small' ? 14 : mode === 'medium' ? 18 : 22,
                    fontWeight: fontSizeMode === mode ? 'bold' : 'normal',
                    color: fontSizeMode === mode ? COLORS.primary : '#4b5563'
                  }}>
                    {mode === 'small' ? '작게' : mode === 'medium' ? '보통' : '크게'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.sectionHeader}>앱 정보</Text>
          <View style={styles.card}>
            <View style={styles.row}>
               <Text style={[styles.label, { marginLeft: 0 }]}>버전 정보</Text>
               <Text style={{color: '#6b7280', fontSize: 16}}>v1.0.0</Text>
            </View>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#6b7280', marginBottom: 10, marginLeft: 4, marginTop: 10 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 20, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  iconLabel: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 18, fontWeight: 'bold', marginLeft: 12, color: '#111827' },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  sizeOptions: { flexDirection: 'row', gap: 10 },
  sizeBtn: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 12, backgroundColor: '#f3f4f6' },
  activeBtn: { backgroundColor: '#fff7ed', borderWidth: 2, borderColor: COLORS.primary },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 8 },
});