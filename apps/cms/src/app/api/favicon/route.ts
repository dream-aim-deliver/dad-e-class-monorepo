import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for favicon URLs and data
const faviconUrlCache = new Map<string, { url: string; timestamp: number }>();
const faviconDataCache = new Map<string, { data: ArrayBuffer; contentType: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Favicon API Route
 * Fetches and proxies favicons with fallback chain: direct → HTML parsing → DuckDuckGo → Google
 * Proxies the image to avoid Next.js Image domain configuration issues.
 *
 * Usage: GET /api/favicon?domain=example.com
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain parameter required' }, { status: 400 });
    }

    // Clean the domain
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    // Check data cache first (already fetched image)
    const cachedData = faviconDataCache.get(cleanDomain);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
        return new NextResponse(cachedData.data, {
            headers: {
                'Content-Type': cachedData.contentType,
                'Cache-Control': 'public, max-age=86400', // 24 hours
            },
        });
    }

    // Check URL cache (know which URL to fetch)
    let faviconUrl: string;
    const cachedUrl = faviconUrlCache.get(cleanDomain);
    if (cachedUrl && Date.now() - cachedUrl.timestamp < CACHE_TTL) {
        faviconUrl = cachedUrl.url;
    } else {
        // Find the best favicon URL
        faviconUrl = await getFaviconWithFallback(cleanDomain);
        faviconUrlCache.set(cleanDomain, { url: faviconUrl, timestamp: Date.now() });
    }

    // Fetch and proxy the favicon
    try {
        const response = await fetch(faviconUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; FaviconBot/1.0)',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch favicon' }, { status: 502 });
        }

        const data = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/x-icon';

        // Cache the fetched data
        faviconDataCache.set(cleanDomain, { data, contentType, timestamp: Date.now() });

        return new NextResponse(data, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // 24 hours
            },
        });
    } catch (error) {
        console.error(`Failed to proxy favicon for ${cleanDomain}:`, error);
        return NextResponse.json({ error: 'Failed to fetch favicon' }, { status: 502 });
    }
}

async function getFaviconWithFallback(domain: string): Promise<string> {
    // Strategy 1: Try Google's endpoint FIRST with max size (256px) - most reliable and best quality
    const googleUrl = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=256`;
    if (await isValidImage(googleUrl)) {
        return googleUrl;
    }

    // Strategy 2: Try parsing HTML for high-quality icons (apple-touch-icon, 96px+)
    const htmlFavicon = await extractFaviconFromHtml(domain, true);
    if (htmlFavicon && await isValidImage(htmlFavicon)) {
        return htmlFavicon;
    }

    // Strategy 3: Try any HTML favicon (including smaller ones)
    const anyHtmlFavicon = await extractFaviconFromHtml(domain, false);
    if (anyHtmlFavicon && await isValidImage(anyHtmlFavicon)) {
        return anyHtmlFavicon;
    }

    // Strategy 4: Try direct favicon.ico
    const directUrl = `https://${domain}/favicon.ico`;
    if (await isValidImage(directUrl)) {
        return directUrl;
    }

    // Strategy 5: Try DuckDuckGo as last resort
    const duckDuckGoUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    if (await isValidImage(duckDuckGoUrl)) {
        return duckDuckGoUrl;
    }

    // Final fallback: return Google anyway (it returns a default icon)
    return googleUrl;
}

async function isValidImage(url: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            redirect: 'follow',
        });

        clearTimeout(timeoutId);

        if (!response.ok) return false;

        const contentType = response.headers.get('content-type') || '';
        return contentType.includes('image') || contentType.includes('icon');
    } catch {
        return false;
    }
}

async function extractFaviconFromHtml(domain: string, largeOnly: boolean = false): Promise<string | null> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`https://${domain}`, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; FaviconBot/1.0)',
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) return null;

        const html = await response.text();

        // Large icons only (96px+): apple-touch-icon and icons with explicit large sizes
        const largePatterns = [
            // Apple touch icon (highest quality, usually 180x180)
            /<link[^>]*rel=["']apple-touch-icon(?:-precomposed)?["'][^>]*href=["']([^"']+)["']/i,
            /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon(?:-precomposed)?["']/i,
            // Icons with sizes attribute (96px or larger)
            /<link[^>]*rel=["']icon["'][^>]*sizes=["'](?:192x192|180x180|152x152|144x144|128x128|96x96)["'][^>]*href=["']([^"']+)["']/i,
            /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']icon["'][^>]*sizes=["'](?:192x192|180x180|152x152|144x144|128x128|96x96)["']/i,
        ];

        // Any icon (including small 16x16, 32x32)
        const anyPatterns = [
            /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
            /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
        ];

        const patterns = largeOnly ? largePatterns : [...largePatterns, ...anyPatterns];

        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                let faviconUrl = match[1];

                // Handle relative URLs
                if (faviconUrl.startsWith('//')) {
                    faviconUrl = `https:${faviconUrl}`;
                } else if (faviconUrl.startsWith('/')) {
                    faviconUrl = `https://${domain}${faviconUrl}`;
                } else if (!faviconUrl.startsWith('http')) {
                    faviconUrl = `https://${domain}/${faviconUrl}`;
                }

                return faviconUrl;
            }
        }

        return null;
    } catch {
        return null;
    }
}
