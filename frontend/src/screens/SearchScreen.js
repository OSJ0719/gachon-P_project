import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getPoliciesAPI } from '../api';

export default function SearchScreen({ navigation }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // 검색 시도 여부

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setSearched(true);
    
    try {
      // 실제 API 호출
      const res = await getPoliciesAPI(keyword);
      
      if (res.success && Array.isArray(res.data)) {
        setResults(res.data);
      } else {
        setResults([]); // 결과 없음 or 에러
      }
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('PolicyDetail', { policyId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.category || '복지'}</Text>
        </View>
        <ChevronRight size={20} color={COLORS.textDim} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.summary} numberOfLines={2}>{item.summary || '내용이 없습니다.'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 검색 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput 
            style={styles.input}
            placeholder="검색어를 입력하세요 (예: 난방비)"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearch}
            autoFocus
          />
          <TouchableOpacity onPress={handleSearch}>
            <Search size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 결과 리스트 */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.infoText}>열심히 찾고 있어요...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            searched && (
              <View style={styles.center}>
                <Text style={styles.infoText}>검색 결과가 없습니다.</Text>
                <Text style={styles.subText}>다른 단어로 검색해보세요.</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 12, marginLeft: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 18, color: '#111827' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  infoText: { fontSize: 18, color: COLORS.textDim, marginTop: 10 },
  subText: { fontSize: 16, color: '#9ca3af', marginTop: 4 },
  
  // 카드 스타일
  card: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badge: { backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  summary: { fontSize: 16, color: '#4b5563', lineHeight: 22 },
});