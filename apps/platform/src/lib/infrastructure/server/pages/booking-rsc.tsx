import { Suspense } from 'react';
import BookCoachPage from '../../client/pages/booking/book-coach';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import getSession from '../config/auth/get-session';
import { redirect } from 'next/navigation';

interface BookingServerComponentProps {
    coachUsername: string;
    sessionId?: string;
    returnTo?: string;
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

    return (
        <Suspense fallback={<DefaultLoadingWrapper />}>
            <BookCoachPage coachUsername={props.coachUsername} sessionId={sessionIdNumber} returnTo={props.returnTo} />
        </Suspense>
    );
}
