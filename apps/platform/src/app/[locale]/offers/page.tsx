import OffersServerComponent from '../../../lib/infrastructure/server/pages/offers-rsc';

export default async function Page({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    const topicsParams = searchParams.topics;
    let topics: string[] | undefined;

    if (topicsParams) {
        const topicArray = Array.isArray(topicsParams)
            ? topicsParams
            : topicsParams.split(',');

        const filteredTopics = topicArray.filter(
            (topic) => topic.trim() !== '',
        );
        topics = filteredTopics.length > 0 ? filteredTopics : undefined;
    }
    return <OffersServerComponent topics={topics} />;
}
