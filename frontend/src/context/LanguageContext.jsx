import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, LANGUAGES } from '../utils/translations';
import { Globe, Check } from 'lucide-react';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('financeflow_language') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      try {
        localStorage.setItem('financeflow_language', langCode);
      } catch (e) {
        console.error('Failed to save language preference:', e);
      }
    }
  };

  const t = (key, fallbackText) => {
    const langDict = translations[language];
    if (langDict && langDict[key] !== undefined && langDict[key] !== '') {
      return langDict[key];
    }
    // Fallback to English
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return fallbackText || key;
  };

  const currentLanguageObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: LANGUAGES,
        currentLanguageObj,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Reusable Language Switcher Dropdown
export const LanguageSelector = ({ variant = 'default' }) => {
  const { language, setLanguage, languages, currentLanguageObj } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.lang-selector-dropdown-wrapper')) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`lang-selector-dropdown-wrapper ${variant}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lang-selector-btn"
        title="Change Language / भाषा बदलें"
      >
        <Globe size={15} className="lang-icon" />
        <span className="lang-name">{currentLanguageObj.native}</span>
        <span className="lang-code-tag">{currentLanguageObj.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          <div className="lang-dropdown-header">Select Language / भाषा चुनें</div>
          <div className="lang-dropdown-list">
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`lang-option-btn ${isSelected ? 'selected' : ''}`}
                >
                  <div className="lang-option-left">
                    <span className="lang-native-text">{lang.native}</span>
                    <span className="lang-english-text">{lang.name}</span>
                  </div>
                  {isSelected && <Check size={14} className="lang-check-icon" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .lang-selector-dropdown-wrapper {
          position: relative;
          display: inline-block;
          z-index: 150;
        }
        .lang-selector-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.4rem 0.75rem;
          color: var(--text-main);
          font-family: var(--font-main);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lang-selector-btn:hover {
          background: rgba(51, 65, 85, 0.9);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.2);
        }
        .lang-icon {
          color: #818cf8;
        }
        .lang-name {
          font-size: 0.825rem;
        }
        .lang-code-tag {
          font-size: 0.65rem;
          font-weight: 800;
          background: rgba(99, 102, 241, 0.25);
          color: #c7d2fe;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .lang-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          width: 220px;
          background: #0f172a;
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-lg);
          box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.75), 0 0 20px rgba(99, 102, 241, 0.15);
          padding: 0.4rem;
          animation: slideUp 0.18s ease-out;
          z-index: 200;
        }
        .lang-dropdown-header {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-dim);
          font-weight: 700;
          padding: 0.5rem 0.65rem 0.35rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 0.3rem;
        }
        .lang-dropdown-list {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          max-height: 280px;
          overflow-y: auto;
        }
        .lang-option-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.5rem 0.65rem;
          border-radius: var(--radius-sm);
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }
        .lang-option-btn:hover {
          background: rgba(99, 102, 241, 0.15);
          color: var(--text-main);
        }
        .lang-option-btn.selected {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25));
          color: white;
          font-weight: 700;
        }
        .lang-option-left {
          display: flex;
          flex-direction: column;
        }
        .lang-native-text {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .lang-english-text {
          font-size: 0.7rem;
          color: var(--text-dim);
        }
        .lang-check-icon {
          color: #818cf8;
        }
      `}</style>
    </div>
  );
};
