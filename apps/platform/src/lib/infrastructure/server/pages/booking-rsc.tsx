import { Suspense } from 'react';
import BookCoachPage from '../../client/pages/booking/book-coach';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';

interface BookingServerComponentProps {
    coachUsername: string;
}

export default function BookingServerComponent(
    props: BookingServerComponentProps,
) {
    return (
        <Suspense fallback={<DefaultLoadingWrapper />}>
            <BookCoachPage coachUsername={props.coachUsername} />
        </Suspense>
    );
}
