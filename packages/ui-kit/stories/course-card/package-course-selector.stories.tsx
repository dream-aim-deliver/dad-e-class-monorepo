import { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useMemo } from 'react';
import { PackageCourseSelector } from '../../lib/components/course-card/package-course-selector/package-course-selector';
import { PackageCourseCard } from '../../lib/components/course-card/package-course-selector/package-course-card';
import { TLocale } from '@maany_shr/e-class-translations';
import { course } from '@maany_shr/e-class-models';


// ---- SAMPLE DATA ----
const sampleCourses: (course.TCourseMetadata & {
  courseId: string;
  sales: number;
  reviewCount: number;
})[] = [
    {
      courseId: 'course-1',
      title: 'React for Beginners',
      description: 'Learn React from scratch with hands-on examples.',
      duration: { video: 180, coaching: 60, selfStudy: 120 },
      pricing: { fullPrice: 199, partialPrice: 99, currency: 'CHF' },
      imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      rating: 4.6,
      author: { name: 'Alice Johnson', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
      language: { code: 'ENG', name: 'English' },
      sales: 1200,
      reviewCount: 110,
    },
    {
      courseId: 'course-2',
      title: 'Advanced TypeScript',
      description: 'Master advanced TypeScript concepts and patterns.',
      duration: { video: 240, coaching: 0, selfStudy: 180 },
      pricing: { fullPrice: 249, partialPrice: 149, currency: 'CHF' },
      imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      rating: 4.8,
      author: { name: 'Bob Smith', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
      language: { code: 'ENG', name: 'English' },
      sales: 850,
      reviewCount: 80,
    },
    {
      courseId: 'course-3',
      title: 'UI/UX Design Mastery',
      description: 'Become a pro in user-centered design.',
      duration: { video: 300, coaching: 180, selfStudy: 400 },
      pricing: { fullPrice: 349, partialPrice: 199, currency: 'CHF' },
      imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      rating: 4.9,
      author: { name: 'Sophia Rodriguez', image: 'https://randomuser.me/api/portraits/women/46.jpg' },
      language: { code: 'DEU', name: 'German' },
      sales: 950,
      reviewCount: 210,
    },
    {
      courseId: 'course-4',
      title: 'Data Science with Python',
      description: 'Learn data analysis and machine learning with Python.',
      duration: { video: 360, coaching: 120, selfStudy: 240 },
      pricing: { fullPrice: 299, partialPrice: 179, currency: 'CHF' },
      imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      rating: 4.7,
      author: { name: 'Michael Johnson', image: 'https://randomuser.me/api/portraits/men/47.jpg' },
      language: { code: 'ENG', name: 'English' },
      sales: 1100,
      reviewCount: 150,
    },
  ];

// ---- STORYBOOK WRAPPER ----
function PackageCourseSelectorStory({
  locale = 'en' as TLocale,
  title = 'All Access Package',
  description = 'Choose the courses you want to include in your package.',
}: {
  locale?: TLocale;
  title?: string;
  description?: string;
}) {
  // STATE: selected course IDs
  const [selected, setSelected] = useState<string[]>(sampleCourses.map(c => c.courseId));
  // STATE: coaching filter
  const [coachingIncluded, setCoachingIncluded] = useState(false);

  // FILTERED: by coaching
  const filteredCourses = useMemo(
    () =>
      coachingIncluded
        ? sampleCourses.filter(course => course.duration.coaching > 0)
        : sampleCourses,
    [coachingIncluded]
  );

  // COMPUTE: pricing from selected courses
  const selectedCourses = sampleCourses.filter(course => selected.includes(course.courseId));
  const pricing = useMemo(() => {
    const fullPrice = selectedCourses.reduce((sum, c) => sum + c.pricing.fullPrice, 0);
    const partialPrice = selectedCourses.reduce((sum, c) => sum + c.pricing.partialPrice, 0);
    // Use the currency of the first selected course, or fallback
    const currency = selectedCourses[0]?.pricing.currency || 'CHF';
    return { fullPrice, partialPrice, currency };
  }, [selectedCourses]);

  // HANDLERS
  const handleIncludeExclude = (courseId: string) => {
    setSelected(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handlePurchase = () => {
    alert('Purchasing courses: ' + JSON.stringify(selected));
    console.log('Selected courses:', selected);
  };

  const handleCoachingCheckbox = () => {
    setCoachingIncluded(val => {
      const newVal = !val;
      if (newVal) {
        // Only keep selected courses that have coaching
        setSelected(prev =>
          prev.filter(id =>
            sampleCourses.find(c => c.courseId === id && c.duration.coaching > 0)
          )
        );
      }
      return newVal;
    });
  };

  return (
    <PackageCourseSelector
      title={title}
      description={description}
      coachingIncluded={coachingIncluded}
      pricing={pricing}
      onClickCheckbox={handleCoachingCheckbox}
      onClickPurchase={handlePurchase}
      locale={locale}
    >
      {filteredCourses.map(course => (
        <PackageCourseCard
          key={course.courseId}
          {...course}
          courseIncluded={selected.includes(course.courseId)}
          onClickUser={() => alert(`Clicked user: ${course.author.name}`)}
          onClickDetails={() => alert(`View details for ${course.title}`)}
          onClickIncludeExclude={() => handleIncludeExclude(course.courseId)}
          locale={locale}
        />
      ))}
    </PackageCourseSelector>
  );
}

// ---- STORYBOOK META ----
const meta: Meta<typeof PackageCourseSelectorStory> = {
  title: 'Components/CourseCardComponents/PackageCourseSelector',
  component: PackageCourseSelectorStory,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: { control: 'select', options: ['en', 'de'], defaultValue: 'en' },
  },
};

export default meta;
type Story = StoryObj<typeof PackageCourseSelectorStory>;

// ---- STORIES ----

export const Default: Story = {
  args: {},
};

export const WithCoachingFilter: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    // Simulate clicking the "Coaching included" checkbox
    const checkbox = canvasElement.querySelector('input[name="coachingIncluded"]') as HTMLInputElement;
    if (checkbox) checkbox.click();
  },
};

export const GermanLocale: Story = {
  args: { locale: 'de' },
};

export const EmptySelection: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    // Deselect all courses
    const excludeButtons = Array.from(canvasElement.querySelectorAll('button')).filter(btn =>
      btn.textContent?.toLowerCase().includes('exclude')
    ) as HTMLButtonElement[];
    excludeButtons.forEach(btn => btn.click());
  },
};
