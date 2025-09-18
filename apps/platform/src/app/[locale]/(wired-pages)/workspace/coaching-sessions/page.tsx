import CoachingSessionsServerComponent from 'apps/platform/src/lib/infrastructure/server/pages/workspace/coaching-sessions-rsc';

export default async function Page({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    // TODO: handle searchParams if needed

    return <CoachingSessionsServerComponent />;
}
