import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 기본값 'medium'
  const [fontSizeMode, setFontSizeMode] = useState('medium');

  // 글자 크기 배율 계산 (small: 0.85배, medium: 1배, large: 1.2배)
  const scale = fontSizeMode === 'small' ? 0.85 : fontSizeMode === 'large' ? 1.2 : 1;

  return (
    <ThemeContext.Provider value={{ fontSizeMode, setFontSizeMode, scale }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);