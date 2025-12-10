import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Send, Bot, User } from 'lucide-react-native';
import { COLORS } from '../theme';

export default function ChatbotScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // 초기 메시지 및 추천 질문
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: '안녕하세요 어르신! 👋\n무엇을 도와드릴까요?',
      sender: 'bot',
      type: 'text'
    },
    {
      id: '2',
      sender: 'bot',
      type: 'options',
      options: [
        '신청 자격이 어떻게 되나요?',
        '필요한 서류는 어디서 뽑나요?',
        '대리인 신청도 가능한가요?'
      ]
    }
  ]);

  // 스크롤을 항상 최하단으로 이동
  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSend = async (text) => {
    const userMsg = text || inputText;
    if (!userMsg.trim()) return;

    // 1. 유저 메시지 추가
    const newUserMsg = { id: Date.now().toString(), text: userMsg, sender: 'user', type: 'text' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setLoading(true);

    // 2. AI 응답 시뮬레이션 (나중에 API 연결)
    setTimeout(() => {
      let botResponseText = "제가 잘 모르는 내용이에요. 다시 말씀해 주시겠어요?";

      // 간단한 키워드 매칭 로직 (임시)
      if (userMsg.includes('자격')) {
        botResponseText = "신청 자격은 만 65세 이상이시며, 소득 인정액이 선정 기준액 이하인 분들이 대상입니다. 기초연금 수급자라면 대부분 해당됩니다.";
      } else if (userMsg.includes('서류')) {
        botResponseText = "필요한 서류는 '신분증'과 '통장 사본'입니다. 주민센터에 방문하시면 담당자가 출력을 도와드릴 수 있습니다.";
      } else if (userMsg.includes('대리인')) {
        botResponseText = "네, 가능합니다! 자녀분이나 배우자분이 신분증과 위임장을 지참하시면 대신 신청하실 수 있습니다.";
      } else if (userMsg.includes('안녕')) {
        botResponseText = "안녕하세요! 오늘도 건강하고 행복한 하루 되세요. 😊";
      }

      const newBotMsg = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot', type: 'text' };
      setMessages(prev => [...prev, newBotMsg]);
      setLoading(false);
    }, 1000); // 1초 뒤 응답
  };

  // 메시지 렌더링
  const renderItem = ({ item }) => {
    // 1. 봇의 추천 질문 버튼
    if (item.type === 'options') {
      return (
        <View style={styles.optionsContainer}>
          <Text style={styles.optionLabel}>궁금한 점을 선택해보세요</Text>
          {item.options.map((opt, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.optionButton}
              onPress={() => handleSend(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    // 2. 일반 대화 메시지
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
        {!isUser && (
          <View style={styles.botIcon}>
            <Bot size={20} color="white" />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTitleBox}>
          <Bot size={24} color={COLORS.primary} fill={COLORS.primaryLight} />
          <Text style={styles.headerTitle}>AI 신청 도우미</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={24} color={COLORS.textDim} />
        </TouchableOpacity>
      </View>

      {/* 채팅 영역 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={scrollToBottom}
      />

      {/* 로딩 인디케이터 */}
      {loading && (
        <View style={{ padding: 10, alignItems: 'flex-start', marginLeft: 20 }}>
          <View style={[styles.bubble, styles.botBubble, { flexDirection: 'row', gap: 4 }]}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={{ color: COLORS.textDim, fontSize: 12 }}>답변을 작성 중입니다...</Text>
          </View>
        </View>
      )}

      {/* 입력창 */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="궁금한 내용을 입력하세요"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && { backgroundColor: '#e5e7eb' }]} 
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? "white" : "#9ca3af"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    padding: 16, backgroundColor: 'white', 
    borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    elevation: 2 
  },
  headerTitleBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  closeBtn: { padding: 4 },
  
  chatList: { padding: 20, paddingBottom: 40 },
  
  // 메시지 공통
  messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  
  botIcon: { 
    width: 36, height: 36, borderRadius: 18, 
    backgroundColor: COLORS.primary, 
    alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 4 
  },
  
  bubble: { maxWidth: '75%', padding: 14, borderRadius: 20 },
  userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: 'white', borderTopLeftRadius: 4, borderWidth: 1, borderColor: '#e5e7eb' },
  
  messageText: { fontSize: 16, lineHeight: 24 },
  userText: { color: 'white' },
  botText: { color: '#1f2937' },

  // 추천 질문 옵션 스타일
  optionsContainer: { marginLeft: 44, marginBottom: 20 },
  optionLabel: { fontSize: 14, color: '#6b7280', marginBottom: 8, marginLeft: 4 },
  optionButton: { 
    backgroundColor: '#fff7ed', 
    paddingVertical: 12, paddingHorizontal: 16, 
    borderRadius: 12, marginBottom: 8, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: '#fed7aa'
  },
  optionText: { color: '#9a3412', fontWeight: 'bold', fontSize: 15 },

  // 입력창 스타일
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    padding: 16, backgroundColor: 'white', 
    borderTopWidth: 1, borderTopColor: '#f3f4f6' 
  },
  input: { 
    flex: 1, backgroundColor: '#f3f4f6', 
    borderRadius: 24, paddingHorizontal: 20, paddingVertical: 12, 
    fontSize: 16, marginRight: 12, color: '#1f2937' 
  },
  sendBtn: { 
    width: 48, height: 48, borderRadius: 24, 
    backgroundColor: COLORS.primary, 
    alignItems: 'center', justifyContent: 'center' 
  },
});