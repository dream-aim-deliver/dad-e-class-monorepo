import type { Meta, StoryObj } from '@storybook/react';
import { CourseGeneralInformationView } from '../../lib/components/course-general-information/course-general-information-view';
import { UserAvatarReel } from '../../lib/components/avatar/user-avatar-reel';
import { UserAvatar } from '../../lib/components/avatar/user-avatar';

const meta: Meta<typeof CourseGeneralInformationView> = {
  title: 'Components/CourseGeneralInformation/Student&Coach',
  component: CourseGeneralInformationView,
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

const AvatarReelExample = (
  <div className="flex gap-[15px] items-center md:flex-row flex-col">
    <UserAvatarReel>
      <UserAvatar size="large" fullName="Alice Smith" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className="mr-[-12px]" />
      <UserAvatar size="large" fullName="Bob Johnson" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className="mr-[-12px]" />
      <UserAvatar size="large" fullName="Charlie Brown" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className="mr-[-12px]" />
      <UserAvatar size="large" fullName="+3" />
    </UserAvatarReel>
    <h5 className="text-text-primary">
      Alice Smith, Bob Johnson and 4 others
    </h5>
  </div>
);

const sampleStudents = [
  {
    name: "Alice Smith",
    avatarUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
  },
  {
    name: "Bob Johnson",
    avatarUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
  },
  {
    name: "Charlie Brown",
    avatarUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
  }
];

export const CompleteCourse: Story = {
  args: {
    locale: 'en',
    longDescription: 'This is a long description of the course.',
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
    onClickResume: () => alert('Resume course clicked'),
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickAuthor: () => alert('Author profile clicked'),
    children: AvatarReelExample,
  },
};

export const CoachView: Story = {
  args: {
    ...CompleteCourse.args,
    studentProgress: undefined,
    onClickResume: undefined,
  },
};

export const CourseWithoutImage: Story = {
  args: {
    ...CompleteCourse.args,
    imageUrl: '',
  }
};

export const ShortDurationCourse: Story = {
  args: {
    ...CompleteCourse.args,
    duration: {
      video: 15,
      coaching: 0,
      selfStudy: 30,
    },
    studentProgress: 15,
  }
};

export const CourseWithBrokenImage: Story = {
  args: {
    ...CompleteCourse.args,
    imageUrl: 'https://invalid.url/image.jpg',
  }
};

export const CompletedCourse: Story = {
  args: {
    ...CompleteCourse.args,
    studentProgress: 100,
  }
};

export const NewCourse: Story = {
  args: {
    ...CompleteCourse.args,
    studentProgress: 0,
  }
};

export const AnonymousAuthorCourse: Story = {
  args: {
    ...CompleteCourse.args,
    author: {
      name: 'Anonymous Instructor',
      image: '',
    },
  }
};

export const SingleStudentCourse: Story = {
  args: {
    ...CompleteCourse.args,
    students: [sampleStudents[0]],
    totalStudentCount: 1,
  }
};

export const TwoStudentsCourse: Story = {
  args: {
    ...CompleteCourse.args,
    students: [sampleStudents[0], sampleStudents[1]],
    totalStudentCount: 2,
  }
};

export const NoStudentsCourse: Story = {
  args: {
    ...CompleteCourse.args,
    students: [],
    totalStudentCount: 0,
  }
};

export const ManyStudentsCourse: Story = {
  args: {
    ...CompleteCourse.args,
    students: sampleStudents,
    totalStudentCount: 15,
  }
};

export const StudentsWithoutAvatarsCourse: Story = {
  args: {
    ...CompleteCourse.args,
    students: [
      { name: "Alice Smith" },
      { name: "Bob Johnson" },
      { name: "Charlie Brown" }
    ],
    totalStudentCount: 8,
  }
};

export const ExactlyThreeStudentsCourse: Story = {
  args: {
    ...CompleteCourse.args,
    students: sampleStudents,
    totalStudentCount: 3,
  }
};

export const TwoStudentsWithOthersCourse: Story = {
  args: {
    ...CompleteCourse.args,
    students: [sampleStudents[0], sampleStudents[1]],
    totalStudentCount: 7,
  }
};
