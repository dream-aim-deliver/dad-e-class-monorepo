import type { Meta, StoryObj } from '@storybook/react-vite';
import { ManageCategoryTopicList } from '../../lib/components/manage-category-topic/manage-category-topic-list';
import { ManageCategoryTopicItem } from '../../lib/components/manage-category-topic/manage-category-topic-item';

/**
 * Storybook configuration for the ManageCategoryTopicList component.
 */
const meta: Meta<typeof ManageCategoryTopicList> = {
    title: 'Components/ManageCategoryTopic/ManageCategoryTopicList',
    component: ManageCategoryTopicList,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Locale for translations',
        },
        children: {
            description: 'One or more ManageCategoryTopicItem components',
        },
    },
};

export default meta;

type Story = StoryObj<typeof ManageCategoryTopicList>;

// Mock callback functions
const mockCallbacks = {
    onEdit: () => alert('Edit clicked'),
    onDelete: () => alert('Delete clicked'),
};

// Sample topic data
const sampleTopics = [
    { title: 'Web Development', coursesCount: 12, coachesCount: 5 },
    { title: 'Data Science', coursesCount: 8, coachesCount: 3 },
    { title: 'UI/UX Design', coursesCount: 15, coachesCount: 7 },
    { title: 'Mobile Development', coursesCount: 6, coachesCount: 2 },
    { title: 'Cloud Computing', coursesCount: 10, coachesCount: 4 },
    { title: 'Cybersecurity', coursesCount: 5, coachesCount: 2 },
    { title: 'Machine Learning', coursesCount: 9, coachesCount: 6 },
    { title: 'DevOps', coursesCount: 7, coachesCount: 3 },
];

/**
 * Default story with multiple topic items.
 */
export const Default: Story = {
    render: ({ locale }) => (
        <ManageCategoryTopicList locale={locale as 'en' | 'de'}>
            {sampleTopics.slice(0, 5).map((topic, index) => (
                <ManageCategoryTopicItem
                    key={`topic-${index}`}
                    title={topic.title}
                    coursesCount={topic.coursesCount}
                    coachesCount={topic.coachesCount}
                    locale={locale as 'en' | 'de'}
                    onEdit={mockCallbacks.onEdit}
                    onDelete={mockCallbacks.onDelete}
                    type={'category'}
                />
            ))}
        </ManageCategoryTopicList>
    ),
    args: {
        locale: 'en',
    },
    parameters: {
        docs: {
            description: {
                story: 'A list of multiple topic/category items displayed in a vertical layout.',
            },
        },
    },
};

/**
 * Empty state when no topics exist.
 */
export const EmptyState: Story = {
    render: ({ locale }) => (
        <ManageCategoryTopicList locale={locale as 'en' | 'de'}>
            {[]}
        </ManageCategoryTopicList>
    ),
    args: {
        locale: 'en',
    },
    parameters: {
        docs: {
            description: {
                story: 'The empty state displayed when no topic items are provided. Shows a localized empty message.',
            },
        },
    },
};

/**
 * Single topic item.
 */
export const SingleItem: Story = {
    render: ({ locale }) => (
        <ManageCategoryTopicList locale={locale as 'en' | 'de'}>
            <ManageCategoryTopicItem
                title="Web Development"
                coursesCount={12}
                coachesCount={5}
                locale={locale as 'en' | 'de'}
                onEdit={mockCallbacks.onEdit}
                onDelete={mockCallbacks.onDelete}
                type="category"
            />
        </ManageCategoryTopicList>
    ),
    args: {
        locale: 'en',
    },
    parameters: {
        docs: {
            description: {
                story: 'A list containing only a single topic item.',
            },
        },
    },
};

/**
 * Many topics (scrollable list).
 */
export const ManyTopics: Story = {
    render: ({ locale }) => (
        <ManageCategoryTopicList locale={locale as 'en' | 'de'}>
            {sampleTopics.map((topic, index) => (
                <ManageCategoryTopicItem
                    key={`topic-${index}`}
                    title={topic.title}
                    coursesCount={topic.coursesCount}
                    coachesCount={topic.coachesCount}
                    locale={locale as 'en' | 'de'}
                    onEdit={mockCallbacks.onEdit}
                    onDelete={mockCallbacks.onDelete}
                    type="topic"
                />
            ))}
        </ManageCategoryTopicList>
    ),
    args: {
        locale: 'en',
    },
    parameters: {
        docs: {
            description: {
                story: 'A longer list with all sample topics to demonstrate scrolling behavior.',
            },
        },
    },
};

/**
 * Topics without coaches.
 */
