import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { COLORS } from '../theme';

export default function CalendarScreen({ navigation }) {
  // 간단한 달력 UI (그리드)
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  // 예시 데이터 (1일~30일)
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정 캘린더</Text>
        <TouchableOpacity style={styles.addBtn}><Plus size={24} color={COLORS.primary} /></TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.monthHeader}>
          <ChevronLeft size={24} color="#6b7280" />
          <Text style={styles.monthText}>2025년 12월</Text>
          <ChevronRight size={24} color="#6b7280" />
        </View>

        <View style={styles.grid}>
          {days.map((d, i) => (
            <Text key={i} style={[styles.dayLabel, i === 0 && { color: '#ef4444' }]}>{d}</Text>
          ))}
          {dates.map((date, i) => (
            <TouchableOpacity key={i} style={styles.dateBox}>
              <Text style={styles.dateText}>{date}</Text>
              {/* 예시: 5일과 12일에 일정 점 표시 */}
              {(date === 5 || date === 12) && <View style={styles.dot} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.scheduleList}>
        <Text style={styles.listTitle}>12월 5일 일정</Text>
        <View style={styles.scheduleItem}>
           <Text style={styles.time}>14:00</Text>
           <Text style={styles.desc}>병원 진료</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  addBtn: { padding: 4 },
  calendarContainer: { backgroundColor: 'white', margin: 16, borderRadius: 20, padding: 16, elevation: 2 },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  monthText: { fontSize: 20, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayLabel: { width: '14.28%', textAlign: 'center', marginBottom: 10, fontWeight: 'bold', color: '#6b7280' },
  dateBox: { width: '14.28%', height: 50, alignItems: 'center', justifyContent: 'flex-start' },
  dateText: { fontSize: 18, fontWeight: '500' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginTop: 4 },
  scheduleList: { padding: 20 },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  scheduleItem: { flexDirection: 'row', backgroundColor: 'white', padding: 16, borderRadius: 12, alignItems: 'center' },
  time: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginRight: 16 },
  desc: { fontSize: 18, fontWeight: '500' },
});