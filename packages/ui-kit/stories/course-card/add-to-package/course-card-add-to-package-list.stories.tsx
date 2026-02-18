import { Meta, StoryObj } from '@storybook/react-vite';
import { CourseCardAddToPackageList } from '../../../lib/components/course-card/add-to-package/course-card-add-to-package-list';
import { CourseCardAddToPackage } from '../../../lib/components/course-card/add-to-package/course-card-add-to-package';
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
        image: 'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png',
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

const RenderCourseList = ({
    locale,
    courses,
    addedCourseTitles,
}: {
    locale: TLocale;
    courses: (typeof sampleCourseData)[];
    addedCourseTitles: string[];
}) => {
    const [addedSet, setAddedSet] = useState<Set<string>>(
        new Set(addedCourseTitles),
    );

    const toggleCourse = (title: string) => {
        setAddedSet((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(title)) {
                newSet.delete(title);
                console.log(`Course removed: ${title}`, Array.from(newSet));
            } else {
                newSet.add(title);
                console.log(`Course added: ${title}`, Array.from(newSet));
            }
            return newSet;
        });
    };

    return (
        <CourseCardAddToPackageList
            locale={locale}
            onSearch={() => console.log('Search triggered')}
        >
            {courses.map((course, index) => (
                <CourseCardAddToPackage
                    key={`course-${index}`}
                    {...course}
                    locale={locale}
                    courseAdded={addedSet.has(course.title)}
                    onAddOrRemove={() => toggleCourse(course.title)}
                    onClickUser={() =>
                        alert(`Author clicked: ${course.author.name}`)
                    }
                />
            ))}
        </CourseCardAddToPackageList>
    );
};

const meta: Meta<typeof RenderCourseList> = {
    title: 'Components/CourseCardComponents/CourseCardAddToPackageList',
    component: RenderCourseList,
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
type Story = StoryObj<typeof RenderCourseList>;

const mockCourses4 = [
    { ...sampleCourseData, title: 'Course 1' },
    { ...sampleCourseData, title: 'Course 2' },
    { ...sampleCourseData, title: 'Course 3' },
    { ...sampleCourseData, title: 'Course 4' },
];

const mockCourses3 = [
    { ...sampleCourseData, title: 'Course A' },
    { ...sampleCourseData, title: 'Course B' },
    { ...sampleCourseData, title: 'Course C' },
];

export const DefaultView: Story = {
    args: {
        locale: 'en',
        courses: mockCourses4,
        addedCourseTitles: ['Course 1', 'Course 2'],
    },
    render: (args) => <RenderCourseList {...args} />,
};

export const AllCoursesIncluded: Story = {
    args: {
        locale: 'en',
        courses: mockCourses3,
        addedCourseTitles: [],
    },
    render: (args) => <RenderCourseList {...args} />,
};

export const NoCoursesIncluded: Story = {
    args: {
        locale: 'en',
        courses: mockCourses3,
        addedCourseTitles: ['Course A', 'Course B', 'Course C'],
    },
    render: (args) => <RenderCourseList {...args} />,
};
