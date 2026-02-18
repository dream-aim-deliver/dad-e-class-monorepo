import { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '../lib/components/tabs/tab';
import { CourseCard } from '../lib/components/course-card/course-card';
import { CourseCardList } from '../lib/components/course-card/course-card-list';
import { TLocale } from '@maany_shr/e-class-translations';
import { useState } from 'react';

// Interface for the Courses page component props
interface CoursesPageProps {
  locale: TLocale;
  platformSlug: string;
  courses: CourseData[];
}

// Course data interface matching the API response
interface CourseData {
  id: string;
  title: string;
  imageUrl: string | null;
  duration: number;
  coachingSessionCount: number;
  language: string;
  status: 'draft' | 'review' | 'live';
  rating: number | null;
  ratingCount: number;
  salesCount: number;
  creator: {
    name: string;
    surname: string;
    avatarUrl: string | null;
  };
}

// Courses Page Component
function CoursesPage({ locale, courses }: CoursesPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'review' | 'live'>('all');

  // Filter courses based on active tab
  const filteredCourses = activeTab === 'all'
    ? courses
    : courses.filter(course => course.status === activeTab);

  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'Review' },
    { value: 'live', label: 'Live' },
  ];

  return (
    <div className="flex flex-col space-y-5 px-30">
      <div>
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        <p className="text-gray-600 mt-2">View and manage all your courses across different statuses</p>
      </div>

      <Tabs.Root defaultTab="all" onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
          {tabs.map((tab, index) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              isLast={index === tabs.length - 1}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {tabs.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value}>
            <CourseCardList
              locale={locale}
              emptyStateMessage={'No courses found'}
              emptyStateButtonText={'Create Course'}
            >
              {filteredCourses.map((course) => {
                // Map status to CourseCreatorCard expected format
                const statusMap = {
                  review: 'under-review' as const,
                  draft: 'draft' as const,
                  live: 'published' as const,
                };

                // Map course data to CourseMetadata format
                const courseMetadata = {
                  title: course.title,
                  description: '',
                  duration: {
                    video: course.duration,
                    coaching: course.coachingSessionCount,
                    selfStudy: 0,
                  },
                  pricing: {
                    fullPrice: 0,
                    partialPrice: 0,
                    currency: 'USD',
                  },
                  imageUrl: course.imageUrl || '',
                  author: {
                    name: `${course.creator.name} ${course.creator.surname}`,
                    image: course.creator.avatarUrl || '',
                  },
                  rating: course.rating || 0,
                  language: {
                    code: course.language,
                    name: course.language,
                  },
                };

                return (
                  <CourseCard
                    key={course.id}
                    userType="creator"
                    reviewCount={course.ratingCount}
                    locale={locale}
                    language={{ code: course.language, name: course.language }}
                    creatorStatus={statusMap[course.status]}
                    course={courseMetadata}
                    sessions={course.coachingSessionCount}
                    sales={course.salesCount}
                  />
                );
              })}
            </CourseCardList>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
}

const meta: Meta<typeof CoursesPage> = {
  title: 'Pages/Courses',
  component: CoursesPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Language locale for the component'
    },
    platformSlug: {
      control: 'text',
      description: 'Platform slug identifier'
    },
    courses: {
      description: 'Array of course data objects'
    }
  },
};

export default meta;
type Story = StoryObj<typeof CoursesPage>;

