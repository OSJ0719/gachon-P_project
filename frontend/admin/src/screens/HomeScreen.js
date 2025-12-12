import * as Location from 'expo-location';
import { Bell, Bookmark, ChevronRight, Cloud, CloudRain, MapPin, Menu, Search, Sun } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBookmarksAPI, getHomeSummaryAPI } from '../api';
import BottomNavigation from '../components/BottomNavigation';
import SideMenu from '../components/SideMenu';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme';

export default function HomeScreen({ navigation, route }) {
  const { scale } = useTheme();
  const user = route.params?.user || { name: '사용자' };
  const displayUserName = typeof user === 'string' ? user : user.name;

  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [weatherData, setWeatherData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  // 위치 정보 상태
  const [location, setLocation] = useState(null);

  const mapBookmarkDtoToUI = (dto) => ({
    id: dto.policy.id,                         // 정책 ID
    bookmarkId: dto.id,                        // 필요하면 별도 보관
    category: dto.policy.mainCategoryName,
    title: dto.policy.name,
    date: dto.createdAt?.substring(0, 10),     // "YYYY-MM-DD"
  });

  // 날짜 포맷 헬퍼 (예: 2025-12-05 -> 12월 5일)
  const formatUserDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 요일 계산 헬퍼
  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return days[new Date(dateStr).getDay()];
  };

  // 날씨 상태 변환 헬퍼 (DTO -> UI)
  const mapSkyCondition = (condition) => {
    if (!condition) return '맑음';
    // 백엔드에서 이미 '맑음', '흐림', '비'처럼 내려줄 예정이면 그대로 사용
    return condition;
  };

  // fetchData가 lat, lon을 받을 수 있도록 파라미터 추가
  const fetchData = async (lat = null, lon = null) => {
    try {
      // 1. 홈 화면 요약 정보 (날씨 + 오늘의 일정 + 추천 정책)
      // 위치 정보가 있으면 API에 함께 전달
      const summaryRes = await getHomeSummaryAPI(lat, lon);
      
      if (summaryRes.success && summaryRes.data) {
        const data = summaryRes.data;

        // 1-1. 날씨 데이터 매핑
        if (data.weather) {
            const w = data.weather;
            setWeatherData({
              date: formatUserDate(w.baseDate),
              day: getDayName(w.baseDate),
              weather: {
                temp: w.tempCurrent,
                humidity: w.humidity,
                status: mapSkyCondition(w.skyCondition), // ← 여기로 들어감
                location: w.regionName,
              },
              comment: w.summary,
            });
        }

        // 1-2. 오늘의 일정 데이터 매핑
        if (Array.isArray(data.todayEvents)) {
          const mappedEvents = data.todayEvents.map(evt => ({
            id: evt.id,
            time: evt.startTime ? evt.startTime.substring(0, 5) : '00:00',
            title: evt.title,
            location: evt.memo
          }));
          setSchedules(mappedEvents);
        } else {
            setSchedules([]);
        }

      } else {
        console.log('홈 요약 데이터 로드 실패:', summaryRes.message);
      }

      // 2. 북마크 (별도 API 유지)
      const res = await getBookmarksAPI();
      if (res.success && Array.isArray(res.data)) {
        setBookmarks(res.data.map(mapBookmarkDtoToUI));
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
    // 새로고침 시에는 저장된 위치가 있다면 그 위치로, 없다면 기본값(null)으로 호출
    const lat = location ? location.latitude : null;
    const lon = location ? location.longitude : null;
    await fetchData(lat, lon);
    setRefreshing(false);
  }, [location]); // location 의존성 추가

  // 날씨 카드 클릭 시 위치 정보(GPS) 가져오기 핸들러
  const handleWeatherClick = async () => {
    try {
      // 1. 위치 정보 접근 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('알림', '위치 정보 접근 권한이 필요합니다.');
        return;
      }

      // 2. 현재 위치 가져오기 (정확도 옵션 등은 필요에 따라 조정 가능)
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // 3. 상태 업데이트 및 API 재호출
      setLocation({ latitude, longitude });
      
      // 사용자 피드백 및 데이터 갱신
      Alert.alert('위치 확인', '현재 계신 곳의 날씨 정보를 가져옵니다.');
      await fetchData(latitude, longitude);

    } catch (error) {
      console.error('위치 정보 가져오기 실패:', error);
      Alert.alert('오류', '위치 정보를 가져올 수 없습니다.\nGPS 설정을 확인해주세요.');
    }
  };

  const renderWeatherIcon = (status) => {
    if (status?.includes('비')) return <CloudRain size={32 * scale} color="white" />;
    if (status?.includes('흐림')) return <Cloud size={32 * scale} color="white" />;
    return <Sun size={32 * scale} color="white" />;
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
          <Text style={[styles.headerTitle, { fontSize: 22 * scale }]}>AI 든든 비서</Text>
          
          <TouchableOpacity 
            style={{ padding: 5, position: 'relative' }}
            onPress={() => navigation.navigate('Notification')}
          >
            <Bell size={28} color="white" />
            <View style={{
              position: 'absolute', top: 5, right: 3, 
              width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.error, 
              borderWidth: 1.5, borderColor: COLORS.primary 
            }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.searchBar} 
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.9}
        >
          <Search size={24} color={COLORS.primary} />
          <Text style={[styles.searchText, { fontSize: 16 * scale }]} numberOfLines={1} ellipsizeMode="tail">
            복지 서비스 검색하기 (예: 난방비)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        
        {/* 날씨 카드 */}
        {weatherData ? (
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={handleWeatherClick}
          >
            <View style={styles.weatherHeader}>
              <View>
                <Text style={[styles.dateText, { fontSize: 16 * scale }]}>{weatherData.date}</Text>
                <Text style={[styles.dayText, { fontSize: 26 * scale }]}>{weatherData.day}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.tempText, { fontSize: 36 * scale }]}>{weatherData.weather.temp}°C</Text>
                <Text style={[styles.subText, { fontSize: 14 * scale }]}>습도 {weatherData.weather.humidity}%</Text>
              </View>
            </View>
            <View style={styles.weatherBody}>
              <View style={styles.weatherIconBox}>
                {renderWeatherIcon(weatherData.weather.status)}
              </View>
              <View>
                <Text style={[styles.weatherStatus, { fontSize: 22 * scale }]}>{weatherData.weather.status}</Text>
                <Text style={[styles.locationText, { fontSize: 16 * scale }]}>
                  {weatherData.weather.location}
                  {/* 위치 아이콘 추가 */}
                  <MapPin size={14 * scale} color={COLORS.textDim} style={{ marginLeft: 4 }} />
                </Text>
              </View>
            </View>
            <View style={styles.commentBox}>
              <Text style={[styles.commentText, { fontSize: 16 * scale }]}>{weatherData.comment}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.card, { alignItems: 'center', padding: 30 }]}>
            <Text style={{ color: COLORS.textDim }}>날씨 정보를 불러오는 중입니다...</Text>
          </View>
        )}

        {/* 오늘의 일정 */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { fontSize: 22 * scale }]}>📢 오늘의 일정</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
            <Text style={[styles.moreLink, { fontSize: 16 * scale }]}>전체보기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {schedules.length === 0 ? (
            <Text style={[styles.emptyText, { fontSize: 16 * scale }]}>오늘 예정된 일정이 없습니다.</Text>
          ) : (
            schedules.map((item, index) => (
              <View key={item.id || index}>
                <View style={styles.scheduleItem}>
                  <Text style={[styles.timeText, { fontSize: 18 * scale }]}>{item.time}</Text>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={[styles.scheduleTitle, { fontSize: 18 * scale }]}>{item.title}</Text>
                    {item.location && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <MapPin size={14} color={COLORS.textDim} />
                            <Text style={[styles.locationSmall, { fontSize: 14 * scale }]}> {item.location}</Text>
                        </View>
                    )}
                  </View>
                </View>
                {index < schedules.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          )}
        </View>

        {/* 북마크 리스트 */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { fontSize: 22 * scale }]}>🔖 북마크한 정책</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bookmark')}>
            <Text style={[styles.moreLink, { fontSize: 16 * scale }]}>관리하기</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 12 }}>
          {bookmarks.length === 0 ? (
            <View style={styles.card}>
              <Text style={[styles.emptyText, { fontSize: 16 * scale }]}>저장된 정책이 없습니다.</Text>
            </View>
          ) : (
            bookmarks.slice(0, 3).map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.bookmarkCard} 
                onPress={() => navigation.navigate('PolicyDetail', { policyId: item.id })}
              >
                <View style={styles.bookmarkIcon}>
                  <Bookmark size={20} color={COLORS.primary} fill={COLORS.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                    <Text style={[styles.categoryBadge, { fontSize: 12 * scale }]}>{item.category || '복지'}</Text>
                  </View>
                  <Text style={[styles.bookmarkTitle, { fontSize: 17 * scale }]}>{item.title}</Text>
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
        userName={displayUserName}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontWeight: 'bold', color: 'white' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 16, elevation: 4 },
  searchText: { marginLeft: 10, color: COLORS.textDim, flex: 1 },
  content: { padding: 20, paddingTop: 10 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 20, marginBottom: 24, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  weatherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  dateText: { color: COLORS.textDim, marginBottom: 4 },
  dayText: { fontWeight: 'bold', color: '#111827' },
  tempText: { fontWeight: 'bold', color: COLORS.primary },
  subText: { color: COLORS.textDim, textAlign: 'right', marginTop: 4 },
  weatherBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  weatherIconBox: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  weatherStatus: { fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  locationText: { color: COLORS.textDim, flexDirection: 'row', alignItems: 'center' },
  commentBox: { backgroundColor: '#fff7ed', padding: 16, borderRadius: 16 },
  commentText: { color: '#9a3412', fontWeight: 'bold', lineHeight: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 10, paddingHorizontal: 4 },
  sectionTitle: { fontWeight: 'bold', color: '#111827' },
  moreLink: { fontWeight: 'bold', color: COLORS.primary },
  scheduleItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  timeText: { fontWeight: 'bold', color: '#111827', width: 65 },
  scheduleTitle: { fontWeight: 'bold', color: '#111827' },
  locationSmall: { color: COLORS.textDim },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 4 },
  emptyText: { textAlign: 'center', color: COLORS.textDim, fontSize: 16, padding: 20 },
  bookmarkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, elevation: 2, marginBottom: 12 },
  bookmarkIcon: { width: 48, height: 48, backgroundColor: '#fff7ed', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { alignSelf: 'flex-start', color: COLORS.primary, fontWeight: 'bold', backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  bookmarkTitle: { fontWeight: 'bold', color: '#111827' },
});