import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, ArrowRight, ArrowLeft, MapPin } from 'lucide-react-native';
import { COLORS } from '../theme';
import { updateUserProfileAPI } from '../api'; // API import

export default function InitialSetupScreen({ navigation, route }) {
  const user = route.params?.user || {};
  const [step, setStep] = useState(1); // 1: 관심사, 2: 지역, 3: 복지정보

  // --- 상태 관리 ---
  // 1. 관심사
  const [categories, setCategories] = useState([]);
  const categoryList = ['건강/의료', '일자리', '주거/생활', '교통', '교육', '금융', '문화/여가', '돌봄'];

  // 2. 지역 (시/도, 시/군/구, 읍/면/동)
  const [region, setRegion] = useState({ city: '', district: '', dong: '' });
  const [showCityModal, setShowCityModal] = useState(false);
  const cityList = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

  // 3. 복지 정보
  const [welfareInfo, setWelfareInfo] = useState({
    incomeLevel: 'general', // general(일반), basic(기초수급), near(차상위)
    hasDisability: false,   // 장애 여부
    livingAlone: false,     // 독거 여부
  });

  // --- 핸들러 함수 ---
  const toggleCategory = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // 마지막 단계: 서버 전송 (실제 API 연동)
      try {
        const profileData = {
          categories,
          region, // { city, district, dong }
          welfareInfo
        };
        
        // API 호출
        const res = await updateUserProfileAPI(profileData);
        
        if (res.success) {
          // 성공 시 홈으로 이동
          navigation.replace('Home', { user });
        } else {
          // 실패 시 에러 메시지
          Alert.alert('오류', res.message || '설정 저장에 실패했습니다.');
        }
      } catch (e) {
        console.error('설정 저장 실패:', e);
        Alert.alert('오류', '네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // --- 단계별 화면 렌더링 (UI 코드는 기존과 동일) ---
  
  // Step 1: 관심사 선택
  const renderStep1 = () => (
    <View>
      <Text style={styles.title}>어떤 정보가 필요하세요?</Text>
      <Text style={styles.subtitle}>관심 있는 분야를 모두 선택해주세요.</Text>
      <View style={styles.grid}>
        {categoryList.map((cat) => {
          const isSelected = categories.includes(cat);
          return (
            <TouchableOpacity 
              key={cat} 
              style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
              onPress={() => toggleCategory(cat)}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{cat}</Text>
              {isSelected && <Check size={20} color="white" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // Step 2: 지역 설정
  const renderStep2 = () => (
    <View>
      <Text style={styles.title}>어디에 거주하시나요?</Text>
      <Text style={styles.subtitle}>사시는 곳에 맞는 혜택을 찾아드려요.</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>시 / 도</Text>
        <TouchableOpacity style={styles.selectBtn} onPress={() => setShowCityModal(true)}>
          <Text style={region.city ? styles.inputText : styles.placeholderText}>
            {region.city || '선택해주세요'}
          </Text>
          <MapPin size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>시 / 군 / 구</Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="예: 강남구, 분당구" 
          value={region.district}
          onChangeText={(text) => setRegion({ ...region, district: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>읍 / 면 / 동</Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="예: 역삼동" 
          value={region.dong}
          onChangeText={(text) => setRegion({ ...region, dong: text })}
        />
      </View>
    </View>
  );

  // Step 3: 복지 정보 (소득, 장애 등)
  const renderStep3 = () => (
    <View>
      <Text style={styles.title}>맞춤 혜택을 찾아드릴게요</Text>
      <Text style={styles.subtitle}>해당하는 항목을 선택해주세요.</Text>

      {/* 소득 수준 */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>경제 상황 (소득 수준)</Text>
        <View style={styles.radioGroup}>
          {[
            { label: '일반', value: 'general' },
            { label: '기초생활수급자', value: 'basic' },
            { label: '차상위계층', value: 'near' }
          ].map((opt) => (
            <TouchableOpacity 
              key={opt.value}
              style={[styles.radioBtn, welfareInfo.incomeLevel === opt.value && styles.radioBtnSelected]}
              onPress={() => setWelfareInfo({ ...welfareInfo, incomeLevel: opt.value })}
            >
              <Text style={[styles.radioText, welfareInfo.incomeLevel === opt.value && styles.radioTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 장애 여부 */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>장애 여부</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.halfBtn, welfareInfo.hasDisability && styles.activeHalfBtn]}
            onPress={() => setWelfareInfo({ ...welfareInfo, hasDisability: true })}
          >
            <Text style={[styles.halfBtnText, welfareInfo.hasDisability && styles.activeHalfBtnText]}>예 (있음)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.halfBtn, !welfareInfo.hasDisability && styles.activeHalfBtn]}
            onPress={() => setWelfareInfo({ ...welfareInfo, hasDisability: false })}
          >
            <Text style={[styles.halfBtnText, !welfareInfo.hasDisability && styles.activeHalfBtnText]}>아니요</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* 독거 여부 */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>혼자 살고 계신가요?</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.halfBtn, welfareInfo.livingAlone && styles.activeHalfBtn]}
            onPress={() => setWelfareInfo({ ...welfareInfo, livingAlone: true })}
          >
            <Text style={[styles.halfBtnText, welfareInfo.livingAlone && styles.activeHalfBtnText]}>예</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.halfBtn, !welfareInfo.livingAlone && styles.activeHalfBtn]}
            onPress={() => setWelfareInfo({ ...welfareInfo, livingAlone: false })}
          >
            <Text style={[styles.halfBtnText, !welfareInfo.livingAlone && styles.activeHalfBtnText]}>아니요</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 진행 상태 바 */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        {step > 1 ? (
          <TouchableOpacity style={styles.prevBtn} onPress={handleBack}>
            <ArrowLeft size={24} color="#4b5563" />
            <Text style={styles.prevBtnText}>이전</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} /> 
        )}
        
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>{step === 3 ? '완료하고 시작하기' : '다음'}</Text>
          {step < 3 && <ArrowRight size={24} color="white" />}
        </TouchableOpacity>
      </View>

      {/* 도시 선택 모달 */}
      <Modal visible={showCityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>지역 선택</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <View style={styles.cityGrid}>
                {cityList.map((city) => (
                  <TouchableOpacity 
                    key={city} 
                    style={[styles.cityItem, region.city === city && styles.cityItemSelected]}
                    onPress={() => {
                      setRegion({ ...region, city });
                      setShowCityModal(false);
                    }}
                  >
                    <Text style={[styles.cityText, region.city === city && styles.cityTextSelected]}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowCityModal(false)}>
              <Text style={{ color: '#4b5563', fontSize: 16 }}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  progressBar: { height: 6, backgroundColor: '#f3f4f6', width: '100%' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },
  content: { padding: 24, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#6b7280', marginBottom: 32 },
  
  // 그리드 (Step 1)
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionBtn: { width: '48%', padding: 16, borderRadius: 16, borderWidth: 2, borderColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  optionBtnSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  optionText: { fontSize: 18, fontWeight: 'bold', color: '#4b5563' },
  optionTextSelected: { color: 'white' },

  // 입력 필드 (Step 2)
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 12, padding: 16 },
  textInput: { borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, fontSize: 18, color: '#111827' },
  inputText: { fontSize: 18, color: '#111827', fontWeight: 'bold' },
  placeholderText: { fontSize: 18, color: '#9ca3af' },

  // 복지 정보 (Step 3)
  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  radioGroup: { gap: 10 },
  radioBtn: { padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6', alignItems: 'center' },
  radioBtnSelected: { backgroundColor: '#fff7ed', borderWidth: 2, borderColor: COLORS.primary },
  radioText: { fontSize: 18, color: '#4b5563', fontWeight: '500' },
  radioTextSelected: { color: COLORS.primary, fontWeight: 'bold' },
  row: { flexDirection: 'row', gap: 10 },
  halfBtn: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6', alignItems: 'center' },
  activeHalfBtn: { backgroundColor: COLORS.primary },
  halfBtnText: { fontSize: 18, color: '#4b5563', fontWeight: 'bold' },
  activeHalfBtnText: { color: 'white' },

  // 하단 버튼
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  prevBtn: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  prevBtnText: { fontSize: 18, fontWeight: 'bold', color: '#4b5563', marginLeft: 8 },
  nextBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 8, elevation: 3 },
  nextBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  // 모달
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 24, padding: 24, maxHeight: '80%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  cityItem: { width: '30%', paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  cityItemSelected: { backgroundColor: COLORS.primary },
  cityText: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
  cityTextSelected: { color: 'white' },
  modalCloseBtn: { alignItems: 'center', padding: 16, marginTop: 10 },
});