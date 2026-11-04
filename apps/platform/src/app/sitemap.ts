import type { MetadataRoute } from 'next';
import { createPublicCmsTrpcClient } from '../lib/infrastructure/server/utils/public-cms-trpc';

const LOCALES = ['de', 'en'] as const;
const PAGE_SIZE = 100;

/** Refresh public URLs periodically without requiring a full redeploy. */
export const revalidate = 3600;

function getBaseUrl(): string {
    return (
        process.env.NEXT_PUBLIC_APP_URL ||
        'http://localhost:3000'
    ).replace(/\/$/, '');
}

type CmsSuccess<T> = { success: true; data: T };
type CmsFailure = { success: false; data?: unknown };

function isSuccess<T>(response: CmsSuccess<T> | CmsFailure | null | undefined): response is CmsSuccess<T> {
    return !!response && response.success === true && !!response.data;
}

async function fetchAllPages<TItem>(
    fetchPage: (page: number) => Promise<TItem[]>,
): Promise<TItem[]> {
    const items: TItem[] = [];
    let page = 1;

    // List APIs do not expose total counts — stop when a page returns fewer than PAGE_SIZE.
    while (page < 100) {
        const batch = await fetchPage(page);
        items.push(...batch);
        if (batch.length < PAGE_SIZE) {
            break;
        }
        page += 1;
    }

    return items;
}

async function collectPublicCourseSlugs(locale: string): Promise<string[]> {
    const client = createPublicCmsTrpcClient(locale);
    const courses = await fetchAllPages(async (page) => {
        try {
            const response = (await client.listCourses.query({
                showFilter: 'public_live',
                includeCoachingPrices: false,
                pagination: { page, pageSize: PAGE_SIZE },
            })) as CmsSuccess<{ courses: Array<{ slug: string }> }> | CmsFailure;

            if (!isSuccess(response)) {
                return [];
            }
            return response.data.courses ?? [];
        } catch (error) {
            console.warn(`[sitemap] listCourses failed (locale=${locale}, page=${page}):`, error);
            return [];
        }
    });

    return [...new Set(courses.map((course) => course.slug).filter(Boolean))];
}

async function collectPublicPackageIds(locale: string): Promise<string[]> {
    const client = createPublicCmsTrpcClient(locale);
    const packages = await fetchAllPages(async (page) => {
        try {
            const response = (await client.listOffersPagePackages.query({
                pagination: { page, pageSize: PAGE_SIZE },
            })) as CmsSuccess<{ packages: Array<{ id: string | number }> }> | CmsFailure;

            if (!isSuccess(response)) {
                return [];
            }
            return response.data.packages ?? [];
        } catch (error) {
            console.warn(
                `[sitemap] listOffersPagePackages failed (locale=${locale}, page=${page}):`,
                error,
            );
            return [];
        }
    });

    return [
        ...new Set(
            packages
                .map((pkg) => String(pkg.id))
                .filter((id) => id.length > 0),
        ),
    ];
}

async function collectPublicCoachUsernames(locale: string): Promise<string[]> {
    const client = createPublicCmsTrpcClient(locale);
    const coaches = await fetchAllPages(async (page) => {
        try {
            const response = (await client.listCoaches.query({
                publicCoaches: true,
                pagination: { page, pageSize: PAGE_SIZE },
            })) as
                | CmsSuccess<{
                      coaches: Array<{ username: string; private?: boolean }>;
                  }>
                | CmsFailure;

            if (!isSuccess(response)) {
                return [];
            }
            // Defensive: never list hidden/private coaches even if the API filter slips.
            return (response.data.coaches ?? []).filter((coach) => coach.private !== true);
        } catch (error) {
            console.warn(`[sitemap] listCoaches failed (locale=${locale}, page=${page}):`, error);
            return [];
        }
    });

    return [...new Set(coaches.map((coach) => coach.username).filter(Boolean))];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getBaseUrl();
    const entries: MetadataRoute.Sitemap = [];

    // Fetch list data once (DE Accept-Language) — IDs/slugs are shared across locales.
    const [courseSlugs, packageIds, coachUsernames] = await Promise.all([
        collectPublicCourseSlugs('de'),
        collectPublicPackageIds('de'),
        collectPublicCoachUsernames('de'),
    ]);

    for (const locale of LOCALES) {
        for (const slug of courseSlugs) {
            entries.push({
                url: `${baseUrl}/${locale}/courses/${slug}`,
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        }

        for (const packageId of packageIds) {
            entries.push({
                url: `${baseUrl}/${locale}/packages/${packageId}`,
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }

        for (const username of coachUsernames) {
            entries.push({
                url: `${baseUrl}/${locale}/coaches/${encodeURIComponent(username)}`,
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    }

    return entries;
}
