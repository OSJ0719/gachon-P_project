import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getBookmarksAPI } from '../api';

const CATEGORY_LABELS = {
  CHILDCARE: '보육·돌봄',
  EDUCATION: '교육·장학',
  ETC: '기타',
  FINANCE: '금융·서민금융',
  LOCAL: '지자체 생활지원',
  SENIOR: '노년·고령자',
};

export default function BookmarkScreen({ navigation }) {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getBookmarksAPI();
        if (res.success && Array.isArray(res.data)) {
          const uiList = res.data
            .filter((b) => !!b.policy) // policy 없는 이상 데이터는 건너뜀
            .map((b) => {
              const p = b.policy;
              const categoryLabel =
                (p.mainCategoryName && p.mainCategoryName.trim().length > 0)
                  ? p.mainCategoryName
                  : CATEGORY_LABELS[p.mainCategoryCode] || '복지';

              return {
                id: b.id,                               // 북마크 ID
                policyId: p.id,                         // 정책 ID
                title: p.name,                          // 정책 제목
                category: categoryLabel,                // 카테고리 표시용 라벨
                createdAt: b.createdAt
                  ? String(b.createdAt).substring(0, 10) // "YYYY-MM-DD"
                  : '',
              };
            });

          setBookmarks(uiList);
        } else {
          setBookmarks([]);
        }
      } catch (e) {
        console.error('북마크 로드 실패:', e);
        setBookmarks([]);
      }
    }

    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>북마크 보관함</Text>
      </View>

      {/* 내용 */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {bookmarks.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: COLORS.textDim }}>
              저장된 북마크가 없습니다.
            </Text>
          </View>
        ) : (
          bookmarks.map((item) => (
            <TouchableOpacity
              key={item.id} // 북마크 ID
              style={styles.card}
              onPress={() =>
                navigation.navigate('PolicyDetail', { policyId: item.policyId })
              }
            >
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.category}</Text>
                </View>
                <Bookmark size={24} color={COLORS.primary} fill={COLORS.primary} />
              </View>

              <Text style={styles.title}>{item.title || '제목 없음'}</Text>

              <Text style={styles.date}>
                저장일: {item.createdAt || '-'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* 기존 styles 그대로 쓰면 됨 */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.textDim,
  },
});