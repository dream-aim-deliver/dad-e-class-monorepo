import CoachCalendar from '../../../client/pages/workspace/calendar/coach-calendar';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import StudentCalendar from '../../../client/pages/workspace/calendar/student-calendar';

export default async function CalendarServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    if (session.user.roles?.includes('coach')) {
        return <CoachCalendar />;
    } else {
        return <StudentCalendar />;
    }
}
