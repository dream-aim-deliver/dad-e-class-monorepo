import BookingServerComponent from '../../../../../../lib/infrastructure/server/pages/booking-rsc';

export default async function Page({
    params: paramsPromise,
    searchParams: searchParamsPromise,
}: {
    params: Promise<{ username: string }>;
    searchParams: Promise<{ sessionId: string; returnTo?: string }>;
}) {
    const params = await paramsPromise;
    const searchParams = await searchParamsPromise;

    return <BookingServerComponent coachUsername={params.username} sessionId={searchParams.sessionId} returnTo={searchParams.returnTo} />;
}
