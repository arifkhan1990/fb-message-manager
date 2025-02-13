import React from 'react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  languages: { [key: string]: string };
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  languages
}) => {
  return (
    <div className="language-display">
      <select 
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="language-selector"
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}; 