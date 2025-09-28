import BookingServerComponent from '../../../../../../lib/infrastructure/server/pages/booking-rsc';

export default async function Page({
    params: paramsPromise,
}: {
    params: Promise<{ username: string }>;
}) {
    const params = await paramsPromise;

    return <BookingServerComponent coachUsername={params.username} />;
}
