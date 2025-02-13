export interface LanguageDetector {
  detectLanguage(): Promise<string>;
  startLanguageMonitoring(callback: (lang: string) => void): void;
  stopLanguageMonitoring(): void;
}

export class FacebookLanguageDetector implements LanguageDetector {
  private observer: MutationObserver | null = null;
  private lastDetectedLanguage: string = '';

  async detectLanguage(): Promise<string> {
    // Try multiple methods to detect Facebook's language setting
    const detectedLang = 
      this.getFromHtmlLang() || 
      this.getFromMetaLocale() || 
      this.getFromCookies() || 
      this.getFromBodyClass() || 
      this.getFromFacebookScript() ||
      'en';

    return this.normalizeLanguageCode(detectedLang);
  }

  startLanguageMonitoring(callback: (lang: string) => void): void {
    // Monitor HTML lang attribute changes
    this.observer = new MutationObserver(async () => {
      const newLang = await this.detectLanguage();
      if (newLang !== this.lastDetectedLanguage) {
        this.lastDetectedLanguage = newLang;
        callback(newLang);
      }
    });

    // Observe HTML and body for language-related changes
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });

    this.observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Monitor meta tags
    this.observer.observe(document.head, {
      childList: true,
      subtree: true
    });

    // Monitor Facebook's language switcher
    const languageSwitcher = document.querySelector('[aria-label*="language"], [aria-label*="Language"]');
    if (languageSwitcher) {
      this.observer.observe(languageSwitcher, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
  }

  stopLanguageMonitoring(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private getFromFacebookScript(): string | null {
    try {
      // Facebook stores language settings in multiple places
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        const content = script.textContent || '';
        
        // Try different patterns Facebook uses
        const patterns = [
          /"locale":"([a-z]{2}_[A-Z]{2})"/, // Standard format
          /"language_code":"([a-z]{2})"/, // Alternate format
          /\["locale"\],"([a-z]{2}_[A-Z]{2})"/, // Config format
          /\["language"\],"([a-z]{2})"/ // Simple format
        ];

        for (const pattern of patterns) {
          const match = content.match(pattern);
          if (match?.[1]) {
            return match[1];
          }
        }
      }
    } catch (error) {
      console.error('Error reading Facebook scripts:', error);
    }
    return null;
  }

  private getFromHtmlLang(): string | null {
    return document.documentElement.lang || null;
  }

  private getFromMetaLocale(): string | null {
    const metaTags = [
      'meta[property="og:locale"]',
      'meta[http-equiv="content-language"]',
      'meta[name="language"]'
    ];

    for (const selector of metaTags) {
      const meta = document.querySelector(selector);
      const content = meta?.getAttribute('content');
      if (content) return content;
    }

    return null;
  }

  private getFromCookies(): string | null {
    // Facebook stores language preference in cookies
    const cookies = document.cookie.split(';');
    const langCookie = cookies.find(cookie => 
      cookie.trim().startsWith('locale=') || 
      cookie.trim().startsWith('lang=')
    );

    return langCookie ? langCookie.split('=')[1] : null;
  }

  private getFromBodyClass(): string | null {
    // Facebook often adds language class to body
    const bodyClasses = document.body.className.split(' ');
    const langClass = bodyClasses.find(cls => cls.match(/^locale_[a-z]{2}/i));
    return langClass ? langClass.replace('locale_', '') : null;
  }

  private normalizeLanguageCode(lang: string): string {
    if (!lang) return 'en';

    // Handle Facebook's language codes
    if (lang.includes('_')) {
      const [language] = lang.split('_');
      return language.toLowerCase();
    }

    // Handle ISO codes
    if (lang.includes('-')) {
      const [language] = lang.split('-');
      return language.toLowerCase();
    }

    // Special case for Bangla/Bengali
    if (lang.toLowerCase() === 'bn' || lang.toLowerCase() === 'ben') {
      return 'bn';
    }

    return lang.toLowerCase();
  }
} 