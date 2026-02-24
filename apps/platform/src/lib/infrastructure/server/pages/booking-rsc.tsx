import { Suspense } from 'react';
import BookCoachPage from '../../client/pages/booking/book-coach';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import getSession from '../config/auth/get-session';
import { redirect } from 'next/navigation';
import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';

interface BookingServerComponentProps {
    coachUsername: string;
    sessionId?: string;
    returnTo?: string;
    lessonComponentId?: string;
    courseSlug?: string;
}

export default async function BookingServerComponent(
    props: BookingServerComponentProps,
) {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    if (session.user.name === props.coachUsername) {
        // TODO: fill in localized error message
        throw new Error('You cannot book a session with yourself');
    }

    let sessionIdNumber: number | undefined = undefined;
    if (props.sessionId) {
        sessionIdNumber = parseInt(props.sessionId, 10);
        if (isNaN(sessionIdNumber)) {
            throw new Error('Invalid session ID');
        }
    }

    // Prefetch coach introduction for header display
    prefetch(trpc.getCoachIntroduction.queryOptions({ coachUsername: props.coachUsername }));

    // Prefetch coach availability
    prefetch(trpc.getCoachAvailability.queryOptions({ coachUsername: props.coachUsername }));

    // Prefetch available coachings for the AvailableCoachings section
    prefetch(trpc.listAvailableCoachings.queryOptions({}));

    // Prefetch coaching offerings for the BuyCoachingSession section
    prefetch(trpc.listCoachingOfferings.queryOptions({}));

    // Prefetch student coaching sessions to determine if briefing is required (first booking per coach)
    prefetch(trpc.listStudentCoachingSessions.queryOptions({}));

    // Prefetch student coaching session if sessionId is provided
    if (sessionIdNumber) {
        prefetch(trpc.getStudentCoachingSession.queryOptions({ id: sessionIdNumber }));
    }

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <BookCoachPage coachUsername={props.coachUsername} sessionId={sessionIdNumber} returnTo={props.returnTo} lessonComponentId={props.lessonComponentId} courseSlug={props.courseSlug} />
            </Suspense>
        </HydrateClient>
    );
}
