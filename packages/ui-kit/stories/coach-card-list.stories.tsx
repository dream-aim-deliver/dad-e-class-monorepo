import { Meta, StoryObj } from '@storybook/react-vite';
import CoachCard, { CoachCardDetails } from '../lib/components/coach/coach-card';
import { TLocale } from '@maany_shr/e-class-translations';
import CardListLayout from '../lib/components/card-list-layout';

// Interface for CoachList component props
interface CoachListProps {
  title?: string;
  coaches: CoachCardDetails[];
  variant?: 'coach' | 'courseCreator' | 'default';
  onClickBookSession?: () => void;
  onClickViewProfile?: () => void;
  onClickRemoveFromCourse?: () => void;
  onClickCourse?: (slug: string) => void;
  locale: TLocale;
}

// CoachList component
function CoachList({
  coaches,
  title,
  variant = 'default',
  onClickBookSession,
  onClickViewProfile,
  onClickRemoveFromCourse,
  onClickCourse,
  locale
}: CoachListProps) {
  return (
    <div className="flex flex-col gap-10">
      {title && (
        <h3 className="text-text-primary lg:text-[40px] text-2xl">{title}</h3>
      )}
      <CardListLayout>
        {coaches.map((coach, index) => (
          <CoachCard
            key={`${coach.coachName}-${index}`}
            variant={variant}
            cardDetails={coach}
            onClickBookSession={variant === 'default' ? onClickBookSession : undefined}
            onClickViewProfile={onClickViewProfile}
            onClickRemoveFromCourse={variant === 'courseCreator' ? onClickRemoveFromCourse : undefined}
            onClickCourse={onClickCourse}
            locale={locale}
          />
        ))}
      </CardListLayout>
    </div>
  );
}

const meta: Meta<typeof CoachList> = {
  title: 'Components/CoachCardList',
  component: CoachList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title for the coach list section'
    },
    variant: {
      control: 'select',
      options: ['default', 'coach', 'courseCreator'],
      description: 'Card variant determining which buttons to show'
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Language locale for the component'
    },
    coaches: {
      description: 'Array of coach data objects'
    },
    onClickBookSession: {
      action: 'book-session-clicked',
      description: 'Callback when book session button is clicked (default variant)'
    },
    onClickViewProfile: {
      action: 'view-profile-clicked',
      description: 'Callback when view profile button is clicked'
    },
    onClickRemoveFromCourse: {
      action: 'remove-from-course-clicked',
      description: 'Callback when remove from course button is clicked (courseCreator variant)'
    },
    onClickCourse: {
      action: 'course-clicked',
      description: 'Callback when a course is clicked'
    }
  },
};

export default meta;
type Story = StoryObj<typeof CoachList>;

// Sample coach data with slug added to courses
const sampleCoaches: CoachCardDetails[] = [
  {
    coachName: 'Jessica Thompson',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'Spanish'],
    sessionCount: 156,
    skills: ['React', 'JavaScript', 'UI/UX Design', 'Python', 'Data Science', 'Machine Learning'],
    description: 'Experienced frontend developer specializing in React and modern JavaScript frameworks. Strong focus on creating intuitive user interfaces.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Advanced React Patterns',
        slug: 'advanced-react-patterns'
      },
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'JavaScript Fundamentals',
        slug: 'javascript-fundamentals'
      },
    ],
    rating: 4.8,
    totalRatings: 47,
  },
  {
    coachName: 'Michael Chen',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'Mandarin'],
    sessionCount: 98,
    skills: ['Python', 'Data Science', 'Machine Learning', 'React', 'JavaScript', 'UI/UX Design'],
    description: 'Data scientist with expertise in Python and machine learning algorithms. Passionate about helping others understand complex concepts.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Python for Data Analysis',
        slug: 'python-data-analysis'
      },
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Intro to Machine Learning',
        slug: 'intro-machine-learning'
      },
    ],
    rating: 4.6,
    totalRatings: 32,
  },
  {
    coachName: 'Sophia Rodriguez',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'French'],
    sessionCount: 213,
    skills: ['Product Management', 'Agile', 'Leadership', 'Strategy'],
    description: 'Product manager with over 10 years of experience in tech companies. Expert in agile methodologies and team leadership.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Agile Product Management',
        slug: 'agile-product-management'
      },
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Leadership Skills',
        slug: 'leadership-skills'
      },
    ],
    rating: 4.9,
    totalRatings: 78,
  },
  {
    coachName: 'David Williams',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'French'],
    sessionCount: 67,
    skills: ['UX Research', 'Design Thinking', 'Prototyping'],
    description: 'UX designer focused on user-centered approaches and accessible design principles. Specializes in research methods and rapid prototyping.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'UX Research Methods',
        slug: 'ux-research-methods'
      },
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Design Thinking Workshop',
        slug: 'design-thinking-workshop'
      },
    ],
    rating: 4.5,
    totalRatings: 21,
  },
  {
    coachName: 'Aisha Patel',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'Hindi'],
    sessionCount: 124,
    skills: ['Backend Development', 'Node.js', 'Database Design'],
    description: 'Backend developer with a strong focus on scalable architecture and database optimization. Expert in Node.js and SQL.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Node.js API Development',
        slug: 'nodejs-api-development'
      },
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Database Design Principles',
        slug: 'database-design-principles'
      },
    ],
    rating: 4.7,
    totalRatings: 39,
  },
  {
    coachName: 'Thomas Johnson',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'German'],
    sessionCount: 82,
    skills: ['DevOps', 'Cloud Infrastructure', 'CI/CD'],
    description: 'DevOps engineer specializing in cloud infrastructure and automated deployment pipelines. AWS certified and experienced with Kubernetes.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Introduction to DevOps',
        slug: 'intro-devops'
      },
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'AWS for Developers',
        slug: 'aws-for-developers'
      },
    ],
    rating: 4.8,
    totalRatings: 28,
  },
];

