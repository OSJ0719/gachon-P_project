import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getSchedulesAPI, createScheduleAPI } from '../api';

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate()); // 기본값: 오늘 날짜(일)
  const [schedules, setSchedules] = useState([]);
  
  // 일정 추가 모달 및 입력 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1); // 1~30일 (예시)

  // 날짜 포맷팅 헬퍼 (예: 5 -> "2025-12-05")
  const getFormattedDate = (day) => `2025-12-${String(day).padStart(2, '0')}`;

  // 날짜 선택 시 API 호출
  const fetchSchedule = async (day) => {
    setSelectedDate(day);
    try {
      const dateStr = getFormattedDate(day);
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

  // 일정 추가 핸들러 (서버 통신)
  const handleAddSchedule = async () => {
    if(!newTitle || !newTime) {
      Alert.alert('알림', '시간과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const dateStr = getFormattedDate(selectedDate);
      
      // 서버에 저장 요청
      const res = await createScheduleAPI(dateStr, newTime, newTitle);
      
      if (res.success) {
        Alert.alert('성공', '일정이 추가되었습니다.');
        setShowAddModal(false);
        setNewTitle('');
        setNewTime('');
        fetchSchedule(selectedDate); // 목록 새로고침
      } else {
        Alert.alert('실패', res.message || '일정 추가에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정 캘린더</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Plus size={24} color={COLORS.primary} />
        </TouchableOpacity>
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
          <View style={styles.emptyBox}>
            <Text style={{ color: COLORS.textDim, fontSize: 16 }}>일정이 없습니다.</Text>
            <TouchableOpacity onPress={() => setShowAddModal(true)}>
              <Text style={{color:COLORS.primary, marginTop:8, fontWeight:'bold'}}>+ 일정 추가하기</Text>
            </TouchableOpacity>
          </View>
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

      {/* 일정 추가 모달 */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:20}}>
              <Text style={styles.modalTitle}>새 일정 추가</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}><X size={24} color={COLORS.textDim}/></TouchableOpacity>
            </View>
            
            <Text style={styles.label}>시간</Text>
            <TextInput 
              style={styles.input} 
              placeholder="예: 14:00" 
              value={newTime} 
              onChangeText={setNewTime} 
            />
            
            <Text style={styles.label}>내용</Text>
            <TextInput 
              style={styles.input} 
              placeholder="예: 병원 방문" 
              value={newTitle} 
              onChangeText={setNewTitle}
            />
            
            <TouchableOpacity style={styles.saveBtn} onPress={handleAddSchedule}>
              <Text style={styles.saveBtnText}>저장하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  
  emptyBox: { alignItems:'center', padding:20, backgroundColor:'white', borderRadius:12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: 'white', borderRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#374151' },
  input: { backgroundColor: '#f3f4f6', padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 16 },
  saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});