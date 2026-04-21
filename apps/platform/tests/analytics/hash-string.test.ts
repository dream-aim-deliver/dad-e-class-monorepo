import { describe, it, expect } from 'vitest';
import { sha256Hex } from '../../src/lib/infrastructure/common/utils/hash-string';

describe('sha256Hex', () => {
    it('returns the standard SHA-256 hex digest of an empty string', async () => {
        const digest = await sha256Hex('');
        expect(digest).toBe(
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        );
    });

    it('returns the standard SHA-256 hex digest of "abc"', async () => {
        const digest = await sha256Hex('abc');
        expect(digest).toBe(
            'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
        );
    });

    it('is deterministic — same input always yields same output', async () => {
        const a = await sha256Hex('user-42');
        const b = await sha256Hex('user-42');
        expect(a).toBe(b);
    });

    it('handles unicode input correctly', async () => {
        const digest = await sha256Hex('über');
        expect(digest).toHaveLength(64);
        expect(digest).toMatch(/^[0-9a-f]{64}$/);
    });
});
