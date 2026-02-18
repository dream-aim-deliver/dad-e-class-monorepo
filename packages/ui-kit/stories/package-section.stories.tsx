import type { Meta, StoryObj } from '@storybook/react-vite';
import PackageSection from '../lib/components/cms/offerpage-edit/package-section';

const meta: Meta<typeof PackageSection> = {
    title: 'Components/CMS/PackageSection',
    component: PackageSection,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        initialValue: {
            control: 'object',
            description: 'Initial selected package IDs',
        },
        packages: {
            control: 'object',
            description: 'Available packages for selection',
        },
        linkedPackages: {
            control: 'object',
            description: 'Package IDs already linked to the offers page',
        },
        onChange: {
            action: 'changed',
            description: 'Callback fired when selected packages change',
        },
    },
};

export default meta;
type Story = StoryObj<typeof PackageSection>;

// Mock package data
const mockPackages = [
    {
        id: 'pkg-001',
        name: 'Full Stack Web Development Bootcamp',
    },
    {
        id: 'pkg-002',
        name: 'Data Science & Machine Learning Mastery',
    },
    {
        id: 'pkg-003',
        name: 'Mobile App Development with React Native',
    },
    {
        id: 'pkg-004',
        name: 'Cloud Computing & DevOps Essentials',
    },
    {
        id: 'pkg-005',
        name: 'UI/UX Design Fundamentals',
    },
    {
        id: 'pkg-006',
        name: 'Digital Marketing & SEO Strategies',
    },
];

export const Default: Story = {
    args: {
        packages: mockPackages,
        linkedPackages: [],
        onChange: (selectedIds) => console.log('Selected packages changed:', selectedIds),
    },
};

export const WithPreSelectedPackages: Story = {
    args: {
        packages: mockPackages,
        linkedPackages: ['pkg-001', 'pkg-003'],
        onChange: (selectedIds) => console.log('Selected packages changed:', selectedIds),
    },
};

export const WithInitialSelection: Story = {
    args: {
        packages: mockPackages,
        linkedPackages: ['pkg-002'],
        initialValue: ['pkg-002', 'pkg-004'],
        onChange: (selectedIds) => console.log('Selected packages changed:', selectedIds),
    },
};

export const LargePackageList: Story = {
    args: {
        packages: [
            ...mockPackages,
            {
                id: 'pkg-007',
                name: 'Advanced Python Programming',
            },
            {
                id: 'pkg-008',
                name: 'Machine Learning with TensorFlow',
            },
            {
                id: 'pkg-009',
                name: 'Cybersecurity Fundamentals',
            },
            {
                id: 'pkg-010',
                name: 'Blockchain Development',
            },
            {
                id: 'pkg-011',
                name: 'Game Development with Unity',
            },
            {
                id: 'pkg-012',
                name: 'Project Management Professional',
            },
        ],
        linkedPackages: ['pkg-001', 'pkg-007', 'pkg-010'],
        onChange: (selectedIds) => console.log('Selected packages changed:', selectedIds),
    },
};

export const EmptyPackageList: Story = {
    args: {
        packages: [],
        linkedPackages: [],
        onChange: (selectedIds) => console.log('Selected packages changed:', selectedIds),
    },
};

export const Interactive: Story = {
    args: {
        packages: mockPackages,
        linkedPackages: ['pkg-002'],
        onChange: (selectedIds) => {
            console.log('Selected packages changed:', selectedIds);
            alert(`Selected ${selectedIds.length} packages: ${selectedIds.join(', ')}`);
        },
    },
};