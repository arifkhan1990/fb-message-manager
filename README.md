
```markdown:README.md
# Facebook Chat Manager

A powerful browser extension that helps you efficiently manage Facebook Messenger conversations with bulk actions support and multilingual interface.

![img_alt](https://github.com/arifkhan1990/fb-message-manager/blob/4e809a639095688176f0c3c6495ebb637c5987d7/assets/193930.png)

## ✨ Features

- 🗑️ **Bulk Message Management**
  - Mass delete conversations
  - Mass archive conversations
  - Smart chat selection
  - Select all/individual chats

- 🌐 **Multilingual Support**
  - English (en)
  - Bengali (bn)
  - Automatic language detection
  - Real-time language switching

- 💡 **Smart Interface**
  - Collapsible sidebar
  - Toggle interface button
  - Responsive design
  - Confirmation dialogs
  - Status notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome/Firefox browser

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd facebook-message-manager
```

2. Install dependencies
```bash
npm install
or
bun install
```

### Development

Run in Chrome:
```bash
npm run dev
```

Run in Firefox:
```bash
npm run dev:firefox
```

### Production Build

For Chrome:
```bash
npm run build
npm run zip
```

For Firefox:
```bash
npm run build:firefox
npm run zip:firefox
```

### Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📁 Project Structure

```
├── entrypoints/
│   ├── content.ts      # Content script
│   ├── background.ts   # Background script
│   └── popup/         # Extension popup
├── src/
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # Core services
│   ├── i18n/          # Translations
│   ├── styles/        # CSS styles
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
    |__tests__/         # Test files
```

## 🛠️ Tech Stack

- React 19
- TypeScript
- WXT (Web Extension Tools)
- i18next for internationalization
- Jest for testing

## 🔒 Permissions

The extension requires the following permissions:
- Tabs access
- Facebook.com domain access
- Messenger.com domain access

## 🌍 Supported Platforms

- Facebook Messages (facebook.com/messages)
- Messenger.com

## 🌐 Browser Compatibility

- Chrome/Chromium (v80+)
- Firefox (v75+)
- Microsoft Edge (v80+)

## 🔍 Core Features

### Chat Management
```typescript
const handleArchiveSelected = () => {
  showConfirmDialog(
    getTranslation('Confirm archive'),
    getTranslation('Are you sure you want to archive selected chats?'),
    archiveSelectedChats
  );
};
```

### Language Detection
```typescript
private normalizeLanguageCode(lang: string): string {
  if (!lang) return 'en';
  
  // Handle Facebook's language codes
  if (lang.includes('_')) {
    const [language] = lang.split('_');
    return language.toLowerCase();
  }
  // ... more detection logic
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

1. **Code Style**
   - Use TypeScript for all new code
   - Follow React best practices
   - Maintain test coverage
   - Document complex functions

2. **Testing Requirements**
   - Write unit tests for new features
   - Maintain existing tests
   - Test across supported browsers

3. **Language Support**
   - Add translations in `src/i18n/locales/`
   - Test RTL languages if adding support
   - Verify language detection

## ⚠️ Known Issues

1. Language detection might fail on some Facebook UI versions
2. Bulk actions may be rate-limited by Facebook
3. Some UI elements might need adjustment for RTL languages

## 📝 Error Handling

The extension includes comprehensive error handling:
```typescript
export const ErrorMessages = {
  INITIALIZATION: {
    code: 'INIT_ERROR',
    message: 'Failed to initialize Chat Manager. Please refresh the page and try again.'
  },
  // ... more error messages
};
```

## 🧪 Testing

The extension includes comprehensive test coverage:
```typescript
describe('ChatManager', () => {
  describe('Language Detection', () => {
    it('should detect language from HTML lang attribute', async () => {
      document.documentElement.lang = 'bn';
      await chatManager.initialize();
      expect(i18n.language).toBe('bn');
    });
    // ... more tests
  });
});
```

## 🙏 Acknowledgments

- Built with [WXT](https://wxt.dev)
- Uses React for UI components
- i18next for internationalization
- Jest for testing framework

---

Made with ❤️ by Arif Khan
```

This README provides:
1. Clear installation and usage instructions
2. Comprehensive feature documentation
3. Code examples
4. Project structure
5. Contributing guidelines
6. Testing information
7. Known issues and error handling
8. Support information

The documentation is structured to be both user-friendly and developer-friendly, with clear sections for both audiences.
