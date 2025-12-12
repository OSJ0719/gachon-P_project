import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { loginAPI, signupAPI } from '../api';
import AuthModal from '../components/AuthModal';
import { COLORS, COMMON_STYLES } from '../theme';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [authModal, setAuthModal] = useState({
    isOpen: false,
    type: 'success',
    message: '',
    onConfirm: null,
  });

  const handleSignup = async () => {
    if (!name || !phone || !username || !password) {
      setAuthModal({
        isOpen: true,
        type: 'fail',
        message: '모든 정보를 입력해주세요.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setAuthModal({
        isOpen: true,
        type: 'fail',
        message: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    try {
      // 1) 회원가입 요청
      const signupResult = await signupAPI({ username, password, name, phone });

      if (!signupResult.success) {
        const serverMessage =
          signupResult.message ||
          signupResult.data?.message ||
          '회원가입에 실패했습니다.';
        setAuthModal({
          isOpen: true,
          type: 'fail',
          message: serverMessage,
        });
        return;
      }

      // 2) 회원가입 성공 후 → 바로 로그인 요청
      const loginResult = await loginAPI(username, password);

      if (!loginResult.success) {
        const serverMessage =
          loginResult.message ||
          loginResult.data?.message ||
          '회원가입은 완료되었지만 자동 로그인이 실패했습니다.\n로그인 화면에서 다시 시도해주세요.';
        setAuthModal({
          isOpen: true,
          type: 'fail',
          message: serverMessage,
        });
        return;
      }

      // 3) 로그인 성공 → 토큰 저장
      const token = loginResult.data?.accessToken;
      if (token) {
        await AsyncStorage.setItem('userToken', token);
      }

      // 4) 성공 모달 띄우고 → 온보딩(InitialSetup)으로 이동
      setAuthModal({
        isOpen: true,
        type: 'success',
        message: '회원가입이 완료되었습니다.\n맞춤 설정을 시작합니다.',
        onConfirm: () => {
          setAuthModal(prev => ({ ...prev, isOpen: false }));
          navigation.replace('InitialSetup', {
            user: { username, name, phone },
          });
        },
      });
    } catch (e) {
      console.error('signup error:', e);
      setAuthModal({
        isOpen: true,
        type: 'fail',
        message: '네트워크 오류가 발생했습니다.',
      });
    }
  };

  return (
    <SafeAreaView style={COMMON_STYLES.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.surface,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>회원가입</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={[COMMON_STYLES.title, { fontSize: 24 }]}>환영합니다! 👋</Text>
        <Text style={COMMON_STYLES.subtitle}>
          서비스 이용을 위해 정보를 입력해주세요
        </Text>

        <View style={{ gap: 8 }}>
          <Text style={COMMON_STYLES.label}>이름</Text>
          <TextInput
            style={COMMON_STYLES.input}
            placeholder="홍길동"
            value={name}
            onChangeText={setName}
          />

          <Text style={COMMON_STYLES.label}>전화번호</Text>
          <TextInput
            style={COMMON_STYLES.input}
            placeholder="010-0000-0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={COMMON_STYLES.label}>아이디</Text>
          <TextInput
            style={COMMON_STYLES.input}
            placeholder="아이디 입력"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={COMMON_STYLES.label}>비밀번호</Text>
          <TextInput
            style={COMMON_STYLES.input}
            placeholder="비밀번호 입력"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={COMMON_STYLES.label}>비밀번호 확인</Text>
          <TextInput
            style={COMMON_STYLES.input}
            placeholder="비밀번호 재입력"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
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
        onConfirm={
          authModal.onConfirm ||
          (() =>
            setAuthModal(prev => ({
              ...prev,
              isOpen: false,
            })))
        }
      />
    </SafeAreaView>
  );
}
