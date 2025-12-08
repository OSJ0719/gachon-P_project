import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, ActivityIndicator, Platform,Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { ArrowLeft, Bookmark, Bot, X, Calendar as CalendarIcon, Phone, Sparkles } from 'lucide-react-native';
import { COLORS } from '../theme';
import { getPolicyDetailAPI, getPolicyAIResultAPI,
        createBookmarkAPI,
        deleteBookmarkAPI,
      } from '../api';

export default function PolicyDetailScreen({ navigation, route }) {
  const { policyId } = route.params;
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showAI, setShowAI] = useState(false);
  const [aiGuide, setAiGuide] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  useEffect(() => {
    if (data?.userContext) {
      setBookmarked(!!data.userContext.bookmarked);
    }
  }, [data]);
  useEffect(() => {
    async function load() {
      try {
        const res = await getPolicyDetailAPI(policyId);
        if (res.success) {
           setData(res.data);
        }
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    }
    load();
  }, [policyId]);

  const handleOpenAIGuide = async () => {
    setShowAI(true);
    if (!aiGuide) {
      setAiLoading(true);
      try {
        const res = await getPolicyAIResultAPI(policyId);
        if (res.success) setAiGuide(res.data);
      } catch (e) {
        console.error(e);
      } finally { 
        setAiLoading(false); 
      }
    }
  };
  const handleToggleBookmark = async () => {
  try {
    if (!bookmarked) {
      // ✅ 북마크 추가
      const res = await createBookmarkAPI(policyId, null);
      if (res.success) {
        setBookmarked(true);
        setData(prev => ({
          ...prev,
          userContext: {
            ...(prev?.userContext || {}),
            bookmarked: true,
          },
        }));
      } else {
        Alert.alert('북마크 실패', res.message || '북마크 추가에 실패했습니다.');
      }
    } else {
      // ❌ 북마크 해제
      const res = await deleteBookmarkAPI(policyId);
      if (res.success) {
        setBookmarked(false);
        setData(prev => ({
          ...prev,
          userContext: {
            ...(prev?.userContext || {}),
            bookmarked: false,
          },
        }));
      } else {
        Alert.alert('북마크 해제 실패', res.message || '북마크 해제에 실패했습니다.');
      }
    }
  } catch (e) {
    console.error('bookmark toggle error', e);
    Alert.alert('오류', '북마크 처리 중 오류가 발생했습니다.');
  }
};
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!data || !data.policy) return <View style={styles.center}><Text>정보를 불러올 수 없습니다.</Text></View>;

  const { policy, ai, requiredDocuments } = data;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상세 정보</Text>
        <TouchableOpacity style={{ padding: 8 }} onPress={handleToggleBookmark}>
          {/* 북마크 상태 반영 (userContext 활용 가능) */}
          <Bookmark size={24} color={data.userContext?.bookmarked ? COLORS.primary : COLORS.textDim} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        {/* [DTO 매핑] 카테고리 이름 */}
        <Text style={styles.category}>{policy.categoryName || '복지'}</Text>
        {/* [DTO 매핑] 정책 제목 */}
        <Text style={styles.title}>{policy.title}</Text>
        
        {/* AI 요약 카드 */}
        <View style={styles.aiSummaryCard}>
          <View style={styles.aiHeaderRow}>
            <Bot size={28} color={COLORS.primary} fill={COLORS.primaryLight} />
            <Text style={styles.aiTitleText}>AI가 쉽게 설명해드려요</Text>
          </View>
          <Text style={styles.aiBodyText}>
            {/* [DTO 매핑] easyText 활용 */}
            {ai?.easyText || policy.summaryText || "AI가 내용을 요약해 드립니다."}
          </Text>
          <View style={styles.aiDecoration}>
            <Sparkles size={100} color={COLORS.primary} style={{ opacity: 0.05 }} />
          </View>
        </View>

        {/* 신청 자격 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📋 관련 연령대</Text>
          <Text style={styles.bodyText}>
            {/* [DTO 매핑] targetDescription 활용 */}
            {policy.targetDescription || '상세 내용 참조'}
          </Text>
        </View>

        {/* 필요 서류 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📄 필요 서류</Text>
          {requiredDocuments && requiredDocuments.length > 0 ? (
            requiredDocuments.map((doc, idx) => (
              <View key={doc.id || idx} style={{ marginBottom: 8 }}>
                <Text style={styles.bodyText}>• {doc.name}</Text>
                {doc.description && <Text style={[styles.bodyText, { fontSize: 14, color: COLORS.textDim, marginLeft: 10 }]}>{doc.description}</Text>}
              </View>
            ))
          ) : (
            <Text style={styles.bodyText}>별도 제출 서류 없음</Text>
          )}
        </View>

        {/* 제공 기관 및 문의처 (DTO에 있으므로 추가 표시 가능) */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>📞 문의처</Text>
            <Text style={styles.bodyText}>{policy.provider || '정보 없음'}</Text>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Platform.OS === 'ios' ? 0 : 20 }]}>
        <TouchableOpacity style={styles.aiButton} onPress={handleOpenAIGuide}>
          <Bot size={24} color="white" />
          <Text style={styles.aiButtonText}>AI 신청 도우미 열기</Text>
        </TouchableOpacity>
      </View>

      {/* 🤖 AI 도우미 모달 (기존 로직 유지) */}
      <Modal 
        visible={showAI} 
        animationType="slide" 
        transparent
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent, 
            { paddingBottom: insets.bottom + 20 }
          ]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Bot size={28} color={COLORS.primary} />
                <Text style={styles.modalTitle}> AI 신청 가이드</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAI(false)} style={{ padding: 5 }}>
                <X size={24} color={COLORS.textDim} />
              </TouchableOpacity>
            </View>

            {aiLoading ? (
              <View style={{ padding: 50, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 10, color: COLORS.textDim }}>내용을 분석하고 있습니다...</Text>
              </View>
            ) : aiGuide ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.guideIntro}>어르신, 이 정책은 이렇게 신청하세요!</Text>
                
                <View style={styles.guideBox}>
                  {['누가','언제','어디서','무엇을','어떻게'].map(k => {
                    const keyMap = { '누가': 'who', '언제': 'when', '어디서': 'where', '무엇을': 'what', '어떻게': 'how' };
                    const value = aiGuide[keyMap[k]];
                    return (
                      <View key={k} style={{ marginBottom: 16, flexDirection: 'row' }}>
                        <View style={styles.guideLabelBox}>
                          <Text style={styles.guideLabelText}>{k}</Text>
                        </View>
                        <Text style={styles.guideValueText}>{value || '-'}</Text>
                      </View>
                    );
                  })}
                </View>

                <TouchableOpacity style={styles.actionButton} onPress={() => alert('일정에 추가되었습니다!')}>
                  <CalendarIcon size={20} color="white" />
                  <Text style={styles.actionText}>내 일정에 추가하기</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#f3f4f6' }]} onPress={() => alert('전화 걸기')}>
                  <Phone size={20} color="#374151" />
                  <Text style={[styles.actionText, { color: '#374151' }]}>담당 부서 전화하기</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>정보를 불러오지 못했습니다.</Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  category: { color: COLORS.primary, fontWeight: 'bold', marginBottom: 6, fontSize: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111827', marginBottom: 24, lineHeight: 34 },
  
  aiSummaryCard: { backgroundColor: '#fff7ed', borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 2, borderColor: '#fed7aa', position: 'relative', overflow: 'hidden' },
  aiHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  aiTitleText: { fontSize: 20, fontWeight: 'bold', color: '#9a3412', marginLeft: 8 },
  aiBodyText: { fontSize: 18, color: '#431407', lineHeight: 28, fontWeight: '500' },
  aiDecoration: { position: 'absolute', right: -20, bottom: -20, zIndex: -1 },

  card: { backgroundColor: '#f9fafb', padding: 20, borderRadius: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  bodyText: { fontSize: 16, color: '#4b5563', lineHeight: 26 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 20, borderTopWidth: 1, borderTopColor: '#e5e7eb', elevation: 10 },
  aiButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, padding: 18, borderRadius: 16, gap: 8, elevation: 4 },
  aiButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end',
  },
  modalContent: { 
    backgroundColor: 'white',
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 24, 
    height: '85%',
    overflow: 'hidden'
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginLeft: 8 },
  guideIntro: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#111827' },
  guideBox: { backgroundColor: '#f9fafb', padding: 20, borderRadius: 16, marginBottom: 20 },
  guideLabelBox: { backgroundColor: '#fff7ed', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, width: 70, alignItems: 'center', marginRight: 12 },
  guideLabelText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  guideValueText: { flex: 1, fontSize: 17, color: '#374151', lineHeight: 24 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.secondary, padding: 16, borderRadius: 14, marginBottom: 12, gap: 8 },
  actionText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});