import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconAwarded } from '../lib/components/icons/icon-awarded';

const meta: Meta<typeof IconAwarded> = {
    title: 'Icons/IconAwarded',
    component: IconAwarded,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A decorative gold award badge/seal icon with star pattern. Used in certificates and achievement displays.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'Additional CSS classes to apply to the icon',
            table: {
                type: { summary: 'string' },
            },
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg', 'xl'],
            description: 'Predefined size of the icon',
            table: {
                type: { summary: 'sm | md | lg | xl' },
                defaultValue: { summary: 'md' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Default IconAwarded at medium size.',
            },
        },
    },
};

// Small size
export const Small: Story = {
    args: {
        size: 'sm',
    },
    parameters: {
        docs: {
            description: {
                story: 'Small sized award icon.',
            },
        },
    },
};

// Medium size
export const Medium: Story = {
    args: {
        size: 'md',
    },
    parameters: {
        docs: {
            description: {
                story: 'Medium sized award icon (default).',
            },
        },
    },
};

// Large size
export const Large: Story = {
    args: {
        size: 'lg',
    },
    parameters: {
        docs: {
            description: {
                story: 'Large sized award icon.',
            },
        },
    },
};

// Extra Large size
export const ExtraLarge: Story = {
    args: {
        size: 'xl',
    },
    parameters: {
        docs: {
            description: {
                story: 'Extra large sized award icon.',
            },
        },
    },
};

// With custom className
export const WithCustomClass: Story = {
    args: {
        className: 'opacity-50 hover:opacity-100 transition-opacity',
        size: 'lg',
    },
    parameters: {
        docs: {
            description: {
                story: 'Award icon with custom CSS classes for opacity and hover effects.',
            },
        },
    },
};

// On dark background
export const OnDarkBackground: Story = {
    args: {
        size: 'lg',
    },
    decorators: [
        (Story) => (
            <div style={{
                backgroundColor: '#0C0A09',
                padding: '40px',
                borderRadius: '8px'
            }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Award icon displayed on a dark background (simulating certificate background).',
            },
        },
    },
};

// On light background
export const OnLightBackground: Story = {
    args: {
        size: 'lg',
    },
    decorators: [
        (Story) => (
            <div style={{
                backgroundColor: '#F5F5F5',
                padding: '40px',
                borderRadius: '8px'
            }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Award icon displayed on a light background.',
            },
        },
    },
};

// Multiple sizes comparison
export const SizeComparison: Story = {
    render: () => (
        <div style={{
            display: 'flex',
            gap: '30px',
            alignItems: 'center',
            flexWrap: 'wrap'
        }}>
            <div style={{ textAlign: 'center' }}>
                <IconAwarded size="sm" />
                <p style={{ marginTop: '8px', fontSize: '12px' }}>Small</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <IconAwarded size="md" />
                <p style={{ marginTop: '8px', fontSize: '12px' }}>Medium</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <IconAwarded size="lg" />
                <p style={{ marginTop: '8px', fontSize: '12px' }}>Large</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <IconAwarded size="xl" />
                <p style={{ marginTop: '8px', fontSize: '12px' }}>Extra Large</p>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Comparison of all available sizes side by side.',
            },
        },
    },
};

// In certificate context
export const InCertificateContext: Story = {
    render: () => (
        <div style={{
            backgroundColor: '#0C0A09',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            maxWidth: '400px'
        }}>
            <div style={{
                backgroundColor: '#1C1917',
                border: '1px solid #292524',
                borderRadius: '8px',
                padding: '30px',
                color: 'white'
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                    Certificate of Completion
                </h2>
                <p style={{ fontSize: '14px', marginBottom: '15px' }}>
                    This is to certify that
                </p>
                <p style={{ fontSize: '22px', fontStyle: 'italic', marginBottom: '15px' }}>
                    John Doe
                </p>
                <p style={{ fontSize: '12px', marginBottom: '10px' }}>
                    for successfully completing the course
                </p>
                <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '20px' }}>
                    "React Fundamentals"
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <IconAwarded size="lg" />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    color: '#D1D5DB'
                }}>
                    <div>
                        <p>Certificate ID</p>
                        <p style={{ fontWeight: 'bold' }}>CER-123456</p>
                    </div>
                    <div>
                        <p>Awarded on</p>
                        <p style={{ fontWeight: 'bold' }}>Jan 15, 2025</p>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Award icon shown in context of a certificate design, demonstrating its typical usage.',
            },
        },
    },
};
