import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getBookmarksAPI } from '../api';

export default function BookmarkScreen({ navigation }) {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getBookmarksAPI();
        if (res.success && Array.isArray(res.data)) {
          setBookmarks(res.data);
        }
      } catch (e) {
        console.error('북마크 로드 실패:', e);
      }
    }
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>북마크 보관함</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {bookmarks.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: COLORS.textDim }}>저장된 북마크가 없습니다.</Text>
          </View>
        ) : (
          bookmarks.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}><Text style={styles.badgeText}>{item.category}</Text></View>
                <Bookmark size={24} color={COLORS.primary} fill={COLORS.primary} />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>저장일: {item.date}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badge: { backgroundColor: '#fff7ed', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: COLORS.primary, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  date: { fontSize: 14, color: '#6b7280' },
});