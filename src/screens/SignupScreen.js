import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, COMMON_STYLES } from '../theme';
import { signupAPI } from '../api';
import AuthModal from '../components/AuthModal';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [authModal, setAuthModal] = useState({ isOpen: false, type: 'success', message: '', onConfirm: null });

  const handleSignup = async () => {
    if (!name || !id || !password) {
      setAuthModal({ isOpen: true, type: 'fail', message: '모든 정보를 입력해주세요.' });
      return;
    }
    if (password !== confirmPassword) {
      setAuthModal({ isOpen: true, type: 'fail', message: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    const result = await signupAPI({ id, password, name });
    if (result.success) {
      setAuthModal({
        isOpen: true, 
        type: 'success', 
        message: '회원가입이 완료되었습니다.\n로그인해주세요.',
        onConfirm: () => {
          setAuthModal(prev => ({ ...prev, isOpen: false }));
          navigation.goBack(); // 로그인 화면으로 돌아가기
        }
      });
    }
  };

  return (
    <SafeAreaView style={COMMON_STYLES.container}>
      {/* 헤더 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.surface }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>회원가입</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={[COMMON_STYLES.title, { fontSize: 24 }]}>환영합니다! 👋</Text>
        <Text style={COMMON_STYLES.subtitle}>서비스 이용을 위해 정보를 입력해주세요</Text>

        <View style={{ gap: 8 }}>
          <Text style={COMMON_STYLES.label}>이름</Text>
          <TextInput style={COMMON_STYLES.input} placeholder="홍길동" value={name} onChangeText={setName} />

          <Text style={COMMON_STYLES.label}>아이디</Text>
          <TextInput style={COMMON_STYLES.input} placeholder="아이디 입력" value={id} onChangeText={setId} autoCapitalize="none" />

          <Text style={COMMON_STYLES.label}>비밀번호</Text>
          <TextInput style={COMMON_STYLES.input} placeholder="비밀번호 입력" secureTextEntry value={password} onChangeText={setPassword} />

          <Text style={COMMON_STYLES.label}>비밀번호 확인</Text>
          <TextInput style={COMMON_STYLES.input} placeholder="비밀번호 재입력" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
        </View>

        <View style={{ marginTop: 32 }}>
          <TouchableOpacity style={COMMON_STYLES.buttonPrimary} onPress={handleSignup}>
            <Text style={COMMON_STYLES.buttonText}>가입 완료하고 시작하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AuthModal 
        isOpen={authModal.isOpen} 
        type={authModal.type} 
        message={authModal.message} 
        onConfirm={authModal.onConfirm || (() => setAuthModal(prev => ({ ...prev, isOpen: false })))} 
      />
    </SafeAreaView>
  );
}