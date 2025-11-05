import GroupCoachingCalendar from '../../../client/pages/workspace/calendar/group-coaching-calendar';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';

export default async function GroupCoachingCalendarServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    // Only coaches should access group coaching calendar
    if (!session.user.roles?.includes('coach')) {
        redirect('/workspace');
    }

    return <GroupCoachingCalendar />;
}