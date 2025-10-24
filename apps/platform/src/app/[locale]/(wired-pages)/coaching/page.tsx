import { extractListParams } from '../../../../lib/infrastructure/server/utils/extract-params';
import CoachingPageServerComponent from '../../../../lib/infrastructure/server/pages/coaching-page-rsc';

export default async function Page({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    const topics = extractListParams(searchParams.topics);
    return <CoachingPageServerComponent topics={topics} />;
}
