import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, ChevronDown, ChevronUp, AlertCircle, ArrowRight } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getNotificationsAPI } from '../api';

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // 현재 펼쳐진 알림 ID

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await getNotificationsAPI();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const hasChanges = item.changes && item.changes.length > 0;

    return (
      <View style={[styles.card, !item.read && styles.unreadCard]}>
        <TouchableOpacity 
          style={styles.cardHeader} 
          onPress={() => hasChanges ? toggleExpand(item.id) : null}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Bell size={24} color={item.read ? COLORS.textDim : COLORS.primary} />
            {!item.read && <View style={styles.badgeDot} />}
          </View>
          
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.message} numberOfLines={isExpanded ? 0 : 2}>{item.message}</Text>
            
            {hasChanges && !isExpanded && (
              <Text style={styles.hintText}>터치하여 변경 내용 확인하기 👇</Text>
            )}
          </View>

          {hasChanges && (
            <View>
              {isExpanded ? <ChevronUp size={20} color={COLORS.textDim} /> : <ChevronDown size={20} color={COLORS.textDim} />}
            </View>
          )}
        </TouchableOpacity>

        {/* 변경 비교 상세 창 (Accordion) */}
        {isExpanded && hasChanges && (
          <View style={styles.detailBox}>
            <Text style={styles.detailHeader}>🔍 정책이 이렇게 달라졌어요</Text>
            
            {item.changes.map((change, idx) => (
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
            
            <TouchableOpacity 
              style={styles.detailButton}
              onPress={() => navigation.navigate('Search', { keyword: item.title })} // 검색 화면으로 이동하여 해당 정책 찾기 유도
            >
              <Text style={styles.detailButtonText}>해당 정책 바로가기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
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
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: COLORS.textDim, fontSize: 16 }}>새로운 알림이 없습니다.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  
  card: { backgroundColor: 'white', borderRadius: 16, marginBottom: 12, elevation: 2, overflow: 'hidden' },
  unreadCard: { borderWidth: 1, borderColor: COLORS.primaryLight, backgroundColor: '#fffbf7' },
  cardHeader: { flexDirection: 'row', padding: 16, alignItems: 'flex-start' },
  iconBox: { position: 'relative', marginTop: 2 },
  badgeDot: { position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.error, borderWidth: 1, borderColor: 'white' },
  
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', flex: 1 },
  date: { fontSize: 12, color: '#9ca3af', marginLeft: 8 },
  message: { fontSize: 15, color: '#4b5563', marginTop: 4, lineHeight: 20 },
  hintText: { fontSize: 12, color: COLORS.primary, marginTop: 6, fontWeight: 'bold' },

  // 상세 비교 스타일
  detailBox: { backgroundColor: '#f3f4f6', padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  detailHeader: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  changeRow: { marginBottom: 16 },
  fieldName: { fontSize: 15, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
  compareBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  
  beforeBox: { flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  afterBox: { flex: 1, backgroundColor: '#dcfce7', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#86efac' },
  
  label: { fontSize: 11, color: '#6b7280', marginBottom: 2 },
  beforeText: { fontSize: 14, color: '#4b5563', textDecorationLine: 'line-through' },
  afterText: { fontSize: 14, fontWeight: 'bold', color: '#15803d' },

  detailButton: { marginTop: 8, backgroundColor: COLORS.white, padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  detailButtonText: { color: COLORS.text, fontWeight: 'bold' }
});