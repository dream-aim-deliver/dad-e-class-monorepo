import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CourseGeneralInformationVisitor } from '../../lib/components/course-general-information/course-general-information-visitor';
import { UserAvatarReel } from '../../lib/components/avatar/user-avatar-reel';
import { UserAvatar } from '../../lib/components/avatar/user-avatar';

const meta: Meta<typeof CourseGeneralInformationVisitor> = {
    title: 'Components/CourseGeneralInformation/Visitor',
    component: CourseGeneralInformationVisitor,
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
type Story = StoryObj<typeof CourseGeneralInformationVisitor>;

const AvatarReelExample = (
    <div className="flex gap-[8px] items-center md:flex-row flex-col">
        <UserAvatarReel>
            <UserAvatar
                size="large"
                fullName="Alice Smith"
                imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
                className="mr-[-12px]"
            />
            <UserAvatar
                size="large"
                fullName="Bob Johnson"
                imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
                className="mr-[-12px]"
            />
            <UserAvatar
                size="large"
                fullName="Charlie Brown"
                imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
                className="mr-[-12px]"
            />
            <UserAvatar size="large" fullName="+3" />
        </UserAvatarReel>
        <p className="text-base-white text-sm leading-[120%]">
            Alice Smith, Bob Johnson and 4 others
        </p>
    </div>
);

export const Default: Story = {
    args: {
        locale: 'en',
        title: 'Brand Identity Design',
        longDescription:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.',
        duration: {
            video: 100,
            coaching: 60,
            selfStudy: 180,
        },
        requirementsDetails:
            'Before starting the course, we highly recommend completing these courses:',
        requiredCourses: [
            {
                courseTitle: 'Leadership Mastery',
                image: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
                slug: 'leadership-mastery',
            },
        ],
        pricing: {
            fullPrice: 220,
            partialPrice: 40,
            currency: 'CHF',
        },
        author: {
            name: 'Dr. Emily Carter',
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        },
        rating: 4.6,
        totalRating: 24,
        ownerRating: 4.7,
        ownerTotalRating: 43,
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    },
    render: (args) => {
        const Wrapper = () => {
            const [coachingIncluded, setCoachingIncluded] =
                React.useState(false);

            return (
                <CourseGeneralInformationVisitor
                    {...args}
                    coachingIncluded={coachingIncluded}
                    onCoachingIncludedChange={(checked: boolean) => {
                        setCoachingIncluded(checked);
                        console.log(
                            'Coaching Included checkbox changed:',
                            checked,
                        );
                    }}
                    onClickBook={() => alert('Booked clicked')}
                    onClickBuyCourse={(coachingIncluded) =>
                        alert(
                            `Buy course clicked. Coaching included: ${coachingIncluded}`,
                        )
                    }
                    onClickCourse={() => alert('Course clicked')}
                >
                    {AvatarReelExample}
                </CourseGeneralInformationVisitor>
            );
        };

        return <Wrapper />;
    },
};

export const WithoutRequirements: Story = {
    args: {
        ...Default.args,
        requirementsDetails: 'There are no requirements to take this course.',
        requiredCourses: [],
    },
    render: (args) => {
        const Wrapper = () => {
            const [coachingIncluded, setCoachingIncluded] =
                React.useState(false);

            return (
                <CourseGeneralInformationVisitor
                    {...args}
                    coachingIncluded={coachingIncluded}
                    onCoachingIncludedChange={(checked: boolean) => {
                        setCoachingIncluded(checked);
                        console.log(
                            'Coaching Included checkbox changed:',
                            checked,
                        );
                    }}
                    onClickBook={() => alert('Booked clicked')}
                    onClickBuyCourse={(coachingIncluded) =>
                        alert(
                            `Buy course clicked. Coaching included: ${coachingIncluded}`,
                        )
                    }
                    onClickCourse={() => alert('Course clicked')}
                >
                    {AvatarReelExample}
                </CourseGeneralInformationVisitor>
            );
        };

        return <Wrapper />;
    },
};

export const WithoutImage: Story = {
    args: {
        ...Default.args,
        imageUrl: undefined, // omitimos la imagen
    },
    render: (args) => {
        const Wrapper = () => {
            const [coachingIncluded, setCoachingIncluded] =
                React.useState(false);

            return (
                <CourseGeneralInformationVisitor
                    {...args}
                    coachingIncluded={coachingIncluded}
                    onCoachingIncludedChange={setCoachingIncluded}
                    onClickBook={() => alert('Book clicked')}
                    onClickBuyCourse={(coachingIncluded) =>
                        alert(
                            `Buy course clicked. Coaching included: ${coachingIncluded}`,
                        )
                    }
                    onClickCourse={() => alert('Course clicked')}
                >
                    {AvatarReelExample}
                </CourseGeneralInformationVisitor>
            );
        };

        return <Wrapper />;
    },
};
