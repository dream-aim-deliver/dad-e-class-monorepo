import { extractListParams } from '../../../lib/infrastructure/server/utils/extract-params';
import CoachingServerComponent from '../../../lib/infrastructure/server/pages/coaching-rsc';

export default async function Page({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    const topics = extractListParams(searchParams.topics);
    return <CoachingServerComponent topics={topics} />;
}
