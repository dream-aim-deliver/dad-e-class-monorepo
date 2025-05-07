import type { Meta, StoryObj } from '@storybook/react';
import { ScheduleSession } from '../../lib/components/calendar/schedule-session';
import { useState } from 'react';

const meta: Meta<typeof ScheduleSession> = {
    title: 'Components/ScheduleSession',
    component: ScheduleSession,
    tags: ['autodocs'],
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
        description: 'Whether the form is in a loading state.',
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
          story: 'A view of the ScheduleSession component as seen by a coach.',
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
          story: 'A view of the ScheduleSession component in a loading state, with a spinner and disabled inputs/buttons.',
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
          story: 'A view of the ScheduleSession component for a group session.',
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
          story: 'A view of the ScheduleSession component without a course association.',
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
          story: 'A view of the ScheduleSession component with German locale (de) applied.',
        },
      },
    },
  };