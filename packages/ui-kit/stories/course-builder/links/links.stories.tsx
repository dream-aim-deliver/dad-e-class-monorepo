import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import linksElement from '../../../lib/components/course-builder-lesson-component/links';
import { CourseElementType } from '../../../lib/components/course-builder/types';
import { Links } from '../../../lib/components/course-builder-lesson-component/types';
import { TLocale } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta = {
    title: 'Components/CourseBuilder/LinksElement',
    component: () => null,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Links element for course builder with designer and form views. Allows adding and managing links in lessons.',
            },
        },
    },
    argTypes: {
        locale: {
            control: { type: 'select' },
            options: ['en', 'de'],
            description: 'Language locale',
        },
    },
};

export default meta;
type Story = StoryObj;

// Base Links data template
const createLinksData = (
    id: number,
    links: Array<{
        title: string;
        url: string;
        customIconMetadata?: fileMetadata.TFileMetadata;
    }>,
    editingLinkIndex: number | null = null,
    include_in_materials = true
) => ({
    id,
    type: CourseElementType.Links as CourseElementType.Links,
    order: 0,
    editingLinkIndex,
    links,
    include_in_materials,
    locale: 'en' as TLocale,
});

// Working Designer Template with full state management
const WorkingDesignerTemplate = ({ locale = 'en' }: { locale?: TLocale }) => {
    const [linksData, setLinksData] = useState(() => createLinksData(
        1,
        [
            {
                title: 'Example Resource',
                url: 'https://example.com',
                // Start without custom icon to demonstrate upload functionality
            }
        ],
        0  // Start with first link in edit mode
    ));

    // Create the full Links object with handlers
    const linksElementData: Links = {
        ...linksData,
        locale,
        onChange: (updatedData: {
            type: CourseElementType.Links;
            id: number;
            order: number;
            editingLinkIndex: number | null;
            links: {
                title: string;
                url: string;
                customIconMetadata?: fileMetadata.TFileMetadata;
            }[];
            include_in_materials: boolean;
        }) => {
            console.log('onChange called:', updatedData);
            setLinksData(prev => ({
                ...prev,
                ...updatedData,
            }));
        },
        onImageChange: async (
            fileRequest: fileMetadata.TFileUploadRequest,
            index: number,
            abortSignal?: AbortSignal
        ): Promise<fileMetadata.TFileMetadata> => {
            // Create temporary metadata for UI state
            const processingFile: fileMetadata.TFileMetadata = {
                id: fileRequest.id || `temp-${Date.now()}`,
                name: fileRequest.name || 'uploading-icon.png',
                mimeType: fileRequest.file?.type || 'image/png',
                size: fileRequest.file?.size || 1024,
                category: 'image',
                status: 'processing',
                url: fileRequest.file ? URL.createObjectURL(fileRequest.file) : '',
                thumbnailUrl: fileRequest.file ? URL.createObjectURL(fileRequest.file) : '',
                checksum: '',
            };

            // Update with processing state first
            setLinksData(prev => ({
                ...prev,
                links: prev.links.map((link, i) =>
                    i === index ? { ...link, customIconMetadata: processingFile } : link
                )
            }));

            try {
                // Simulate upload with setTimeout that can be aborted
                await new Promise<void>((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        resolve();
                    }, 3000); // 3 second delay to see the spinner

                    // Handle abort signal
                    if (abortSignal) {
                        abortSignal.addEventListener('abort', () => {
                            clearTimeout(timeoutId);
                            reject(new DOMException('Upload cancelled', 'AbortError'));
                        });
                    }
                });

                // Update to completed state
                const completedFile: fileMetadata.TFileMetadata = {
                    ...processingFile,
                    status: 'available',
                    checksum: 'uploaded-checksum',
                };

                // Update the link with the completed file
                setLinksData(prev => ({
                    ...prev,
                    links: prev.links.map((link, i) =>
                        i === index ? { ...link, customIconMetadata: completedFile } : link
                    )
                }));

                return completedFile;

            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    // Remove the file on cancellation
                    setLinksData(prev => ({
                        ...prev,
                        links: prev.links.map((link, i) =>
                            i === index ? { ...link, customIconMetadata: undefined } : link
                        )
                    }));
                    throw error; // Re-throw abort error
                } else {
                    // Handle other errors - set status to 'unavailable'
                    const failedFile: fileMetadata.TFileMetadata = {
                        ...processingFile,
                        status: 'unavailable',
                    };
                    setLinksData(prev => ({
                        ...prev,
                        links: prev.links.map((link, i) =>
                            i === index ? { ...link, customIconMetadata: failedFile } : link
                        )
                    }));
                    return failedFile;
                }
            }
        },

        onDeleteIcon: (id: string) => {
            setLinksData(prev => ({
                ...prev,
                links: prev.links.map((link, idx) =>
                    idx === prev.editingLinkIndex && link.customIconMetadata?.id === id
                        ? { ...link, customIconMetadata: undefined }
                        : link
                )
            }));
        }
    };

    const DesignerComponent = linksElement.designerComponent;

    return (
        <DesignerComponent
            elementInstance={linksElementData}
            onUpClick={(id: number) => console.log('onUpClick:', id)}
            onDownClick={(id: number) => console.log('onDownClick:', id)}
            onDeleteClick={(id: number) => console.log('onDeleteClick:', id)}
            locale={locale}
        />
    );
};

// Student Form Template
const StudentFormTemplate = ({
    locale = 'en',
    linksCount = 3
}: {
    locale?: TLocale;
    linksCount?: number;
}) => {
    const studentData = createLinksData(
        3,
        Array.from({ length: linksCount }, (_, i) => ({
            title: `Student Resource ${i + 1}`,
            url: `https://resource${i + 1}.com`,
            ...(i % 2 === 0 && {
                customIconMetadata: {
                    id: `icon-${i}`,
                    name: `icon-${i}.png`,
                    mimeType: 'image/png',
                    size: 1024,
                    checksum: `checksum-${i}`,
                    status: 'available' as const,
                    category: 'image' as const,
                    url: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
                    thumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
                }
            })
        })),
        null, // No editing in student view
        true
    );

    const FormComponent = linksElement.formComponent;

    return (
        <FormComponent
            elementInstance={studentData}
            locale={locale}
        />
    );
};

// Stories
export const Designer: Story = {
    render: (args: { locale?: TLocale }) => <WorkingDesignerTemplate {...args} />,
    args: {
        locale: 'en',
    },
    parameters: {
        docs: {
            description: {
                story: 'Designer view with working functionality - starts with one example link in edit mode. You can upload custom icons, delete icons, edit links, add new links, and toggle the checkbox.',
            },
        },
    },
};

export const LinkView: Story = {
    render: (args: { locale?: TLocale }) => <StudentFormTemplate {...args} />,
    args: {
        locale: 'en',
    },
    parameters: {
        docs: {
            description: {
                story: 'Student-facing view showing links in read-only mode.',
            },
        },
    },
};