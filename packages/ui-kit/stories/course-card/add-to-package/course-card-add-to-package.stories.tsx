import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CourseCardAddToPackage } from '../../../lib/components/course-card/add-to-package/course-card-add-to-package';
import { TLocale } from '@maany_shr/e-class-translations';
import { course } from '@maany_shr/e-class-models';

const sampleCourseData: course.TCourseMetadata & {
    reviewCount: number;
    sessions: number;
    sales: number;
} = {
    title: 'Advanced Brand Identity Design',
    description:
        'This course teaches you how to create powerful, cohesive brand identities that resonate with audiences and stand out in the marketplace.',
    duration: {
        video: 140,
        coaching: 120,
        selfStudy: 160,
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

function CourseCardAddToPackageStory({
    locale = 'en' as TLocale,
    initialAdded = false,
    overrideImageUrl,
}: {
    locale?: TLocale;
    initialAdded?: boolean;
    overrideImageUrl?: string;
}) {
    const [added, setAdded] = useState(initialAdded);

    const handleAddOrRemove = () => {
        setAdded((prev) => {
            const newValue = !prev;
            console.log(
                `Course ${newValue ? 'added' : 'removed'}: ${sampleCourseData.title}`,
                { courseAdded: newValue }
            );
            return newValue;
        });
    };

    return (
        <CourseCardAddToPackage
            {...sampleCourseData}
            imageUrl={overrideImageUrl ?? sampleCourseData.imageUrl}
            courseAdded={added}
            onAddOrRemove={handleAddOrRemove}
            onClickUser={() =>
                alert(`Clicked user: ${sampleCourseData.author.name}`)
            }
            locale={locale}
        />
    );
}

const meta: Meta<typeof CourseCardAddToPackageStory> = {
    title: 'Components/CourseCardComponents/CourseCardAddToPackage',
    component: CourseCardAddToPackageStory,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            defaultValue: 'en',
        },
        initialAdded: { control: 'boolean', defaultValue: false },
    },
};

export default meta;
type Story = StoryObj<typeof CourseCardAddToPackageStory>;

export const Default: Story = {
    args: {},
};

export const InitiallyAdded: Story = {
    args: { initialAdded: true },
};

export const NoImage: Story = {
    args: {
        overrideImageUrl: '',
    },
};
