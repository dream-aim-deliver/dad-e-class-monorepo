import type { Meta, StoryObj } from '@storybook/react';
import { CourseGeneralInformationView } from '../lib/components/course-general-information-view';
import { UserAvatarReel } from '../lib/components/avatar/user-avatar-reel';
import { UserAvatar } from '../lib/components/avatar/user-avatar';

const meta: Meta<typeof CourseGeneralInformationView> = {
  title: 'Components/CourseGeneralInformationView',
  component: CourseGeneralInformationView,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CourseGeneralInformationView>;

// Reusable Avatar Reel Example
const AvatarReelExample = (
    <div className='flex gap-[15px] items-start md:flex-row flex-col'>
        <UserAvatarReel>
            <UserAvatar size='large' fullName="Alice Smith" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className='mr-[-12px]' />
            <UserAvatar size='large' fullName="Bob Johnson" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className='mr-[-12px]' />
            <UserAvatar size='large' fullName="Charlie Brown" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className='mr-[-12px]' />
            <UserAvatar size='large' fullName="+3" />
        </UserAvatarReel>
        <p className='text-base-white text-lg leading-[120%] font-bold'>
            Alice Smith, Bob Johnson and 4 others
        </p>
    </div>
);

// Test Case 1: Complete Course Details
export const CompleteCourse: Story = {
  args: {
    locale: 'en',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id.',
    duration: {
      video: 100,
      coaching: 60,
      selfStudy: 180,
    },
    author: {
      name: 'Dr. Emily Carter',
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png'
    },
    rating: 4.7,
    studentProgress: 65,
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickAuthor: () => alert('Author profile clicked'),
    onClickResume: () => alert('Resume course clicked'),
    children: AvatarReelExample,
  },
};

// Test Case 2: Course Without Image
export const CourseWithoutImage: Story = {
  args: {
    ...CompleteCourse.args,
    imageUrl: '',
    children: AvatarReelExample,
  }
};

// Test Case 3: Course with Short Duration
export const ShortDurationCourse: Story = {
  args: {
    ...CompleteCourse.args,
    duration: {
      video: 15,
      coaching: 0,
      selfStudy: 30,
    },
    studentProgress: 15,
    children: AvatarReelExample,
  }
};

// Test Case 4: Course with Broken Image
export const CourseWithBrokenImage: Story = {
  args: {
    ...CompleteCourse.args,
    imageUrl: 'https://invalid.url/image.jpg',
    children: AvatarReelExample,
  }
};

// Test Case 5: Course with Long Duration
export const LongDurationCourse: Story = {
  args: {
    ...CompleteCourse.args,
    duration: {
      video: 600,
      coaching: 300,
      selfStudy: 1200,
    },
    studentProgress: 10,
    children: AvatarReelExample,
  }
};

// Test Case 6: Course with Full Progress
export const CompletedCourse: Story = {
  args: {
    ...CompleteCourse.args,
    studentProgress: 100,
    children: AvatarReelExample,
  }
};

// Test Case 7: Course with No Progress
export const NewCourse: Story = {
  args: {
    ...CompleteCourse.args,
    studentProgress: 0,
    children: AvatarReelExample,
  }
};

// Test Case 8: Course with Anonymous Author
export const AnonymousAuthorCourse: Story = {
  args: {
    ...CompleteCourse.args,
    author: {
      name: 'Anonymous Instructor',
      image: '',
    },
    children: AvatarReelExample,
  }
};
