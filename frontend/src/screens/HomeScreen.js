// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import { Menu, Search, Sun, MapPin, Bell, CloudRain, Cloud, Bookmark, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getHomeSummaryAPI, getSchedulesAPI, getBookmarksAPI } from '../api';
import SideMenu from '../components/SideMenu';
import BottomNavigation from '../components/BottomNavigation';

export default function HomeScreen({ navigation, route }) {
  const user = route.params?.user || { name: '사용자' };
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 초기값 null로 설정 (로딩 중이거나 데이터 없음 표현)
  const [weatherData, setWeatherData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const fetchData = async () => {
    try {
      // 1. 날씨 정보
      const summaryRes = await getHomeSummaryAPI();
      if (summaryRes.success) {
        setWeatherData(summaryRes.data);
      } else {
        console.log('날씨 데이터 로드 실패:', summaryRes.message);
      }

      // 2. 오늘 일정
      const today = new Date().toISOString().split('T')[0];
      const scheduleRes = await getSchedulesAPI(today);
      if (scheduleRes.success && Array.isArray(scheduleRes.data)) {
        setSchedules(scheduleRes.data);
      }

      // 3. 북마크
      const bookmarkRes = await getBookmarksAPI();
      if (bookmarkRes.success && Array.isArray(bookmarkRes.data)) {
        setBookmarks(bookmarkRes.data);
      }
    } catch (e) {
      console.error('데이터 로딩 중 에러:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const renderWeatherIcon = (status) => {
    if (status?.includes('비')) return <CloudRain size={32} color="white" />;
    if (status?.includes('흐림')) return <Cloud size={32} color="white" />;
    return <Sun size={32} color="white" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => setMenuOpen(true)} style={{ padding: 5 }}>
            <Menu size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI 든든 비서</Text>
          <TouchableOpacity style={{ padding: 5 }}>
            <Bell size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={24} color={COLORS.primary} />
          <Text style={styles.searchText}>복지 서비스 검색하기</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        
        {/* 날씨 카드 (데이터가 있을 때만 표시) */}
        {weatherData ? (
          <View style={styles.card}>
            <View style={styles.weatherHeader}>
              <View>
                <Text style={styles.dateText}>{weatherData.date}</Text>
                <Text style={styles.dayText}>{weatherData.day}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.tempText}>{weatherData.weather.temp}°C</Text>
                <Text style={styles.subText}>습도 {weatherData.weather.humidity}%</Text>
              </View>
            </View>
            <View style={styles.weatherBody}>
              <View style={styles.weatherIconBox}>
                {renderWeatherIcon(weatherData.weather.status)}
              </View>
              <View>
                <Text style={styles.weatherStatus}>{weatherData.weather.status}</Text>
                <Text style={styles.locationText}>{weatherData.weather.location}</Text>
              </View>
            </View>
            <View style={styles.commentBox}>
              <Text style={styles.commentText}>{weatherData.comment}</Text>
            </View>
          </View>
        ) : (
          // 데이터 로딩 실패/중일 때 표시할 간단한 공간
          <View style={[styles.card, { alignItems: 'center', padding: 30 }]}>
            <Text style={{ color: COLORS.textDim }}>날씨 정보를 불러오는 중입니다...</Text>
          </View>
        )}

        {/* 오늘의 일정 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📢 오늘의 일정</Text>
          <TouchableOpacity><Text style={styles.moreLink}>전체보기</Text></TouchableOpacity>
        </View>
        <View style={styles.card}>
          {schedules.length === 0 ? (
            <Text style={styles.emptyText}>오늘 예정된 일정이 없습니다.</Text>
          ) : (
            schedules.map((item, index) => (
              <View key={item.id}>
                <View style={styles.scheduleItem}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={styles.scheduleTitle}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <MapPin size={14} color={COLORS.textDim} />
                      <Text style={styles.locationSmall}> {item.location}</Text>
                    </View>
                  </View>
                </View>
                {index < schedules.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          )}
        </View>

        {/* 북마크 리스트 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔖 북마크한 정책</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bookmark')}>
            <Text style={styles.moreLink}>관리하기</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 12 }}>
          {bookmarks.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.emptyText}>저장된 정책이 없습니다.</Text>
            </View>
          ) : (
            bookmarks.slice(0, 3).map((item) => (
              <TouchableOpacity key={item.id} style={styles.bookmarkCard} onPress={() => navigation.navigate('Bookmark')}>
                <View style={styles.bookmarkIcon}>
                  <Bookmark size={20} color={COLORS.primary} fill={COLORS.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                    <Text style={styles.categoryBadge}>{item.category}</Text>
                  </View>
                  <Text style={styles.bookmarkTitle}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.textDim} />
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavigation activeTab="home" onNavigate={(page) => navigation.navigate(page)} />
      <SideMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        navigation={navigation}
        userName={typeof user === 'string' ? user : user.name}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 16, elevation: 4 },
  searchText: { marginLeft: 10, fontSize: 16, color: COLORS.textDim },
  content: { padding: 20, paddingTop: 10 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 20, marginBottom: 24, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  weatherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  dateText: { fontSize: 16, color: COLORS.textDim, marginBottom: 4 },
  dayText: { fontSize: 26, fontWeight: 'bold', color: '#111827' },
  tempText: { fontSize: 36, fontWeight: 'bold', color: COLORS.primary },
  subText: { fontSize: 14, color: COLORS.textDim, textAlign: 'right', marginTop: 4 },
  weatherBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  weatherIconBox: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  weatherStatus: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  locationText: { fontSize: 16, color: COLORS.textDim },
  commentBox: { backgroundColor: '#fff7ed', padding: 16, borderRadius: 16 },
  commentText: { color: '#9a3412', fontSize: 16, fontWeight: 'bold', lineHeight: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 10, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  moreLink: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  scheduleItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  timeText: { fontSize: 18, fontWeight: 'bold', color: '#111827', width: 65 },
  scheduleTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  locationSmall: { fontSize: 14, color: COLORS.textDim },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 4 },
  emptyText: { textAlign: 'center', color: COLORS.textDim, fontSize: 16, padding: 20 },
  bookmarkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, elevation: 2, marginBottom: 2 },
  bookmarkIcon: { width: 48, height: 48, backgroundColor: '#fff7ed', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { fontSize: 12, color: COLORS.primary, fontWeight: 'bold', backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  bookmarkTitle: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
});