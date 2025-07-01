import { extractListParams } from '../../../lib/infrastructure/server/utils/extract-params';
import OffersServerComponent from '../../../lib/infrastructure/server/pages/offers-rsc';

export default async function Page({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    const topics = extractListParams(searchParams.topics);
    return <OffersServerComponent topics={topics} />;
}
