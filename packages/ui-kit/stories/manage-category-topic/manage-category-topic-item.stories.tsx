import type { Meta, StoryObj } from '@storybook/react-vite';
import { ManageCategoryTopicItem } from '../../lib/components/manage-category-topic/manage-category-topic-item';

/**
 * Storybook configuration for the ManageCategoryTopicItem component.
 */
const meta: Meta<typeof ManageCategoryTopicItem> = {
    title: 'Components/ManageCategoryTopic/ManageCategoryTopicItem',
    component: ManageCategoryTopicItem,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        title: {
            control: 'text',
            description: 'The title/name of the topic or category',
        },
        coursesCount: {
            control: 'number',
            description: 'Number of courses using this topic/category',
        },
        coachesCount: {
            control: 'number',
            description: 'Optional number of coaches using this topic/category',
        },
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Locale for translations',
        },
        onEdit: {
            action: 'edit clicked',
            description: 'Callback function triggered when the edit button is clicked',
        },
        onDelete: {
            action: 'delete clicked',
            description: 'Callback function triggered when the delete button is clicked',
        },
    },
};

export default meta;

type Story = StoryObj<typeof ManageCategoryTopicItem>;

/**
 * Default story showcasing a topic item with courses only.
 */
export const Default: Story = {
    args: {
        title: 'Web Development',
        coursesCount: 12,
        locale: 'en',
        onEdit: () => alert('Edit clicked'),
        onDelete: () => alert('Delete clicked'),
    },
    parameters: {
        docs: {
            description: {
                story:
                    'A topic/category item displaying the title and number of courses. Includes edit and delete action buttons.',
            },
        },
    },
};

/**
 * Topic item with courses and coaches.
 */
export const WithCoaches: Story = {
    args: {
        title: 'Data Science',
        coursesCount: 8,
        coachesCount: 5,
        locale: 'en',
        onEdit: () => alert('Edit clicked'),
        onDelete: () => alert('Delete clicked'),
    },
    parameters: {
        docs: {
            description: {
                story:
                    'A topic/category item showing both the number of courses and coaches using this topic.',
            },
        },
    },
};

/**
 * Single course topic.
 */
export const SingleCourse: Story = {
    args: {
        title: 'Machine Learning',
        coursesCount: 1,
        locale: 'en',
        onEdit: () => alert('Edit clicked'),
        onDelete: () => alert('Delete clicked'),
    },
    parameters: {
        docs: {
            description: {
                story:
                    'A topic with only one course. Note the singular form "course" in the badge.',
            },
        },
    },
};

/**
 * Single coach topic.
 */
export const SingleCoach: Story = {
    args: {
        title: 'UI/UX Design',
        coursesCount: 15,
        coachesCount: 1,
        locale: 'en',
        onEdit: () => alert('Edit clicked'),
        onDelete: () => alert('Delete clicked'),
    },
    parameters: {
        docs: {
            description: {
                story:
                    'A topic with multiple courses but only one coach. Note the singular form "coach" in the badge.',
            },
        },
    },
};

/**
 * Zero coaches (badge not displayed).
 */
export const ZeroCoaches: Story = {
    args: {
        title: 'Mobile Development',
        coursesCount: 7,
        coachesCount: 0,
        locale: 'en',
        onEdit: () => alert('Edit clicked'),
        onDelete: () => alert('Delete clicked'),
    },
    parameters: {
        docs: {
            description: {
                story:
                    'A topic with courses but zero coaches. The coaches badge is not displayed when count is 0.',
            },
        },
    },
};

/**
 * German locale.
 */
export const GermanLocale: Story = {
    args: {
        title: 'Webentwicklung',
        coursesCount: 10,
        coachesCount: 3,
        locale: 'de',
        onEdit: () => alert('Bearbeiten geklickt'),
        onDelete: () => alert('Löschen geklickt'),
    },
    parameters: {
        docs: {
            description: {
                story:
                    'The same component rendered with German translations (de locale).',
            },
        },
    },
};

/**
 * Long title text.
 */
export const LongTitle: Story = {
    args: {
        title: 'Advanced Web Development with Modern JavaScript Frameworks and Best Practices',
        coursesCount: 25,
        coachesCount: 12,
        locale: 'en',
        onEdit: () => alert('Edit clicked'),
        onDelete: () => alert('Delete clicked'),
    },
    parameters: {
        docs: {
            description: {
                story:
                    'A topic with a very long title to test text wrapping and layout behavior.',
            },
        },
    },
};

/**
 * High numbers.
 */
export const HighNumbers: Story = {
    args: {
        title: 'Programming Fundamentals',
        coursesCount: 152,
        coachesCount: 48,
        locale: 'en',
        onEdit: () => alert('Edit clicked'),
        onDelete: () => alert('Delete clicked'),
    },
    parameters: {
        docs: {
            description: {
                story:
                    'A popular topic with high numbers of courses and coaches.',
            },
        },
    },
};
