import CoachingSessionsServerComponent from '../../../../..//lib/infrastructure/server/pages/workspace/coaching-session-rsc';

export default async function Page({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    // TODO: handle searchParams if needed

    return <CoachingSessionsServerComponent />;
}
