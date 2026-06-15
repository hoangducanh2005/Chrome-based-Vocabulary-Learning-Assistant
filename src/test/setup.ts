import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { chromeMock } from './mocks/chrome';

// Assign the mocked chrome API to the global window object
global.chrome = chromeMock as any;
