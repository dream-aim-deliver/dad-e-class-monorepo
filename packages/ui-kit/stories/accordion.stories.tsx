import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from '../lib/components/accordion';
import { TAccordionList } from 'packages/models/src/home-page';
import RichTextRenderer from '../lib/components/rich-text-element/renderer';
import { cn } from '../lib/utils/style-utils';
import { UserAvatar } from '../lib/components/avatar/user-avatar';


/**
 * HomeAccordion Component - A custom accordion component for displaying FAQs or structured content.
 * This component is designed to work within Storybook for UI testing and development.
 *
 * Features:
 * - Uses the Accordion component for collapsible sections.
 * - Supports numbered items.
 * - Supports rich text content using Slate.js.
 * - Optional icons for each item.
 *
 * Props:
 * @param {string} title - The title of the accordion section.
 * @param {boolean} showNumbers - Whether to show item numbers.
 * @param {Array} items - List of items containing title, content, position, and optional icon.
 */
// Define Storybook metadata
const meta: Meta = {
  title: 'Components/HomeAccordion',
  component: Accordion,
  tags: ['docs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the accordion section.',
    },
    showNumbers: {
      control: 'boolean',
      description: 'Whether to show item numbers.',
    },
    items: {
      control: 'object',
      description:
        'List of items containing title, content, position, and optional icon.',
    },
  },
};

export default meta;

// Example Data without icons
const accordionData: TAccordionList = {
  title: 'Frequently Asked Questions',
  showNumbers: true,
  items: [
    {
      title: 'What is Storybook?',
      content:
        '[{"type":"paragraph","children":[{"text":"Storybook is a tool for developing UI components in isolation."}]}]',
      position: 1,
    },
    {
      title: 'Why use Storybook?',
      content:
        '[{"type":"bulleted-list","children":[{"type":"list-item","children":[{"text":"Helps in UI development and testing."}]}]}]',
      position: 2,
    },
  ],
};

// Example Data with icons
const accordionDataWithIcons: TAccordionList = {
  title: 'Frequently Asked Questions',
  showNumbers: true,
  items: [
    {
      title: 'What is Storybook?',
      content:
        '[{"type":"paragraph","children":[{"text":"This text is highlighted.","highlight":true}]}]',
      position: 1,
      iconImageUrl: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
    },
    {
      title: 'Why use Storybook?',
      content:
        '[{"type":"bulleted-list","children":[{"type":"list-item","children":[{"text":"Useful for UI component testing."}]}]}]',
      position: 2,
      iconImageUrl: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
    },
  ],
};

// Define the HomeAccordion component
const HomeAccordion: React.FC<TAccordionList> = ({
  title,
  showNumbers,
  items,
}) => {
  return (
    <Accordion className='flex flex-col gap-7 w-full' type="single" defaultValue={[items[0].title]}>
      <h2 className="text-text-primary">{title}</h2>
      <div className=" w-full  rounded-medium py-4 px-6">
        {items?.map((item, index) => (
          <AccordionItem
            className={cn(
              'py-6',
              items.length - 1 !== index && 'border-b border-divider',
            )}
            key={item.title}
            value={item.title}
          >
            <AccordionTrigger
              value={item.title}


            >
              <div className="flex items-center gap-4">
                {showNumbers && item.position && <h4 className="text-action-default">{item.position}.</h4>}
                <div className="flex items-center gap-3 ">
                  {item.iconImageUrl && (
                    <div className="flex items-center justify-center">
                      <UserAvatar imageUrl={item.iconImageUrl} size="small" />
                    </div>
                  )}
                  <h5 className="text-text-primary font-medium">{item.title}</h5>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent value={item.title} className="px-8 pt-2 ">
              <RichTextRenderer content={item.content} className="lg:text-md text-normal leading-[150%]  text-text-secondary" />
            </AccordionContent>
          </AccordionItem>
        ))}
      </div>
    </Accordion>
  );
};

// Stories
export const Default: StoryObj = {
  args: {
    ...accordionData, // Spread the existing data
  },

  render: (args) => <HomeAccordion {...args} />,
};

export const WithIcons: StoryObj = {
  args: {
    ...accordionDataWithIcons, // Spread the icon data
  },

  render: (args) => <HomeAccordion {...args} />,
};