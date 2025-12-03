import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getRecommendationsAPI } from '../api';

export default function RecommendationScreen({ navigation }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getRecommendationsAPI();
        if (res.success && Array.isArray(res.data)) {
          setList(res.data);
        }
      } catch (e) {
        console.error('추천 로드 실패:', e);
      }
    }
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>추천 복지 사업</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>💡 어르신께 딱 맞는 혜택을 찾아봤어요!</Text>
        </View>

        {list.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: COLORS.textDim }}>현재 추천 항목이 없습니다.</Text>
          </View>
        ) : (
          list.map((item, index) => (
            <TouchableOpacity 
              key={item.id || index} 
              style={styles.card}
              onPress={() => navigation.navigate('PolicyDetail', { policyId: item.id })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.rankBadge}><Text style={styles.rankText}>{index + 1}</Text></View>
                <Text style={styles.category}>{item.category}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.reasonBox}>
                <Sparkles size={16} color={COLORS.primary} />
                <Text style={styles.reasonText}>{item.reason}</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.detailBtn}>자세히 보기</Text>
                <ChevronRight size={20} color={COLORS.textDim} />
              </View>
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
  banner: { backgroundColor: '#fff7ed', padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#fed7aa' },
  bannerText: { color: '#9a3412', fontSize: 16, fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: 24, borderRadius: 24, marginBottom: 16, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rankBadge: { width: 28, height: 28, backgroundColor: COLORS.primary, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  rankText: { color: 'white', fontWeight: 'bold' },
  category: { fontSize: 14, color: COLORS.textDim, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  reasonBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', padding: 12, borderRadius: 12, marginBottom: 16 },
  reasonText: { marginLeft: 8, fontSize: 16, color: '#4b5563', flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 16 },
  detailBtn: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
});