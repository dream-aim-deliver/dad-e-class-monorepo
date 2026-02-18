import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from '../lib/components/stepper/stepper';
import { CourseCardList } from '../lib/components/course-card/course-card-list';
import { CourseCard } from '../lib/components/course-card/course-card';
import { useStepperContext } from '../lib/components/stepper/stepper-context';
import { PackageGeneralInformation } from '../lib/components/package-general-information-banner';
import ProfessionalInfo from '../lib/components/profile/professional-info';
import { ReviewSnippet } from '../lib/components/review/review-snippet';

const steps = [
    { step: 1, description: 'Pkg. Details' },
    { step: 2, description: 'Courses' },
    { step: 3, description: 'Pricing' },
    { step: 4, description: 'Preview' },
];

function StepperContentByStep() {
    const { currentStep } = useStepperContext();

    switch (currentStep) {
        case 1:
            return (
                <ProfessionalInfo
                    initialData={{
                        bio: 'Experienced software developer',
                        linkedinUrl: 'https://linkedin.com/in/example',
                        curriculumVitae: '',
                        portfolioWebsite: 'https://portfolio.example.com',
                        associatedCompanyName: 'Tech Corp',
                        associatedCompanyRole: 'Software Engineer',
                        associatedCompanyIndustry: 'Technology',
                        skills: ['JavaScript', 'React'],
                        isPrivateProfile: false,
                    }}
                    onSave={(profile) =>
                        console.log('Saved professional profile:', profile)
                    }
                    onFileUpload={async (fileRequest, abortSignal) => {
                        // Your API upload logic here
                        const formData = new FormData();
                        formData.append('file', fileRequest.file);
                        const response = await fetch('/api/upload-cv', {
                            method: 'POST',
                            body: formData,
                        });
                        return await response.json();
                    }}
                    onUploadComplete={(fileMetadata) =>
                        console.log('Upload completed:', fileMetadata)
                    }
                    locale="en"
                />
            );
        case 2:
            return (
                <CourseCardList
                    locale="en"
                    emptyStateMessage="No courses available"
                    emptyStateButtonText="Browse Courses"
                >
                    <CourseCard
                        userType="creator"
                        reviewCount={328}
                        locale="en"
                        language={{ code: 'ENG', name: 'English' }}
                        creatorStatus="published"
                        course={{
                            title: 'Advanced Brand Identity Design',
                            description:
                                'Learn to create powerful brand identities.',
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
                                'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
                            author: {
                                name: 'Emily Chen',
                                image: 'https://spca.bc.ca/wp-content/uploads/piglet-Pixabay-free-photo.jpg',
                            },
                            rating: 4.7,
                        }}
                        sessions={24}
                        sales={1850}
                        onEdit={() => console.log('Edit course')}
                        onManage={() => console.log('Manage course')}
                        onClickUser={() => console.log('Author clicked')}
                    />
                    <CourseCard
                        userType="creator"
                        reviewCount={328}
                        locale="en"
                        language={{ code: 'ENG', name: 'English' }}
                        creatorStatus="published"
                        course={{
                            title: 'Advanced Brand Identity Design',
                            description:
                                'Learn to create powerful brand identities.',
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
                                'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
                            author: {
                                name: 'Emily Chen',
                                image: 'https://spca.bc.ca/wp-content/uploads/piglet-Pixabay-free-photo.jpg',
                            },
                            rating: 4.7,
                        }}
                        sessions={24}
                        sales={1850}
                        onEdit={() => console.log('Edit course')}
                        onManage={() => console.log('Manage course')}
                        onClickUser={() => console.log('Author clicked')}
                    />
                    <CourseCard
                        userType="creator"
                        reviewCount={328}
                        locale="en"
                        language={{ code: 'ENG', name: 'English' }}
                        creatorStatus="published"
                        course={{
                            title: 'Advanced Brand Identity Design',
                            description:
                                'Learn to create powerful brand identities.',
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
                                'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
                            author: {
                                name: 'Emily Chen',
                                image: 'https://spca.bc.ca/wp-content/uploads/piglet-Pixabay-free-photo.jpg',
                            },
                            rating: 4.7,
                        }}
                        sessions={24}
                        sales={1850}
                        onEdit={() => console.log('Edit course')}
                        onManage={() => console.log('Manage course')}
                        onClickUser={() => console.log('Author clicked')}
                    />
                </CourseCardList>
            );
        case 3:
            return (
                <ReviewSnippet
                    reviewText="This course exceeded my expectations! The material was clear and engaging."
                    rating={4.5}
                    reviewerName="Jane Doe"
                    reviewerAvatarUrl="https://spca.bc.ca/wp-content/uploads/piglet-Pixabay-free-photo.jpg"
                    locale="en"
                />
            );
        case 4:
            return (
                <PackageGeneralInformation
                    title="Visualisierung"
                    subTitle="Als Package oder flexibel:"
                    description="Das Angebot Visualisierung richtet sich an Firmen und Einzelpersonen, die bereits über eine Idee, ein Konzept und ein Briefing verfügen. Es setzt voraus, dass ein Grundkonzept sowie konkrete Vorstellungen bezüglich der gewünschten Medien und Umsetzungen vorhanden sind. Dieses Angebot zielt darauf ab, die Ideen zielgerichtet umzusetzen und den bestmöglichen Weg zu finden, dies mithilfe vorhandener oder neuer Tools zu erreichen. Das Ziel jeder Umsetzung ist ein fertiges Produkt, das auf dem Briefing und den definierten Zielen basiert. Gemeinsam entwickeln wir dein Branding, deine Kampagne, deine Website oder deinen Film für das Web oder Social Media. Unsere Coaches begleiten dich Schritt für Schritt auf dem Weg zum Ziel."
                    imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
                    pricing={{
                        fullPrice: 299,
                        partialPrice: 249,
                        currency: 'CHF',
                    }}
                    duration={165}
                    onClickPurchase={() => console.log('Purchase clicked')}
                    locale="en"
                />
            );
        default:
            return null;
    }
}

