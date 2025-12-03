// src/components/BottomNavigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Calendar, Bot } from 'lucide-react-native';
import { COLORS } from '../theme';

export default function BottomNavigation({ activeTab = 'home', onNavigate }) {
  return (
    <View style={styles.container}>
      {/* 홈 버튼 */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => onNavigate('Home')}
      >
        <Home 
          size={28} 
          color={activeTab === 'home' ? COLORS.primary : COLORS.textDim} 
          fill={activeTab === 'home' ? COLORS.primaryLight : 'none'} 
        />
        <Text style={[styles.label, activeTab === 'home' && { color: COLORS.primary }]}>홈</Text>
      </TouchableOpacity>

      {/* 챗봇 버튼 (중앙 돌출형) */}
      <TouchableOpacity 
        style={styles.mainButton} 
        onPress={() => onNavigate('Chatbot')}
      >
        <Bot size={32} color="white" />
      </TouchableOpacity>

      {/* 캘린더 버튼 */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => onNavigate('Calendar')}
      >
        <Calendar 
          size={28} 
          color={activeTab === 'calendar' ? COLORS.primary : COLORS.textDim} 
        />
        <Text style={[styles.label, activeTab === 'calendar' && { color: COLORS.primary }]}>캘린더</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20, // 그림자
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', width: 60 },
  label: { fontSize: 12, fontWeight: 'bold', marginTop: 4, color: COLORS.textDim },
  mainButton: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    top: -25, // 위로 튀어나오게
    borderWidth: 4, borderColor: '#f3f4f6', // 배경색과 같은 테두리로 구멍 뚫린 느낌
    elevation: 5,
  },
});