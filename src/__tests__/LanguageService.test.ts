import { FacebookLanguageDetector } from '../services/LanguageService';

describe('FacebookLanguageDetector', () => {
  let detector: FacebookLanguageDetector;

  beforeEach(() => {
    // Reset the DOM
    document.documentElement.lang = '';
    document.cookie = '';
    document.body.className = '';
    document.head.innerHTML = '';
    detector = new FacebookLanguageDetector();
  });

  it('should detect language from HTML lang attribute', async () => {
    document.documentElement.lang = 'es';
    expect(await detector.detectLanguage()).toBe('es');
  });

  it('should detect language from meta og:locale', async () => {
    document.documentElement.lang = ''; // Clear HTML lang
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:locale');
    meta.setAttribute('content', 'fr_FR');
    document.head.appendChild(meta);
    expect(await detector.detectLanguage()).toBe('fr');
  });

  it('should detect language from cookies', async () => {
    document.cookie = 'locale=de_DE';
    expect(await detector.detectLanguage()).toBe('de');
  });

  it('should detect language from body class', async () => {
    document.body.className = 'some-class locale_it other-class';
    expect(await detector.detectLanguage()).toBe('it');
  });

  it('should normalize different language code formats', async () => {
    // Test ISO format
    document.documentElement.lang = 'pt-BR';
    expect(await detector.detectLanguage()).toBe('pt');

    // Test Facebook format
    document.documentElement.lang = 'ja_JP';
    expect(await detector.detectLanguage()).toBe('ja');

    // Test uppercase
    document.documentElement.lang = 'KO';
    expect(await detector.detectLanguage()).toBe('ko');
  });

  it('should fallback to English if no language is detected', async () => {
    expect(await detector.detectLanguage()).toBe('en');
  });
}); 