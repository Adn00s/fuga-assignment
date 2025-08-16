import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global test setup
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});
