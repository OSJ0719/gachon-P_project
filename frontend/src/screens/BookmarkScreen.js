import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Bookmark } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getBookmarksAPI } from '../api';

export default function BookmarkScreen({ navigation }) {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await getBookmarksAPI();
      if (res.success) setBookmarks(res.data);
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
        {bookmarks.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.category}</Text></View>
              <Bookmark size={24} color={COLORS.primary} fill={COLORS.primary} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>저장일: {item.date}</Text>
          </TouchableOpacity>
        ))}
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