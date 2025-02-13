import { useState, useEffect, useCallback } from 'react';
import { i18n } from '../i18n';
import { FacebookLanguageDetector } from '../services/LanguageService';

interface LanguageState {
  currentLanguage: string;
  isLoading: boolean;
  error: string | null;
}

export function useLanguage() {
  const [state, setState] = useState<LanguageState>({
    currentLanguage: i18n.language,
    isLoading: true,
    error: null
  });

  // Create languageDetector instance outside useEffect to persist it
  const languageDetector = new FacebookLanguageDetector();

  useEffect(() => {
    let isSubscribed = true;

    const initializeLanguage = async () => {
      try {
        // First try to get language from ChatManager
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        
        if (tab?.id) {
          // Request current language from ChatManager first
          await chrome.tabs.sendMessage(tab.id, { action: "GET_LANGUAGE" });
        }

        // If we don't get a response within 1 second, detect language directly
        setTimeout(async () => {
          if (isSubscribed && state.isLoading) {
            const detectedLanguage = await languageDetector.detectLanguage();
            if (isSubscribed) {
              await i18n.changeLanguage(detectedLanguage);
              setState(prev => ({
                ...prev,
                currentLanguage: detectedLanguage,
                isLoading: false,
                error: null
              }));

              // Notify ChatManager about detected language
              if (tab?.id) {
                await chrome.tabs.sendMessage(tab.id, {
                  action: "UPDATE_LANGUAGE",
                  language: detectedLanguage
                });
              }
            }
          }
        }, 1000);
      } catch (error) {
        console.error('Failed to initialize language:', error);
        if (isSubscribed) {
          setState(prev => ({
            ...prev,
            error: 'Failed to detect language',
            isLoading: false
          }));
        }
      }
    };

    // Handle language changes from ChatManager
    const handleLanguageChange = async (message: { 
      type: string; 
      language?: string; 
      error?: string 
    }) => {
      if (message.type === "LANGUAGE_CHANGED" && message.language && isSubscribed) {
        try {
          await i18n.changeLanguage(message.language);
          setState(prev => ({
            ...prev,
            currentLanguage: message.language,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Failed to change language:', error);
          if (isSubscribed) {
            setState(prev => ({
              ...prev,
              error: 'Failed to change language',
              isLoading: false
            }));
          }
        }
      }
    };

    // Start monitoring Facebook language changes
    languageDetector.startLanguageMonitoring(async (newLang) => {
      if (isSubscribed) {
        try {
          await i18n.changeLanguage(newLang);
          setState(prev => ({
            ...prev,
            currentLanguage: newLang,
            isLoading: false,
            error: null
          }));

          // Notify ChatManager about language change
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          const tab = tabs[0];
          if (tab?.id) {
            await chrome.tabs.sendMessage(tab.id, {
              action: "UPDATE_LANGUAGE",
              language: newLang
            });
          }
        } catch (error) {
          console.error('Failed to update language:', error);
        }
      }
    });

    // Listen for language changes from ChatManager
    chrome.runtime.onMessage.addListener(handleLanguageChange);

    // Initialize language
    initializeLanguage();

    return () => {
      isSubscribed = false;
      chrome.runtime.onMessage.removeListener(handleLanguageChange);
      languageDetector.stopLanguageMonitoring();
    };
  }, []);

  const getTranslation = useCallback((key: string, options?: any): string => {
    try {
      return i18n.t(key, options) as string;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key; // Fallback to key if translation fails
    }
  }, []);

  const forceLanguageUpdate = useCallback(async (newLanguage: string) => {
    try {
      await i18n.changeLanguage(newLanguage);
      setState(prev => ({
        ...prev,
        currentLanguage: newLanguage,
        error: null
      }));

      // Notify ChatManager about the language change
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, {
          action: "UPDATE_LANGUAGE",
          language: newLanguage
        });
      }
    } catch (error) {
      console.error('Failed to force language update:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to update language'
      }));
    }
  }, []);

  return {
    ...state,
    getTranslation,
    forceLanguageUpdate
  };
} 