/**
 * Default coach list story with full set of coaches
 */
export const Default: Story = {
  args: {
    coaches: sampleCoaches,
    locale: 'en',
    title: 'Coaching On Demand',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default coach list showing all available coaches with English locale and title.'
      }
    }
  }
};

/**
 * Coach list with fewer coaches for testing layout
 */
export const FewCoaches: Story = {
  args: {
    coaches: sampleCoaches.slice(0, 3),
    locale: 'en',
    title: 'Featured Coaches',
  },
  parameters: {
    docs: {
      description: {
        story: 'Coach list showing only the first 3 coaches to test layout with fewer items.'
      }
    }
  }
};

/**
 * Coach list with German locale
 */
export const GermanLocale: Story = {
  args: {
    coaches: sampleCoaches,
    locale: 'de',
    title: 'Coaching auf Abruf',
  },
  parameters: {
    docs: {
      description: {
        story: 'Coach list with German locale showing localized text and interface elements.'
      }
    }
  }
};

/**
 * Coach list without title
 */
export const NoTitle: Story = {
  args: {
    coaches: sampleCoaches.slice(0, 4),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Coach list without a title to test layout when title prop is not provided.'
      }
    }
  }
};

/**
 * Mobile viewport story
 */
export const MobileView: Story = {
  args: {
    coaches: sampleCoaches,
    locale: 'en',
    title: 'Mobile Coaching',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Coach list optimized for mobile viewport to test responsive behavior.'
      }
    }
  },
};

/**
 * Tablet viewport story
 */
export const TabletView: Story = {
  args: {
    coaches: sampleCoaches,
    locale: 'en',
    title: 'Tablet Coaching',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Coach list optimized for tablet viewport to test responsive behavior.'
      }
    }
  },
};

/**
 * Single coach for testing minimum case
 */
export const SingleCoach: Story = {
  args: {
    coaches: [sampleCoaches[0]],
    locale: 'en',
    title: 'Featured Coach',
  },
  parameters: {
    docs: {
      description: {
        story: 'Coach list with only one coach to test minimum viable layout.'
      }
    }
  }
};

/**
 * Empty state for testing
 */
export const EmptyState: Story = {
  args: {
    coaches: [],
    locale: 'en',
    title: 'No Coaches Available',
  },
  parameters: {
    docs: {
      description: {
        story: 'Coach list with empty coaches array to test empty state handling.'
      }
    }
  }
};

/**
 * Coach variant - Shows only view profile buttons
 */
export const CoachVariant: Story = {
  args: {
    coaches: sampleCoaches.slice(0, 4),
    variant: 'coach',
    locale: 'en',
    title: 'Available Coaches',
  },
  parameters: {
    docs: {
      description: {
        story: 'Coach list with coach variant showing only view profile buttons for each coach.'
      }
    }
  }
};

/**
 * Course Creator variant - Shows view profile and remove from course buttons
 */
export const CourseCreatorVariant: Story = {
  args: {
    coaches: sampleCoaches.slice(0, 3),
    variant: 'courseCreator',
    locale: 'en',
    title: 'Course Instructors',
  },
  parameters: {
    docs: {
      description: {
        story: 'Coach list with courseCreator variant showing view profile and remove from course buttons.'
      }
    }
  }
};
