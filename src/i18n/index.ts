import i18next from 'i18next';

// Import all translation files
import en from './locales/en.json';
import bn from './locales/bn.json';

const i18n = i18next.createInstance();

i18n.init({
  lng: 'en', // default language
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en
    },
    bn: {
      translation: bn
    }
  },
  interpolation: {
    escapeValue: false
  }
});

export { i18n };