const meta: Meta<typeof Stepper.Root> = {
    title: 'Components/Stepper',
    component: Stepper.Root,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<{
    defaultStep: number;
    totalSteps: number;
    locale: 'en' | 'de';
}>;

const Template = (args: {
    defaultStep: number;
    totalSteps: number;
    locale: 'en' | 'de';
}) => (
    <div className="w-full px-6 py-4 flex justify-center">
        <Stepper.Root
            defaultStep={args.defaultStep}
            totalSteps={args.totalSteps}
        >
            <div className="w-full flex flex-col gap-8">
                {/* Stepper list (header) */}
                <Stepper.List>
                    {steps.map(({ step, description }) => (
                        <Stepper.Item
                            key={step}
                            step={step}
                            description={description}
                        />
                    ))}
                </Stepper.List>

                {/* Step content with consistent width */}
                <div className="w-full">
                    <StepperContentByStep />
                </div>

                {/* Stepper controls */}
                <div className="w-full">
                    <Stepper.Controls
                        steps={steps}
                        locale={args.locale}
                        onPublish={() => alert('Publishing package!')}
                    />
                </div>
            </div>
        </Stepper.Root>
    </div>
);

export const Default: Story = {
    render: Template,
    args: {
        defaultStep: 2,
        totalSteps: steps.length,
        locale: 'en',
    },
    parameters: {
        controls: {
            expanded: true,
        },
    },
};

export const StartFromBeginning: Story = {
    render: Template,
    args: {
        defaultStep: 1,
        totalSteps: steps.length,
        locale: 'de',
    },
};

export const Completed: Story = {
    render: Template,
    args: {
        defaultStep: steps.length,
        totalSteps: steps.length,
        locale: 'en',
    },
};