export const WithoutCoaches: Story = {
    render: ({ locale }) => (
        <ManageCategoryTopicList locale={locale as 'en' | 'de'}>
            {sampleTopics.slice(0, 4).map((topic, index) => (
                <ManageCategoryTopicItem
                    key={`topic-${index}`}
                    title={topic.title}
                    coursesCount={topic.coursesCount}
                    locale={locale as 'en' | 'de'}
                    onEdit={mockCallbacks.onEdit}
                    onDelete={mockCallbacks.onDelete}
                    type="topic"
                />
            ))}
        </ManageCategoryTopicList>
    ),
    args: {
        locale: 'en',
    },
    parameters: {
        docs: {
            description: {
                story: 'A list where none of the topics have coaches assigned. Only course counts are displayed.',
            },
        },
    },
};

/**
 * Mixed - some with coaches, some without.
 */
export const Mixed: Story = {
    render: ({ locale }) => (
        <ManageCategoryTopicList locale={locale as 'en' | 'de'}>
            <ManageCategoryTopicItem
                title="Web Development"
                coursesCount={12}
                coachesCount={5}
                locale={locale as 'en' | 'de'}
                onEdit={mockCallbacks.onEdit}
                onDelete={mockCallbacks.onDelete}
                type="topic"
            />
            <ManageCategoryTopicItem
                title="Data Science"
                coursesCount={8}
                locale={locale as 'en' | 'de'}
                onEdit={mockCallbacks.onEdit}
                onDelete={mockCallbacks.onDelete}
                type="topic"
            />
            <ManageCategoryTopicItem
                title="UI/UX Design"
                coursesCount={15}
                coachesCount={7}
                locale={locale as 'en' | 'de'}
                onEdit={mockCallbacks.onEdit}
                onDelete={mockCallbacks.onDelete}
                type="topic"
            />
            <ManageCategoryTopicItem
                title="Mobile Development"
                coursesCount={6}
                locale={locale as 'en' | 'de'}
                onEdit={mockCallbacks.onEdit}
                onDelete={mockCallbacks.onDelete}
                type="topic"
            />
        </ManageCategoryTopicList>
    ),
    args: {
        locale: 'en',
    },
    parameters: {
        docs: {
            description: {
                story: 'A mixed list where some topics have coaches and others do not.',
            },
        },
    },
};

/**
 * German locale.
 */
export const GermanLocale: Story = {
    render: ({ locale }) => (
        <ManageCategoryTopicList locale={locale as 'en' | 'de'}>
            <ManageCategoryTopicItem
                title="Webentwicklung"
                coursesCount={10}
                coachesCount={3}
                locale={locale as 'en' | 'de'}
                onEdit={() => alert('Bearbeiten geklickt')}
                onDelete={() => alert('Löschen geklickt')}
                type="topic"
            />
            <ManageCategoryTopicItem
                title="Datenwissenschaft"
                coursesCount={5}
                coachesCount={2}
                locale={locale as 'en' | 'de'}
                onEdit={() => alert('Bearbeiten geklickt')}
                onDelete={() => alert('Löschen geklickt')}
                type="topic"
            />
            <ManageCategoryTopicItem
                title="Cloud Computing"
                coursesCount={7}
                locale={locale as 'en' | 'de'}
                onEdit={() => alert('Bearbeiten geklickt')}
                onDelete={() => alert('Löschen geklickt')}
                type="topic"
            />
        </ManageCategoryTopicList>
    ),
    args: {
        locale: 'de',
    },
    parameters: {
        docs: {
            description: {
                story: 'The list component rendered with German translations (de locale), including German empty state.',
            },
        },
    },
};

/**
 * Empty state in German.
 */
export const EmptyStateGerman: Story = {
    render: ({ locale }) => (
        <ManageCategoryTopicList locale={locale as 'en' | 'de'}>
            {[]}
        </ManageCategoryTopicList>
    ),
    args: {
        locale: 'de',
    },
    parameters: {
        docs: {
            description: {
                story: 'The empty state message displayed in German when no topics exist.',
            },
        },
    },
};

/**
 * Topics with varying counts.
 */
export const VaryingCounts: Story = {
    render: ({ locale }) => (
        <ManageCategoryTopicList locale={locale as 'en' | 'de'}>
            <ManageCategoryTopicItem
                title="Popular Topic"
                coursesCount={150}
                coachesCount={45}
                locale={locale as 'en' | 'de'}
                onEdit={mockCallbacks.onEdit}
                onDelete={mockCallbacks.onDelete}
                type="topic"
            />
            <ManageCategoryTopicItem
                title="New Topic"
                coursesCount={1}
                coachesCount={1}
                locale={locale as 'en' | 'de'}
                onEdit={mockCallbacks.onEdit}
                onDelete={mockCallbacks.onDelete}
                type="topic"
            />
            <ManageCategoryTopicItem
                title="Growing Topic"
                coursesCount={25}
                coachesCount={8}
                locale={locale as 'en' | 'de'}
                onEdit={mockCallbacks.onEdit}
                onDelete={mockCallbacks.onDelete}
                type="topic"
            />
        </ManageCategoryTopicList>
    ),
    args: {
        locale: 'en',
    },
    parameters: {
        docs: {
            description: {
                story: 'Topics with varying counts from very low (1) to very high (150+) to test singular/plural handling.',
            },
        },
    },
};
