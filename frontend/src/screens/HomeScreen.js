import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Menu, Bell, Search, Sun, MapPin, ChevronRight, Home, Calendar, Bot, LogOut } from 'lucide-react-native';
import { COLORS } from '../theme'; // 테마 파일 활용

export default function HomeScreen({ navigation, route }) {
  // 로그인 화면에서 넘겨준 사용자 이름 (없으면 '어르신' 기본값)
  const userName = route.params?.user?.name || '박성민';

  const handleLogout = () => {
    // 로그아웃 시 로그인 화면으로 이동 (뒤로가기 방지)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* 1. 상단 헤더 (오렌지 그라데이션 대신 단색 적용) */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => alert('메뉴 열기 (준비중)')}>
            <Menu size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI 든든 비서</Text>
          <TouchableOpacity onPress={handleLogout}>
            <LogOut size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* 검색창 */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={24} color={COLORS.primary} />
            <Text style={styles.searchText}>복지 서비스 검색하기</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 2. 날씨 카드 */}
        <View style={styles.card}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
            <View>
              <Text style={styles.dateText}>2025년 12월 1일</Text>
              <Text style={styles.dayText}>월요일</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.tempText}>18°C</Text>
              <Text style={styles.weatherSubText}>습도 60%</Text>
            </View>
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
            <View style={styles.weatherIconBox}>
              <Sun size={40} color="white" />
            </View>
            <View>
              <Text style={styles.weatherTitle}>맑음</Text>
              <Text style={styles.locationText}>서울</Text>
            </View>
          </View>
          
          <View style={styles.weatherCommentBox}>
            <Text style={styles.weatherComment}>☀️ 날씨가 좋으니 가벼운 산책하기 좋은 날입니다!</Text>
          </View>
        </View>

        {/* 3. 오늘의 일정 */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📢 오늘의 일정</Text>
            <TouchableOpacity>
              <Text style={styles.moreText}>전체보기</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.card}>
            {/* 일정 아이템 1 */}
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>09:00</Text>
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.scheduleTitle}>병원 예약</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                  <MapPin size={14} color={COLORS.textDim} />
                  <Text style={styles.scheduleLocation}> 서울대학교병원</Text>
                </View>
              </View>
              <Bell size={20} color={COLORS.primary} />
            </View>
            <View style={styles.divider} />
            
            {/* 일정 아이템 2 */}
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>14:00</Text>
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.scheduleTitle}>경로당 모임</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                  <MapPin size={14} color={COLORS.textDim} />
                  <Text style={styles.scheduleLocation}> 행복경로당</Text>
                </View>
              </View>
              <Bell size={20} color={COLORS.primary} />
            </View>
          </View>
        </View>

        {/* 하단 여백 */}
        <View style={{height: 100}} />
      </ScrollView>

      {/* 4. 하단 네비게이션 (고정) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={28} color={COLORS.primary} fill={COLORS.primaryLight} />
          <Text style={[styles.navText, {color: COLORS.primary}]}>홈</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navMainButton} onPress={() => alert('AI 챗봇 실행')}>
          <Bot size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Calendar size={28} color={COLORS.textDim} />
          <Text style={styles.navText}>캘린더</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  searchContainer: { paddingHorizontal: 5 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 15, elevation: 4 },
  searchText: { marginLeft: 10, fontSize: 16, color: COLORS.textDim },
  
  content: { flex: 1, padding: 20, marginTop: -10 }, // 헤더랑 겹치는 느낌
  
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  
  // 날씨 스타일
  dateText: { fontSize: 16, color: COLORS.textDim },
  dayText: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  tempText: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary },
  weatherSubText: { fontSize: 14, color: COLORS.textDim },
  weatherIconBox: { width: 60, height: 60, borderRadius: 20, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  weatherTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  locationText: { fontSize: 16, color: COLORS.textDim },
  weatherCommentBox: { backgroundColor: COLORS.primaryLight, padding: 15, borderRadius: 15, marginTop: 20 },
  weatherComment: { color: '#9a3412', fontSize: 16, fontWeight: 'bold' },

  // 일정 스타일
  sectionContainer: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 5 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  moreText: { fontSize: 16, color: COLORS.primary, fontWeight: 'bold' },
  scheduleItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  scheduleTime: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, width: 60 },
  scheduleTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  scheduleLocation: { fontSize: 14, color: COLORS.textDim },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 10 },

  // 하단 네비게이션
  bottomNav: { 
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 20, 
    borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10,
    position: 'absolute', bottom: 0, left: 0, right: 0 
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, fontWeight: 'bold', marginTop: 4, color: COLORS.textDim },
  navMainButton: { 
    width: 65, height: 65, borderRadius: 35, backgroundColor: COLORS.primary, 
    alignItems: 'center', justifyContent: 'center', top: -25, elevation: 5, borderWidth: 4, borderColor: '#f3f4f6' 
  },
});