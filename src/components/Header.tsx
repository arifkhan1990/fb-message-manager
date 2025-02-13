import React from 'react';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  title: string;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  languages: { [key: string]: string };
}

export const Header: React.FC<HeaderProps> = ({
  title,
  currentLanguage,
  onLanguageChange,
  languages
}) => {
  return (
    <div className="header">
      <h2>{title}</h2>
      <LanguageSelector
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        languages={languages}
      />
    </div>
  );
}; 