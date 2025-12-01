import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Bot } from 'lucide-react-native';
import { COLORS, COMMON_STYLES } from '../theme';
import { loginAPI } from '../api';
import AuthModal from '../components/AuthModal';
import FindAccountModal from '../components/FindAccountModal';

export default function LoginScreen({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  
  // 모달 상태 관리
  const [authModal, setAuthModal] = useState({ isOpen: false, type: 'success', message: '' });
  const [showFindAccount, setShowFindAccount] = useState(false);

  const handleLogin = async () => {
    // 1. API 호출
    const result = await loginAPI(id, password);

    // 2. 결과 처리
    if (result.success) {
      // 성공 시 모달 띄우기
      setAuthModal({ isOpen: true, type: 'success', message: `${result.user.name}님 환영합니다!` });
      
      // 1.5초 뒤에 홈 화면으로 이동
      setTimeout(() => {
        setAuthModal(prev => ({ ...prev, isOpen: false }));
        
        // 'replace'를 쓰면 뒤로가기 버튼을 눌러도 로그인 화면으로 돌아오지 않습니다.
        navigation.replace('Home', { user: result.user }); 
      }, 1500);
    } else {
      // 실패 시 에러 모달
      setAuthModal({ isOpen: true, type: 'fail', message: result.message });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryLight }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        
        {/* 로고 영역 */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ 
            width: 100, height: 100, borderRadius: 30, 
            backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
            marginBottom: 20, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10
          }}>
            <Bot size={60} color="white" />
          </View>
          <Text style={COMMON_STYLES.title}>AI 든든 비서</Text>
          <Text style={COMMON_STYLES.subtitle}>어르신을 위한 맞춤 복지 파트너</Text>
        </View>

        {/* 입력 폼 */}
        <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, elevation: 5 }}>
          <Text style={COMMON_STYLES.label}>아이디</Text>
          <TextInput 
            style={COMMON_STYLES.input} 
            placeholder="아이디를 입력하세요" 
            placeholderTextColor={COLORS.textDim}
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
          />

          <Text style={COMMON_STYLES.label}>비밀번호</Text>
          <TextInput 
            style={COMMON_STYLES.input} 
            placeholder="비밀번호를 입력하세요" 
            placeholderTextColor={COLORS.textDim}
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={COMMON_STYLES.buttonPrimary} onPress={handleLogin}>
            <Text style={COMMON_STYLES.buttonText}>로그인 하기</Text>
          </TouchableOpacity>
        </View>

        {/* 하단 링크 */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30, gap: 15 }}>
          <TouchableOpacity onPress={() => setShowFindAccount(true)}>
            <Text style={{ fontSize: 16, color: COLORS.textDim }}>아이디/비번 찾기</Text>
          </TouchableOpacity>
          <Text style={{ color: COLORS.border }}>|</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>회원가입하기</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      {/* 모달 컴포넌트들 */}
      <AuthModal 
        isOpen={authModal.isOpen} 
        type={authModal.type} 
        message={authModal.message} 
        onConfirm={() => setAuthModal(prev => ({ ...prev, isOpen: false }))} 
      />
      <FindAccountModal isOpen={showFindAccount} onClose={() => setShowFindAccount(false)} />
    </SafeAreaView>
  );
}