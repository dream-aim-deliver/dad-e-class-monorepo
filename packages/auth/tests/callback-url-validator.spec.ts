import { describe, it, expect } from 'vitest';
import { validateCallbackUrl } from '../src/infrastructure/utils/callback-url-validator';

describe('validateCallbackUrl: coach application deep link (?apply=coach)', () => {
  it('preserves the query string for the coach application deep link', () => {
    expect(validateCallbackUrl('/de/workspace/profile?apply=coach')).toBe(
      '/de/workspace/profile?apply=coach',
    );
  });

  it('preserves the deep link alongside other query params', () => {
    expect(
      validateCallbackUrl('/de/workspace/profile?tab=professional&apply=coach'),
    ).toBe('/de/workspace/profile?tab=professional&apply=coach');
  });

  it('still rejects an absolute/external URL even when it carries the apply=coach param', () => {
    expect(
      validateCallbackUrl('https://evil.example.com/?apply=coach', {
        defaultUrl: '/de',
      }),
    ).toBe('/de');
  });

  it('still rejects a protocol-relative URL carrying the apply=coach param', () => {
    expect(
      validateCallbackUrl('//evil.example.com/?apply=coach', {
        defaultUrl: '/de',
      }),
    ).toBe('/de');
  });
});
