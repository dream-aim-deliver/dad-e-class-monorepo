import type { Meta, StoryObj } from '@storybook/react';
import { type Descendant } from 'slate';
import accordionElement from '../lib/components/course-builder-lesson-component/accordion-lesson';
import { CourseElementType } from '../lib/components/course-builder/types';
import type { AccordionElement } from '../lib/components/course-builder-lesson-component/types';
import type { DesignerComponentProps } from '../lib/components/course-builder/types';

const meta = {
  title: 'Components/AccordionLesson',
  component: accordionElement.designerComponent,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en'
    }
  }
} satisfies Meta<typeof accordionElement.designerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAccordionData = {
  id: 1,
  type: CourseElementType.Accordion,
  order: 1,
  accordionData: [
    {
      title: "Getting Started",
      content: "Welcome to the getting started guide."
    },
    {
      title: "Basic Usage",
      content: "Learn how to use the basic features."
    }
  ]
} satisfies AccordionElement;

export const Primary: Story = {
  args: {
    elementInstance: mockAccordionData,
    locale: 'en',
    onUpClick: (id: number) => console.log('Up clicked', id),
    onDownClick: (id: number) => console.log('Down clicked', id),
    onDeleteClick: (id: number) => console.log('Delete clicked', id),
  } satisfies DesignerComponentProps
};

export const Empty: Story = {
  args: {
    elementInstance: {
      ...mockAccordionData,
      accordionData: []
    },
    locale: 'en',
    onUpClick: (id: number) => console.log('Up clicked', id),
    onDownClick: (id: number) => console.log('Down clicked', id),
    onDeleteClick: (id: number) => console.log('Delete clicked', id),
  } satisfies DesignerComponentProps
};

// That's all we need for now!