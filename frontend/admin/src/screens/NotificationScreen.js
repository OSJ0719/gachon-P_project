import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  Info
} from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getNotificationsAPI } from '../api';
import { COLORS } from '../theme';

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // 현재 펼쳐진 알림 ID

  // ----------------------
  // API 호출
  // ----------------------
  const loadNotifications = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const res = await getNotificationsAPI();
        if (res?.success && Array.isArray(res.data)) {
          setNotifications(res.data);
        } else {
          setNotifications([]);
        }
      } catch (e) {
        console.error('[Notification] load error:', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = () => {
    loadNotifications(true);
  };

  const toggleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handlePressNotification = (item) => {
    // 단순히 펼치기/접기만 수행하고 싶으면 아래 네비게이션 로직 주석 처리
    // 여기서는 '정책 상세'로 이동 기능은 유지하되, 펼치기와 충돌 방지를 위해
    // 카드 전체 클릭은 펼치기로, 별도 버튼을 둘 수도 있음.
    // 현재 요구사항(펼치기)에 집중하여 카드 클릭 시 '펼치기'가 우선되도록 합니다.
    toggleExpand(item.id);
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'DEADLINE': return <AlertCircle size={24} color={COLORS.error} />;
      case 'CHANGE_POLICY': return <FileText size={24} color={COLORS.primary} />;
      default: return <Bell size={24} color={COLORS.primary} />;
    }
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    // DTO 구조에 따라 changes 배열 확인
    const changes = Array.isArray(item.changes) ? item.changes : 
                    (item.report && item.report.changes) ? item.report.changes : [];
    const hasChanges = changes.length > 0;
    
    // 날짜 포맷팅 (YYYY-MM-DD)
    let dateText = item.date || item.createdAt || '';
    if (dateText.length > 10) dateText = dateText.substring(0, 10);

    return (
      <View style={[styles.card, !item.read && styles.unreadCard]}>
        <TouchableOpacity
          style={styles.cardContent}
          activeOpacity={0.7}
          onPress={() => handlePressNotification(item)}
        >
          {/* 1. 상단: 아이콘 + 제목 + 화살표 */}
          <View style={styles.headerRow}>
            <View style={styles.iconBox}>
              {renderIcon(item.type)}
              {!item.read && <View style={styles.badgeDot} />}
            </View>
            
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.date}>{dateText}</Text>
            </View>

            {/* 펼침 상태 표시 아이콘 */}
            <View style={styles.chevronBox}>
              {isExpanded ? (
                <ChevronUp size={24} color={COLORS.textDim} />
              ) : (
                <ChevronDown size={24} color={COLORS.textDim} />
              )}
            </View>
          </View>

          {/* 2. 중단: 메시지 본문 */}
          <View style={styles.messageBox}>
            <Text 
              style={[styles.message, isExpanded && styles.messageExpanded]} 
              numberOfLines={isExpanded ? 0 : 2}
            >
              {item.message || item.messagePreview}
            </Text>
          </View>

          {/* 3. 하단: 비교표 (펼쳐졌을 때 & 변경사항 있을 때만) */}
          {isExpanded && hasChanges && (
            <View style={styles.comparisonContainer}>
              <Text style={styles.comparisonTitle}>📋 변경 내용 상세 비교</Text>
              {changes.map((change, idx) => (
                <View key={idx} style={styles.changeItem}>
                  <Text style={styles.fieldName}>• {change.field}</Text>
                  <View style={styles.compareRow}>
                    <View style={styles.oldBox}>
                      <Text style={styles.boxLabel}>변경 전</Text>
                      <Text style={styles.oldText}>{change.oldValue || change.before}</Text>
                    </View>
                    <ArrowRight size={20} color="#9ca3af" style={{ marginHorizontal: 8 }} />
                    <View style={styles.newBox}>
                      <Text style={styles.boxLabel}>변경 후</Text>
                      <Text style={styles.newText}>{change.newValue || change.after}</Text>
                    </View>
                  </View>
                </View>
              ))}
              
              {/* 상세 페이지 이동 버튼 (필요 시) */}
              {item.policyId && (
                <TouchableOpacity 
                  style={styles.detailLinkBtn}
                  onPress={() => navigation.navigate('PolicyDetail', { policyId: item.policyId })}
                >
                  <Text style={styles.detailLinkText}>해당 정책 자세히 보기</Text>
                  <ArrowRight size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림함</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Bell size={48} color={COLORS.textDim} style={{ opacity: 0.3, marginBottom: 12 }} />
              <Text style={styles.emptyText}>새로운 알림이 없습니다.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: '#111827' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { color: COLORS.textDim, fontSize: 16 },
  listContent: { padding: 20 },

  // 카드 스타일
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3, // 그림자 강화
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  unreadCard: {
    borderColor: '#fed7aa',
    backgroundColor: '#fffbf7',
  },
  cardContent: {
    padding: 20, // 패딩을 넉넉하게 줌
  },

  // 1. 헤더 영역 (아이콘 + 제목 + 날짜 + 화살표)
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconBox: {
    marginRight: 16,
    marginTop: 2,
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18, // 제목 크기 키움
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 26,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
  },
  chevronBox: {
    marginTop: 2,
  },

  // 2. 메시지 영역
  messageBox: {
    paddingLeft: 40, // 아이콘 너비만큼 들여쓰기
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  messageExpanded: {
    color: '#1f2937',
    fontWeight: '500',
  },

  // 3. 비교표 영역
  comparisonContainer: {
    marginTop: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginLeft: 0, 
  },
  comparisonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  changeItem: {
    marginBottom: 16,
  },
  fieldName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  oldBox: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  newBox: {
    flex: 1,
    backgroundColor: '#dcfce7', // 연한 초록색
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86efac',
    alignItems: 'center',
  },
  boxLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  oldText: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'line-through',
    textAlign: 'center',
  },
  newText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#15803d',
    textAlign: 'center',
  },
  
  // 상세 이동 링크 버튼
  detailLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 4,
  },
});