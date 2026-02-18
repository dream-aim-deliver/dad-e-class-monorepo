import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScheduleSession } from '../../lib/components/calendar/schedule-session';
import { useState } from 'react';
import React from 'react';

// Mock provider for locale
const LocaleProvider: React.FC<{ locale: string; children: React.ReactNode }> = ({ locale, children }) => {
    return <div data-locale={locale}>{children}</div>;
};

const meta: Meta<typeof ScheduleSession> = {
    title: 'Components/ScheduleSession',
    component: ScheduleSession,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story, context) => (
            <LocaleProvider locale={context.args.locale || 'en'}>
                <Story />
            </LocaleProvider>
        ),
    ],
    argTypes: {
        user: {
            control: 'select',
            options: ['student', 'coach'],
            defaultValue: 'student',
            description: 'The type of user viewing the session (student or coach).',
        },
        isError: {
            control: 'boolean',
            defaultValue: false,
            description: 'Whether the input fields should display an error state.',
        },
        isLoading: {
            control: 'boolean',
            defaultValue: false,
            description: 'Whether the send request button is in a loading state.',
        },
        groupSession: {
            control: 'boolean',
            defaultValue: false,
            description: 'Whether the session is a group session.',
        },
        course: {
            control: 'boolean',
            defaultValue: true,
            description: 'Whether the session is associated with a course.',
        },
        coachImageUrl: {
            control: 'text',
            defaultValue: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
            description: 'URL for the coach’s avatar image.',
        },
        courseImageUrl: {
            control: 'text',
            defaultValue: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            description: 'URL for the course image.',
        },
        dateValue: {
            control: 'date',
            defaultValue: new Date('2025-12-31'),
            description: 'The selected date for the session.',
        },
        timeValue: {
            control: 'text',
            defaultValue: '12:00',
            description: 'The selected start time for the session (HH:MM format).',
        },
        coachName: {
            control: 'text',
            defaultValue: 'Coach Name',
            description: 'The full name of the coach.',
        },
        courseTitle: {
            control: 'text',
            defaultValue: 'Course Title',
            description: 'The title of the course.',
        },
        groupName: {
            control: 'text',
            defaultValue: 'Group Name',
            description: 'The name of the group for group sessions.',
        },
        sessionName: {
            control: 'text',
            defaultValue: 'Full Immersion (60min)',
            description: 'The name of the session.',
        },
        onDateChange: {
            action: 'dateChanged',
            description: 'Callback function triggered when the date changes.',
        },
        onTimeChange: {
            action: 'timeChanged',
            description: 'Callback function triggered when the time changes.',
        },
        onClickDiscard: {
            action: 'discardClicked',
            description: 'Callback function triggered when the discard button is clicked.',
        },
        onClickSendRequest: {
            action: 'sendRequestClicked',
            description: 'Callback function triggered when the send request button is clicked.',
        },
        onClickCoach: {
            action: 'coachClicked',
            description: 'Callback function triggered when the coach button is clicked.',
        },
        onClickCourse: {
            action: 'courseClicked',
            description: 'Callback function triggered when the course button is clicked.',
        },
        onClickGroup: {
            action: 'groupClicked',
            description: 'Callback function triggered when the group button is clicked.',
        },
        locale: {
            control: 'select',
            options: ['en', 'de'],
            defaultValue: 'en',
            description: 'The locale for the component (e.g., for date formatting and translations).',
        },
    },
};

export default meta;

type Story = StoryObj<typeof ScheduleSession>;

// Wrapper component to provide controlled state for dateValue and timeValue
const ScheduleSessionWithState: React.FC<React.ComponentProps<typeof ScheduleSession>> = (props) => {
    const [dateValue, setDateValue] = useState<Date>(
        props.dateValue instanceof Date ? props.dateValue : new Date('2025-12-31')
    );
    const [timeValue, setTimeValue] = useState(props.timeValue || '12:00');

    return (
        <div className="flex flex-col items-center w-full">
            <ScheduleSession
                {...props}
                dateValue={dateValue}
                timeValue={timeValue}
                onDateChange={(value) => {
                    setDateValue(new Date(value));
                    props.onDateChange?.(value);
                }}
                onTimeChange={(value) => {
                    setTimeValue(value);
                    props.onTimeChange?.(value);
                }}
                locale={props.locale || 'en'}
            />
        </div>
    );
};

// Shared button click handlers for alerts
const handleCoachButtonClick = () => alert('Coach selected!');
const handleCourseButtonClick = () => alert('Course selected!');
const handleGroupButtonClick = () => alert('Group selected!');
const handleDiscardButtonClick = () => alert('Session discarded!');
const handleSendRequestButtonClick = () => alert('Session request sent!');

