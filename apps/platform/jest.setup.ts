import '@testing-library/jest-dom';
import React from 'react';

// Mock the useState hook
const originalReact = jest.requireActual('react');
jest.spyOn(React, 'useState').mockImplementation(originalReact.useState);

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Add necessary testing environment setup
beforeAll(() => {
  // Any global setup needed before tests run
});

afterAll(() => {
  // Clean up after all tests are done
  jest.clearAllMocks();
});