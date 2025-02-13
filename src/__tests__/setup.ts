import '@testing-library/jest-dom';

// Mock chrome/browser API
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    update: jest.fn()
  }
} as any; 