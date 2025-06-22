import OffersServerComponent from '../../../lib/infrastructure/server/pages/offers-rsc';

export default async function Page({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    const topicsParams = searchParams.topics;
    let topics: string[] | undefined;
    if (topicsParams && Array.isArray(topicsParams)) {
        topics = topicsParams;
    } else if (typeof topicsParams === 'string') {
        topics = topicsParams.split(',');
    }
    return <OffersServerComponent topics={topics} />;
}
