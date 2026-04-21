/**
 * SHA-256 hex digest via the Web Crypto API.
 *
 * Works in browsers (all modern) and Node.js ≥20 (where `globalThis.crypto`
 * is available). Returns a 64-character lowercase hex string.
 *
 * @param input Arbitrary string.
 * @returns Promise resolving to a 64-char lowercase hex SHA-256 digest.
 */
export async function sha256Hex(input: string): Promise<string> {
    const bytes = new TextEncoder().encode(input);
    const buffer = await globalThis.crypto.subtle.digest('SHA-256', bytes);
    const view = new Uint8Array(buffer);
    let hex = '';
    for (let i = 0; i < view.length; i += 1) {
        hex += view[i].toString(16).padStart(2, '0');
    }
    return hex;
}
