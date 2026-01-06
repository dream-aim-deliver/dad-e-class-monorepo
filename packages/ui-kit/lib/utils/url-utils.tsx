/**
 * Generates a favicon URL based on the provided website URL.
 * Uses a local API route that fetches favicons with multiple fallbacks:
 * 1. Direct favicon.ico from the domain
 * 2. Parse HTML for link rel="icon" tags
 * 3. DuckDuckGo favicon service
 * 4. Google favicon service
 *
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
        // Use local API route with fallback chain for resilient favicon fetching
        return `/api/favicon?domain=${encodeURIComponent(hostname)}`;
    } catch (error) {
        console.warn(`Failed to generate favicon URL for: ${url}`, error);
        return "";
    }
};