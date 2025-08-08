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

// Working Designer Template with full state management (coach-notes aligned)
const WorkingDesignerTemplate = ({ locale = 'en' }: { locale?: TLocale }) => {
    const [linksData, setLinksData] = useState(() => ({
        id: 1,
        type: CourseElementType.Links as const,
        order: 0,
        links: [
            { title: 'Example Resource', url: 'https://example.com' }
        ],
        includeInMaterials: true,
    }));

    const linksElementData: Links = {
        ...linksData,
        locale,
        onNoteLinksChange: (updatedLinks) => {
            setLinksData(prev => ({ ...prev, links: updatedLinks }));
            console.log("Updated Links:", updatedLinks);
        },
        includeInMaterials: linksData.includeInMaterials,
        onIncludeInMaterialsChange: (next) => {
            setLinksData(prev => ({ ...prev, includeInMaterials: next }));
        },
        onImageChange: async (index: number, fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal): Promise<fileMetadata.TFileMetadata> => {
            // temp processing metadata (coach-notes style)
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

            setLinksData(prev => ({
                ...prev,
                links: prev.links.map((l, i) => i === index ? { ...l, customIconMetadata: processingFile } : l)
            }));

            try {
                await new Promise<void>((resolve, reject) => {
                    const tid = setTimeout(resolve, 800);
                    abortSignal?.addEventListener('abort', () => { clearTimeout(tid); reject(new DOMException('Upload cancelled', 'AbortError')); });
                });

                const completed: fileMetadata.TFileMetadata = { ...processingFile, status: 'available', checksum: 'uploaded-checksum' };
                setLinksData(prev => ({
                    ...prev,
                    links: prev.links.map((l, i) => i === index ? { ...l, customIconMetadata: completed } : l)
                }));
                return completed;
            } catch (e) {
                if (e instanceof Error && e.name === 'AbortError') {
                    setLinksData(prev => ({
                        ...prev,
                        links: prev.links.map((l, i) => i === index ? { ...l, customIconMetadata: undefined } : l)
                    }));
                    throw e;
                }
                const failed: fileMetadata.TFileMetadata = { ...processingFile, status: 'unavailable' };
                setLinksData(prev => ({
                    ...prev,
                    links: prev.links.map((l, i) => i === index ? { ...l, customIconMetadata: failed } : l)
                }));
                return failed;
            }
        },
        onDeleteIcon: (index: number) => {
            setLinksData(prev => ({
                ...prev,
                links: prev.links.map((l, i) => i === index ? { ...l, customIconMetadata: undefined } : l)
            }));
        }
    } as unknown as Links;

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
    const studentData = {
        id: 3,
        type: CourseElementType.Links as const,
        order: 0,
        links: Array.from({ length: linksCount }, (_, i) => ({
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
                    url: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
                    thumbnailUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg'
                }
            })
        }))
    };

    const FormComponent = linksElement.formComponent;

    return (
        <FormComponent
            elementInstance={studentData as any}
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
                story: 'Designer view with working functionality — add, edit, delete links, upload/delete custom icons, and toggle include in materials.',
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