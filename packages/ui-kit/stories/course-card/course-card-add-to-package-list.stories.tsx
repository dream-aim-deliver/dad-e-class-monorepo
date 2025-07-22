import { Meta, StoryObj } from '@storybook/react';
import { CourseCardAddToPackageList } from '../../lib/components/course-card/add-to-package/course-card-add-to-package-list';
import { CourseCardAddToPackage } from '../../lib/components/course-card/add-to-package/course-card-add-to-package';
import { useState } from 'react';
import { TLocale } from '@maany_shr/e-class-translations';

const sampleCourseData = {
  title: 'Advanced Brand Identity Design',
  description: 'Learn how to create powerful brand identities that resonate.',
  duration: {
    video: 240,
    coaching: 120,
    selfStudy: 360,
  },
  pricing: {
    fullPrice: 299,
    partialPrice: 149,
    currency: 'USD',
  },
  imageUrl:
    'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600',
  author: {
    name: 'Emily Chen',
    image:
      'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png',
  },
  language: {
    code: 'ENG',
    name: 'English',
  },
  rating: 4.7,
  reviewCount: 275,
  sessions: 18,
  sales: 950,
};

const CourseCardAddToPackageListStory = ({
  locale = 'en' as TLocale,
  courses = [],
}: {
  locale?: TLocale;
  courses?: typeof sampleCourseData[];
}) => {
  const [addedStates, setAddedStates] = useState<boolean[]>(
    courses.map(() => false)
  );

  const toggleCourse = (index: number) => {
    setAddedStates(prev =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  return (
    <CourseCardAddToPackageList locale={locale}>
      {courses.map((course, index) => (
        <CourseCardAddToPackage
          key={`course-${index}`}
          {...course}
          locale={locale}
          courseAdded={addedStates[index]}
          onAddOrRemove={() => toggleCourse(index)}
          onClickUser={() =>
            alert(`Author clicked: ${course.author.name}`)
          }
        />
      ))}
    </CourseCardAddToPackageList>
  );
};

const meta: Meta<typeof CourseCardAddToPackageListStory> = {
  title: 'Components/CourseCardComponents/CourseCardAddToPackageList',
  component: CourseCardAddToPackageListStory,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CourseCardAddToPackageListStory>;

export const ListWithCourses: Story = {
  args: {
    courses: [
      { ...sampleCourseData },
      {
        ...sampleCourseData,
        title: 'Design Thinking for Innovation',
      },
      {
        ...sampleCourseData,
        title: 'Typography Masterclass',
      },
    ],
    locale: 'en',
  },
};

export const GermanLocale: Story = {
  args: {
    ...ListWithCourses.args,
    locale: 'de',
  },
};
