import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ChevronDown,
  ChevronUp,
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
        console.log('📥 getNotificationsAPI res:', res);

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

  // 알림 카드를 눌렀을 때 이동
  const handlePressNotification = (item) => {
    // 1순위: policyId가 있으면 정책 상세로
    if (item.policyId) {
      navigation.navigate('PolicyDetail', { policyId: item.policyId });
      return;
    }

    // 2순위: policyId 없으면 검색 화면으로 fallback
    navigation.navigate('Search', { keyword: item.title });
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const changes = Array.isArray(item.changes) ? item.changes : [];
    const hasChanges = changes.length > 0;
    const dateText = item.date || item.createdAt || '';

    return (
      <View style={[styles.card, !item.read && styles.unreadCard]}>
        {/* 상단 요약 영역 */}
        <TouchableOpacity
          style={styles.cardHeader}
          activeOpacity={0.8}
          onPress={() => handlePressNotification(item)}
        >
          <View style={styles.iconBox}>
            <Bell
              size={24}
              color={item.read ? COLORS.textDim : COLORS.primary}
            />
            {!item.read && <View style={styles.badgeDot} />}
          </View>

          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <View style={styles.headerRow}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {!!dateText && <Text style={styles.date}>{dateText}</Text>}
            </View>

            {/* AI가 만들어준 “~가 ~로 변했어요!” 본문 */}
            <Text style={styles.message} numberOfLines={isExpanded ? 0 : 2}>
              {item.message}
            </Text>

            {hasChanges && !isExpanded && (
              <Text style={styles.hintText}>
                터치하여 변경 내용 확인하기 👇
              </Text>
            )}
          </View>

          {/* 펼치기/접기 토글 버튼 */}
          {hasChanges && (
            <TouchableOpacity
              onPress={() => toggleExpand(item.id)}
              style={{ paddingLeft: 4, paddingVertical: 4 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isExpanded ? (
                <ChevronUp size={20} color={COLORS.textDim} />
              ) : (
                <ChevronDown size={20} color={COLORS.textDim} />
              )}
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* 변경 비교 상세(Accordion, 있으면 보여줌) */}
        {isExpanded && hasChanges && (
          <View style={styles.detailBox}>
            <Text style={styles.detailHeader}>🔍 정책이 이렇게 달라졌어요</Text>

            {changes.map((change, idx) => (
              <View key={idx} style={styles.changeRow}>
                <Text style={styles.fieldName}>• {change.field}</Text>
                <View style={styles.compareBox}>
                  <View style={styles.beforeBox}>
                    <Text style={styles.label}>변경 전</Text>
                    <Text style={styles.beforeText}>{change.before}</Text>
                  </View>
                  <ArrowRight size={20} color="#9ca3af" />
                  <View style={styles.afterBox}>
                    <Text style={styles.label}>변경 후</Text>
                    <Text style={styles.afterText}>{change.after}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // ----------------------
  // 렌더링
  // ----------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: { color: COLORS.textDim, fontSize: 16 },

  listContent: { padding: 20 },

  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  unreadCard: {
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    backgroundColor: '#fffbf7',
  },

  cardHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  iconBox: { position: 'relative', marginTop: 2 },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 1,
    borderColor: 'white',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  date: { fontSize: 12, color: '#9ca3af', marginLeft: 8 },
  message: { fontSize: 15, color: '#4b5563', marginTop: 4, lineHeight: 20 },
  hintText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 6,
    fontWeight: 'bold',
  },

  // 상세 비교 영역
  detailBox: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  changeRow: { marginBottom: 16 },
  fieldName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  compareBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  beforeBox: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  afterBox: {
    flex: 1,
    backgroundColor: '#dcfce7',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#86efac',
  },

  label: { fontSize: 11, color: '#6b7280', marginBottom: 2 },
  beforeText: {
    fontSize: 14,
    color: '#4b5563',
    textDecorationLine: 'line-through',
  },
  afterText: { fontSize: 14, fontWeight: 'bold', color: '#15803d' },
});