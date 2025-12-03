import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { COLORS } from '../theme';

export default function SettingsScreen({ navigation }) {
  const [alarm, setAlarm] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <View style={{ padding: 20 }}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Bell size={24} color={COLORS.primary} />
              <Text style={styles.label}>알림 받기</Text>
            </View>
            <Switch 
              value={alarm} 
              onValueChange={setAlarm}
              trackColor={{ false: "#767577", true: COLORS.secondary }}
              thumbColor={alarm ? COLORS.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>글자 크기</Text>
          <View style={styles.sizeOptions}>
            <TouchableOpacity style={styles.sizeBtn}><Text style={{fontSize: 14}}>작게</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.sizeBtn, styles.activeBtn]}><Text style={{fontSize: 18, fontWeight: 'bold', color: COLORS.primary}}>보통</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sizeBtn}><Text style={{fontSize: 22}}>크게</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
             <Text style={styles.label}>버전 정보</Text>
             <Text style={{color: '#6b7280'}}>v1.0.0</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 20, fontWeight: 'bold', marginLeft: 12, color: '#111827' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  sizeOptions: { flexDirection: 'row', gap: 10 },
  sizeBtn: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 12, backgroundColor: '#f3f4f6' },
  activeBtn: { backgroundColor: '#fff7ed', borderWidth: 2, borderColor: COLORS.primary },
});