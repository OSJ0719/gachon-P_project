import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getSchedulesAPI } from '../api';

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate()); // 기본값: 오늘 날짜(일)
  const [schedules, setSchedules] = useState([]);
  
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1); // 1~30일 (예시)

  // 날짜 선택 시 API 호출
  const fetchSchedule = async (day) => {
    setSelectedDate(day);
    try {
      // 실제로는 '2025-12-05' 형태로 변환해서 보내야 합니다.
      const dateStr = `2025-12-${String(day).padStart(2, '0')}`;
      const res = await getSchedulesAPI(dateStr);
      
      if (res.success && Array.isArray(res.data)) {
        setSchedules(res.data);
      } else {
        setSchedules([]);
      }
    } catch (e) {
      console.error('일정 로드 실패:', e);
      setSchedules([]);
    }
  };

  // 처음 진입 시 오늘 날짜 일정 로드
  useEffect(() => {
    fetchSchedule(selectedDate);
  }, []);

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
            <TouchableOpacity 
              key={i} 
              style={[styles.dateBox, selectedDate === date && styles.selectedDateBox]}
              onPress={() => fetchSchedule(date)}
            >
              <Text style={[styles.dateText, selectedDate === date && { color: 'white' }]}>{date}</Text>
              {/* API 연동 시 점 표시는 월별 데이터가 필요하므로 일단 UI만 유지 */}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <ScrollView style={styles.scheduleList}>
        <Text style={styles.listTitle}>12월 {selectedDate}일 일정</Text>
        
        {schedules.length === 0 ? (
          <Text style={{ color: COLORS.textDim, fontSize: 16 }}>등록된 일정이 없습니다.</Text>
        ) : (
          schedules.map((item, idx) => (
            <View key={idx} style={styles.scheduleItem}>
              <Text style={styles.time}>{item.time}</Text>
              <View>
                <Text style={styles.desc}>{item.title}</Text>
                {item.location && <Text style={{fontSize:14, color:COLORS.textDim}}>{item.location}</Text>}
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
  dateBox: { width: '14.28%', height: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  selectedDateBox: { backgroundColor: COLORS.primary },
  dateText: { fontSize: 18, fontWeight: '500' },
  scheduleList: { padding: 20, flex: 1 },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  scheduleItem: { flexDirection: 'row', backgroundColor: 'white', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  time: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginRight: 16, width: 60 },
  desc: { fontSize: 18, fontWeight: '500' },
});