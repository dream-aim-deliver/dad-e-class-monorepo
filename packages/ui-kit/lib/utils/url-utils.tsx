/**
 * Generates a favicon URL based on the provided website URL.
 * Tries to fetch the favicon from common locations and falls back to a default favicon if it fails.
 * @param url The URL of the website to fetch the favicon from.
 * @returns The favicon URL or an empty string if not available.
 * @example
 *   const faviconUrl = getFaviconUrl("https://example.com");
 */
export const getFaviconUrl = (url: string): string => {
    if (!url) return "";
    try {
        // Ensure URL has a protocol
        let processedUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            processedUrl = `https://${url}`;
        }
        // Parse the URL
        const urlObject = new URL(processedUrl);
        const hostname = urlObject.hostname;
        if (!hostname) return "";
        // Use Google's favicon service with cache buster to prevent stale icons
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64&v=${Date.now()}`;
    } catch (error) {
        console.warn(`Failed to generate favicon URL for: ${url}`, error);
        return "";
    }
};