export const Default: Story = {
    render: (args) => <ScheduleSessionWithState {...args} />,
    args: {
        user: 'student',
        isError: false,
        isLoading: false,
        groupSession: false,
        course: true,
        coachImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        courseImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        dateValue: new Date('2025-12-31'),
        timeValue: '12:00',
        coachName: 'Coach Name',
        courseTitle: 'Course Title',
        groupName: 'Group Name',
        sessionName: 'Full Immersion (60min)',
        locale: 'en',
        onClickCoach: handleCoachButtonClick,
        onClickCourse: handleCourseButtonClick,
        onClickGroup: handleGroupButtonClick,
        onClickDiscard: handleDiscardButtonClick,
        onClickSendRequest: handleSendRequestButtonClick,
    },
    parameters: {
        docs: {
            description: {
                story: 'The default ScheduleSession component in its form state (English), allowing users to select a date, time, and submit or discard the session request.',
            },
        },
    },
};

export const AsCoach: Story = {
    render: (args) => <ScheduleSessionWithState {...args} />,
    args: {
        ...Default.args,
        user: 'coach',
    },
    parameters: {
        docs: {
            description: {
                story: 'A view of the ScheduleSession component as seen by a coach, hiding the coach information.',
            },
        },
    },
};

export const WithError: Story = {
    render: (args) => <ScheduleSessionWithState {...args} />,
    args: {
        ...Default.args,
        isError: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'A view of the ScheduleSession component with an error state, showing a red border around inputs and an error message.',
            },
        },
    },
};

export const WithLoading: Story = {
    render: (args) => <ScheduleSessionWithState {...args} />,
    args: {
        ...Default.args,
        isLoading: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'A view of the ScheduleSession component in a loading state, with a spinner on the send request button and disabled buttons.',
            },
        },
    },
};

export const WithGroupSession: Story = {
    render: (args) => <ScheduleSessionWithState {...args} />,
    args: {
        ...Default.args,
        groupSession: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'A view of the ScheduleSession component for a group session, displaying the group name.',
            },
        },
    },
};

export const WithoutCourse: Story = {
    render: (args) => <ScheduleSessionWithState {...args} />,
    args: {
        ...Default.args,
        course: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'A view of the ScheduleSession component without a course association, hiding the course information.',
            },
        },
    },
};

export const GermanLocale: Story = {
    render: (args) => <ScheduleSessionWithState {...args} />,
    args: {
        ...Default.args,
        locale: 'de',
    },
    parameters: {
        docs: {
            description: {
                story: 'A view of the ScheduleSession component with German locale (de) applied, showing translated text.',
            },
        },
    },
};

export const ErrorStateWithPreservedData: Story = {
    decorators: [
        (Story, context) => {
            const [isError, setIsError] = React.useState(false);
            const [isLoading, setIsLoading] = React.useState(false);
            const [dateValue, setDateValue] = React.useState<Date>(
                context.args.dateValue instanceof Date ? context.args.dateValue : new Date('2025-12-31')
            );
            const [timeValue, setTimeValue] = React.useState(context.args.timeValue || '12:00');

            return (
                <Story
                    args={{
                        ...context.args,
                        isError,
                        isLoading,
                        dateValue,
                        timeValue,
                        onClickSendRequest: async () => {
                            setIsLoading(true);
                            // Simulate an API call that fails
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            setIsLoading(false);
                            setIsError(true); // Set error state
                            alert(`Submission Failed: Date=${dateValue.toISOString().split('T')[0]}, Time=${timeValue}`);
                            console.log(`Submission Failed: Date=${dateValue.toISOString().split('T')[0]}, Time=${timeValue}`);
                            throw new Error('Simulated submission error');
                        },
                        onDateChange: (value) => {
                            setDateValue(new Date(value));
                            console.log(`Date Changed: ${value}`);
                        },
                        onTimeChange: (value) => {
                            setTimeValue(value);
                            console.log(`Time Changed: ${value}`);
                        },
                        onClickDiscard: () => {
                            setIsError(false); // Reset error state on discard
                            setIsLoading(false);
                            alert('Session discarded');
                            console.log('Session Discarded');
                        },
                        onClickCoach: handleCoachButtonClick,
                        onClickCourse: handleCourseButtonClick,
                        onClickGroup: handleGroupButtonClick,
                    }}
                />
            );
        },
    ],
    args: {
        user: 'student',
        groupSession: false,
        course: true,
        coachImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        courseImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        dateValue: new Date('2025-12-31'),
        timeValue: '12:00',
        coachName: 'Coach Name',
        courseTitle: 'Course Title',
        groupName: 'Group Name',
        sessionName: 'Full Immersion (60min)',
        locale: 'en',
    },
    parameters: {
        docs: {
            description: {
                story:
                    'The ScheduleSession component with a simulated error on submission. When the user submits the form, it enters a loading state for 1 second, then shows an error state with preserved date and time inputs. Alerts show the attempted submission data and discard action.',
            },
        },
    },
};

export const ErrorStateWithPreservedDataGerman: Story = {
    args: {
        ...ErrorStateWithPreservedData.args,
        locale: 'de',
    },
    decorators: ErrorStateWithPreservedData.decorators,
    parameters: {
        docs: {
            description: {
                story:
                    'The ScheduleSession component with a simulated error on submission in German locale. When the user submits the form, it enters a loading state for 1 second, then shows an error state with preserved date and time inputs. Alerts show the attempted submission data and discard action.',
            },
        },
    },
};