// Sample course data
const sampleCourses: CourseData[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    duration: 120,
    coachingSessionCount: 5,
    language: 'en',
    status: 'live',
    rating: 4.8,
    ratingCount: 47,
    salesCount: 156,
    creator: {
      name: 'Jessica',
      surname: 'Thompson',
      avatarUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
  {
    id: '2',
    title: 'Python for Data Science',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    duration: 180,
    coachingSessionCount: 8,
    language: 'en',
    status: 'live',
    rating: 4.6,
    ratingCount: 32,
    salesCount: 98,
    creator: {
      name: 'Michael',
      surname: 'Chen',
      avatarUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
  {
    id: '3',
    title: 'UX Design Fundamentals',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    duration: 90,
    coachingSessionCount: 4,
    language: 'en',
    status: 'review',
    rating: 4.5,
    ratingCount: 21,
    salesCount: 67,
    creator: {
      name: 'David',
      surname: 'Williams',
      avatarUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
  {
    id: '4',
    title: 'Node.js Backend Development',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    duration: 150,
    coachingSessionCount: 6,
    language: 'en',
    status: 'draft',
    rating: null,
    ratingCount: 0,
    salesCount: 0,
    creator: {
      name: 'Aisha',
      surname: 'Patel',
      avatarUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
  {
    id: '5',
    title: 'Machine Learning Basics',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    duration: 200,
    coachingSessionCount: 10,
    language: 'en',
    status: 'live',
    rating: 4.9,
    ratingCount: 78,
    salesCount: 213,
    creator: {
      name: 'Sophia',
      surname: 'Rodriguez',
      avatarUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
  {
    id: '6',
    title: 'DevOps Essentials',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    duration: 110,
    coachingSessionCount: 5,
    language: 'en',
    status: 'draft',
    rating: null,
    ratingCount: 0,
    salesCount: 0,
    creator: {
      name: 'Thomas',
      surname: 'Johnson',
      avatarUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
  {
    id: '7',
    title: 'JavaScript Fundamentals',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    duration: 95,
    coachingSessionCount: 3,
    language: 'en',
    status: 'review',
    rating: 4.7,
    ratingCount: 15,
    salesCount: 45,
    creator: {
      name: 'Jessica',
      surname: 'Thompson',
      avatarUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
  {
    id: '8',
    title: 'Cloud Architecture',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    duration: 160,
    coachingSessionCount: 7,
    language: 'en',
    status: 'live',
    rating: 4.8,
    ratingCount: 56,
    salesCount: 134,
    creator: {
      name: 'Thomas',
      surname: 'Johnson',
      avatarUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
];

/**
 * Default courses page with all course statuses
 */
export const Default: Story = {
  args: {
    locale: 'en',
    platformSlug: 'default-platform',
    courses: sampleCourses,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default courses page showing all courses with different statuses (live, draft, review).'
      }
    }
  }
};

/**
 * Courses page with only live courses
 */
export const OnlyLiveCourses: Story = {
  args: {
    locale: 'en',
    platformSlug: 'default-platform',
    courses: sampleCourses.filter(c => c.status === 'live'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Courses page showing only published/live courses.'
      }
    }
  }
};

/**
 * Courses page with only draft courses
 */
export const OnlyDraftCourses: Story = {
  args: {
    locale: 'en',
    platformSlug: 'default-platform',
    courses: sampleCourses.filter(c => c.status === 'draft'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Courses page showing only draft courses that are still being created.'
      }
    }
  }
};

/**
 * Courses page with only courses under review
 */
export const OnlyReviewCourses: Story = {
  args: {
    locale: 'en',
    platformSlug: 'default-platform',
    courses: sampleCourses.filter(c => c.status === 'review'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Courses page showing only courses that are under review.'
      }
    }
  }
};

/**
 * Empty courses page
 */
export const EmptyState: Story = {
  args: {
    locale: 'en',
    platformSlug: 'default-platform',
    courses: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Courses page with no courses to display, showing empty state.'
      }
    }
  }
};

/**
 * Courses page with few courses
 */
export const FewCourses: Story = {
  args: {
    locale: 'en',
    platformSlug: 'default-platform',
    courses: sampleCourses.slice(0, 3),
  },
  parameters: {
    docs: {
      description: {
        story: 'Courses page with only a few courses to test layout with minimal content.'
      }
    }
  }
};

/**
 * Courses page with German locale
 */
export const GermanLocale: Story = {
  args: {
    locale: 'de',
    platformSlug: 'default-platform',
    courses: sampleCourses,
  },
  parameters: {
    docs: {
      description: {
        story: 'Courses page with German locale showing localized text and interface elements.'
      }
    }
  }
};

/**
 * Mobile viewport story
 */
export const MobileView: Story = {
  args: {
    locale: 'en',
    platformSlug: 'default-platform',
    courses: sampleCourses,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Courses page optimized for mobile viewport to test responsive behavior.'
      }
    }
  },
};

/**
 * Tablet viewport story
 */
export const TabletView: Story = {
  args: {
    locale: 'en',
    platformSlug: 'default-platform',
    courses: sampleCourses,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Courses page optimized for tablet viewport to test responsive behavior.'
      }
    }
  },
};
