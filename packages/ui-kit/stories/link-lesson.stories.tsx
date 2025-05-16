import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DesignerComponent, FormComponent, LinkType } from '../lib/components/course-builder-lesson-component/link-lesson';
import { CourseElementType } from '../lib/components/course-builder/types';

const meta: Meta<typeof DesignerComponent> = {
    title: 'Components/Course-builder/LinkLesson',
    component: DesignerComponent,
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        includeInMaterials: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof DesignerComponent>;

// Mock element instance for Designer view
const mockDesignerElement = {
    id: 'link-1',
    type: CourseElementType.Links,
    order: 1,
    links: [],
    includeInMaterials: false,
};

// Mock element instance for Form view with sample links
const mockFormElement = {
    id: 'link-1',
    type: CourseElementType.Links,
    order: 1,
    links: [
        {
            title: 'Documentation',
            url: 'https://miro.com/',
            file: null,
        },
        {
            title: 'Tutorial Video',
            url: 'https://canva.com/',
            file: null,
        },
    ],
};

type DesignerWrapperProps = Omit<Parameters<typeof DesignerComponent>[0], 'links' | 'includeInMaterials' | 'onChange'>;

const DesignerWrapper = (args: DesignerWrapperProps) => {
    const [links, setLinks] = useState<LinkType[]>([{
                title: "",
                url: "",
                file: null,
                isEdit: true,
            }]);
    const [includeInMaterials, setIncludeInMaterials] = useState(false);

    const handleChange = (newLinks: LinkType[], newIncludeInMaterials: boolean) => {
        setLinks(newLinks);
        setIncludeInMaterials(newIncludeInMaterials);
        console.log('Links changed:', newLinks);
        console.log('Include in materials changed:', newIncludeInMaterials);
    };

    return (
        <DesignerComponent
            {...args}
            links={links}
            includeInMaterials={includeInMaterials}
            onChange={handleChange}
        />
    );
};

export const EmptyDesigner: Story = {
    render: (args) => <DesignerWrapper {...args} />,
    args: {
        elementInstance: mockDesignerElement,
        locale: 'en',
        onUpClick: (id: string) => console.log('Up clicked', id),
        onDownClick: (id: string) => console.log('Down clicked', id),
        onDeleteClick: (id: string) => console.log('Delete clicked', id),
    },
};

export const GermanDesigner: Story = {
    render: (args) => <DesignerWrapper {...args} />,
    args: {
        ...EmptyDesigner.args,
        locale: 'de',
    },
};

export const FormView: StoryObj<typeof FormComponent> = {
    render: (args) => <FormComponent {...args} />,
    args: {
        elementInstance: mockFormElement,
        locale: 'en',
    },
};

export const GermanFormView: StoryObj<typeof FormComponent> = {
    render: (args) => <FormComponent {...args} />,
    args: {
        elementInstance: mockFormElement,
        locale: 'de',
    },
};