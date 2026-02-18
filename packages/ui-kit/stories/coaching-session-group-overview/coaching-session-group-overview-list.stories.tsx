import type { Meta, StoryObj } from '@storybook/react-vite';
import { CoachingSessionGroupOverviewList } from '../../lib/components/coaching-session-group-overview/coaching-session-group-overview-list';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    CoachingSessionGroupOverviewCard,
    CoachingSessionGroupOverviewCardProps,
} from '../../lib/components/coaching-session-group-overview/coaching-session-group-overview-card';

const meta: Meta<typeof CoachingSessionGroupOverviewList> = {
    title: 'Components/CoachingSessionGroupOverviewComponents/CoachingSessionGroupOverviewList',
    component: CoachingSessionGroupOverviewList,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Locale for translations',
        },
    },
};

export default meta;

type Story = StoryObj<typeof CoachingSessionGroupOverviewList>;

// Mock callback functions
const mockCallbacks = {
    onClickCourse: () => alert('Course clicked'),
    onClickGroup: () => alert('Group clicked'),
    onClickCreator: () => alert('Creator clicked'),
    onClickJoinMeeting: () => alert('Join meeting clicked'),
    onClickReschedule: () => alert('Reschedule clicked'),
    onClickCancel: () => alert('Cancel clicked'),
    onClickDownloadRecording: () => alert('Download recording clicked'),
    onClickDecline: () => alert('Decline clicked'),
    onClickAccept: () => alert('Accept clicked'),
    onClickReviewCoachingSession: () => alert('Review coaching session clicked'),
    onClickRateCallQuality: () => alert('Rate call quality clicked'),
    onClickScheduleSession: () => alert('Schedule session clicked'),
};

// Base session properties
const baseSessionProps = {
    duration: 60,
    startTime: '10:00',
    endTime: '11:00',
    withinCourse: true,
    courseName: 'Advanced Brand Identity Design',
    courseImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    groupName: 'Design Professionals',
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    ...mockCallbacks,
};

// Sample sessions for the list
const sampleSessions: CoachingSessionGroupOverviewCardProps[] = [
    {
        ...baseSessionProps,
        locale: 'en' as TLocale,
        title: 'Design Principles Discussion',
        date: new Date('2025-03-20T10:00:00'),
        userType: 'student',
        status: 'ongoing',
        meetingLink: 'https://meet.example.com/session',
    },
    {
        ...baseSessionProps,
        locale: 'en' as TLocale,
        title: 'Color Theory Workshop',
        date: new Date('2025-03-21T14:00:00'),
        userType: 'student',
        status: 'upcoming-editable',
        hoursLeftToEdit: 12,
    },
    {
        ...baseSessionProps,
        locale: 'en' as TLocale,
        title: 'Typography Fundamentals',
        date: new Date('2025-03-18T09:00:00'),
        userType: 'student',
        status: 'ended',
        averageRating: 4.7,
        reviewCount: 15,
        studentCount: 20,
        onClickReadReviews: () => alert('Read reviews clicked'),
    },
    {
        ...baseSessionProps,
        locale: 'en' as TLocale,
        title: 'Logo Design Critique',
        date: new Date('2025-03-19T16:00:00'),
        userType: 'coach',
        status: 'upcoming-editable',
        hoursLeftToEdit: 8,
    },
    {
        ...baseSessionProps,
        locale: 'en' as TLocale,
        title: 'Branding Strategy Session',
        date: new Date('2025-03-22T11:00:00'),
        userType: 'coach',
        status: 'ended',
        averageRating: 4.5,
        reviewCount: 12,
        studentCount: 25,
        onClickReadReviews: () => alert('Read reviews clicked'),
    },
    {
        locale: 'en' as TLocale,
        title: 'Portfolio Review',
        userType: 'student',
        status: 'unscheduled',
        duration: 45,
    },
    {
        ...baseSessionProps,
        locale: 'en' as TLocale,
        title: 'Brand Strategy Deep Dive',
        userType: 'coach',
        status: 'unscheduled',
        duration: 90,
        withinCourse: true,
    },
];

export const Default: Story = {
    args: {
        locale: 'en',
        children: sampleSessions.map((session, index) => (
            <CoachingSessionGroupOverviewCard key={index} {...session} />
        )),
    },
};

export const EmptyList: Story = {
    args: {
        locale: 'en',
        children: [],
    },
};

export const SingleItem: Story = {
    args: {
        locale: 'en',
        children: [
            <CoachingSessionGroupOverviewCard key={0} {...sampleSessions[0]} />
        ],
    },
};