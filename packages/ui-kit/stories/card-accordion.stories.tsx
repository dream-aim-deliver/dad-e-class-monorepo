import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../lib/components/accordion';
import { IconChevronUp } from '../lib/components/icons/icon-chevron-up';
import { IconChevronDown } from '../lib/components/icons/icon-chevron-down';
import { cn } from '../lib/utils/style-utils';
import RichTextRenderer from '../lib/components/rich-text-element/renderer';
import { LinkPreview } from '../lib/components/links';
import { FilePreview } from '../lib/components/drag-and-drop-uploader/file-preview';
import { IconCloudDownload } from '../lib/components/icons';

/**
 * CardAccordion Component - A card-style accordion component with chevron icons
 * and 16px gap between items.
 */
const CardAccordion: React.FC<{
  items: {
    title: string;
    content: string;
  }[];
  className?: string;
}> = ({ items, className }) => {
  return (
    <Accordion
      className={cn("flex flex-col gap-4 ", className)}
      type="multiple"
    >
      <div className="w-full space-y-4">
        {items?.map((item, index) => (
          <AccordionItem
            className={cn(
              'bg-card-fill px-6 py-4 rounded-medium ',
            )}
            key={item.title}
            value={item.title}
          >
            <AccordionTrigger
              value={item.title}
              className="w-full bg-card-fill text-black"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <h4 className="text-base-white md:text-2xl text-xl">
                    {item.title}
                  </h4>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent value={item.title} className="bg-card-fill text-black">
              <div className="text-text-secondary leading-relaxed">
                {item.content}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </div>
    </Accordion>
  );
};



/**
 * CourseMaterialsAccordion Component - Displays course modules with lessons and materials
 * based on the actual course materials data structure.
 */
const CourseMaterialsAccordion: React.FC<{
  courseMaterials: {
    modules: {
      id: string;
      position: number;
      title: string;
      lessons: {
        id: string;
        position: number;
        title: string;
        materials: {
          type: 'richText' | 'links' | 'downloadFiles';
          text?: string;
          links?: { title: string; url: string }[];
          files?: { name: string; downloadUrl: string }[];
        }[];
      }[];
      lessonCount: number;
    }[];
    moduleCount: number;
  };
  className?: string;
}> = ({ courseMaterials, className }) => {


  const renderMaterial = (material: any) => {
    switch (material.type) {
      case 'richText':
        return (
          <div key={material.id}>
            <RichTextRenderer
              content={material.text || ''}
              onDeserializationError={(message, error) => {
                console.error('Error deserializing rich text:', message, error);
              }}
              className="text-text-secondary md:text-[24px] text-lg leading-relaxed"
            />
          </div>
        );
      case 'links':
        return (
          <div key={material.id }>
            <p className="font-important md:text-md text-sm text-text-primary">Useful Links:</p>
            <div className="p-4 border border-card-stroke rounded-medium">
              {material.links?.map((link: any, idx: number) => (
                <LinkPreview
                  key={idx}
                  title={link.title}
                  url={link.url}
                  preview={false}
                />
              ))}
            </div>
          </div>
        );
      case 'downloadFiles':
        return (
          <div key={material.id}>
           <span className="flex items-center gap-2"><IconCloudDownload classNames='text-text-primary'/> <p className="font-important md:text-md text-sm text-text-primary">Download Files:</p></span>
            <div className="p-4 border border-card-stroke rounded-medium">
              {material.files?.map((file: any, idx: number) => (
                <FilePreview
                  key={idx}
                  uploadResponse={{
                    id: file.id || `file-${idx}`,
                    name: file.name,
                    size: file.size || 0,
                    category: 'generic',
                    status: 'available',
                    url: file.downloadUrl,
                  }}
                  onDownload={(id) => window.open(file.downloadUrl, '_blank')}
                  deletion={{ isAllowed: false }}
                  readOnly={true}
                  locale="en"
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Accordion
      className={cn("flex flex-col gap-6", className)}
      type="multiple"
    >
      {courseMaterials.modules?.map((module, moduleIndex) => (
        <AccordionItem
          key={module.id}
          value={module.title}
          className="bg-card-fill border border-card-stroke px-6 py-4 rounded-medium"
        >
          <AccordionTrigger
            value={module.title}
            className="w-ful"
            expandIcon={<IconChevronUp size="6" className="text-button-text" />}
            collapseIcon={<IconChevronDown size="6" className="text-button-text" />}
          >
            <div className="flex items-center gap-4 flex-1">
              <h4 className="text-base-white md:text-2xl text-xl font-semibold">
               {module.title}
              </h4>
              <span className="text-text-secondary text-bottom font-medium">
                          {module.position}/{courseMaterials.moduleCount} module
                        </span>
            </div>
          </AccordionTrigger>

          <AccordionContent
            value={module.title}
            className="text-black pt-4"
          >
            {/* Lessons Accordion within Module */}
            <div className="ml-6">
              <Accordion
                type="multiple"
                className="flex flex-col gap-4"
              >
                {module.lessons.map((lesson, lessonIndex) => (
                  <AccordionItem
                    key={lesson.id}
                    value={lesson.title}
                  className="bg-base-neutral-800 p-4 rounded-medium border border-base-neutral-700"
                  >
                    <AccordionTrigger
                      value={lesson.title}
                      expandIcon={<IconChevronUp size="5" classNames="text-button-primary-text" />}
                      collapseIcon={<IconChevronDown size="5" classNames="text-button-primary-text" />}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <h5 className="text-text-primary md:text-[24px] text-lg">
                          {lesson.title}
                        </h5>
                         <span className="text-text-secondary text-bottom font-medium">
                          {lesson.position}/{module.lessonCount} Lesson
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent
                      value={lesson.title}
                    >

                         <hr className='bg-divider my-4'/>
                      <div className="flex flex-col gap-4">
                       
                        {lesson.materials?.map((material) => renderMaterial(material))}
                        {(!lesson.materials || lesson.materials.length === 0) && (
                          <div className="text-text-secondary">
                            No materials available for this lesson.
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

/**
 * Storybook metadata for CardAccordion
 */
const meta: Meta<typeof CardAccordion> = {
  title: 'Components/CardAccordion',
  component: CardAccordion,
  tags: ['docs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of accordion items with title and content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CardAccordion>;

// Sample course materials data
const sampleCourseMaterials = {
  modules: [
    {
      id: 'module-1',
      position: 1,
      title: 'Introduction to Web Development',
      lessonCount: 3,
      lessons: [
        {
          id: 'lesson-1-1',
          position: 1,
          title: 'What is HTML?',
          materials: [
            {
              type: 'richText' as const,
              text: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page semantically.',
            },
            {
              type: 'links' as const,
              links: [
                { title: 'MDN HTML Documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
                { title: 'W3Schools HTML Tutorial', url: 'https://www.w3schools.com/html/' }
              ]
            }
          ]
        },
        {
          id: 'lesson-1-2',
          position: 2,
          title: 'CSS Fundamentals',
          materials: [
            {
              type: 'richText' as const,
              text: 'CSS (Cascading Style Sheets) is used to describe the presentation of a document written in HTML. It controls the layout, colors, fonts, and overall appearance.',
            },
            {
              type: 'downloadFiles' as const,
              files: [
                { name: 'css-cheatsheet.pdf', downloadUrl: 'https://example.com/css-cheatsheet.pdf' },
                { name: 'sample-styles.css', downloadUrl: 'https://example.com/sample-styles.css' }
              ]
            }
          ]
        },
        {
          id: 'lesson-1-3',
          position: 3,
          title: 'JavaScript Basics',
          materials: [
            {
              type: 'richText' as const,
              text: 'JavaScript is a programming language that enables interactive web pages. It is an essential part of web applications.',
            }
          ]
        }
      ]
    },
    {
      id: 'module-2',
      position: 2,
      title: 'Advanced Topics',
      lessonCount: 2,
      lessons: [
        {
          id: 'lesson-2-1',
          position: 1,
          title: 'React Components',
          materials: [
            {
              type: 'links' as const,
              links: [
                { title: 'React Official Documentation', url: 'https://reactjs.org/docs/getting-started.html' }
              ]
            }
          ]
        },
        {
          id: 'lesson-2-2',
          position: 2,
          title: 'State Management',
          materials: [
            {
              type: 'richText' as const,
              text: 'State management is crucial for building complex applications. Learn about different approaches and best practices.',
            },
            {
              type: 'downloadFiles' as const,
              files: [
                { name: 'state-management-guide.pdf', downloadUrl: 'https://example.com/state-guide.pdf' }
              ]
            }
          ]
        }
      ]
    }
  ],
  moduleCount: 2
};

/**
 * Course Materials Accordion story
 */
export const CourseMaterials: Story = {
  render: () => (
    <CourseMaterialsAccordion
      courseMaterials={sampleCourseMaterials}
      className="max-w-4xl"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'A nested accordion structure showing course modules with lessons and materials. Each module contains lessons that can be expanded to show rich text content, links, and downloadable files.',
      },
    },
  },
};

// Sample data for the stories
const sampleItems = [
  {
    title: 'Getting Started',
    content: 'Welcome to our platform! This guide will help you get started with the basic features and setup process. Learn how to create your account, customize your profile, and explore the main dashboard.',
  },
  {
    title: 'Account Settings',
    content: 'Manage your account preferences including notification settings, privacy options, and security features. You can update your personal information, change your password, and configure two-factor authentication.',
  },
  {
    title: 'Billing & Payments',
    content: 'Learn about our pricing plans, payment methods, and billing cycles. View your current subscription, update payment information, and manage invoices. We support various payment methods including credit cards and PayPal.',
  },
  {
    title: 'Support & Help',
    content: 'Find answers to frequently asked questions, contact our support team, or browse our knowledge base. We\'re here to help you succeed with our platform and make the most of your experience.',
  },
];

/**
 * Default CardAccordion story
 */
export const Default: Story = {
  args: {
    items: sampleItems,
    className: 'max-w-2xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'A card-style accordion with chevron icons and 16px gap between items. Each card expands to show detailed content.',
      },
    },
  },
};

/**
 * Single item story
 */
export const SingleItem: Story = {
  args: {
    items: [sampleItems[0]],
    className: 'max-w-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'CardAccordion with a single item to demonstrate the card styling and expand/collapse functionality.',
      },
    },
  },
};

/**
 * Many items story
 */
export const ManyItems: Story = {
  args: {
    items: [
      ...sampleItems,
      {
        title: 'Advanced Features',
        content: 'Explore our advanced features including API integration, custom workflows, and automation tools. These features are designed for power users who need more control and customization options.',
      },
      {
        title: 'Team Collaboration',
        content: 'Learn how to collaborate with your team members, share projects, and manage permissions. Our platform supports real-time collaboration and version control for seamless teamwork.',
      },
      {
        title: 'Analytics & Reporting',
        content: 'Access detailed analytics and reporting tools to track your progress, measure performance, and generate insights. Create custom reports and dashboards to visualize your data.',
      },
    ],
    className: 'max-w-3xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'CardAccordion with many items to show how the 16px gap and card styling works with a larger dataset.',
      },
    },
  },
};

/**
 * Custom styling story
 */
export const CustomStyling: Story = {
  args: {
    items: sampleItems,
    className: 'max-w-2xl border-2 border-dashed border-gray-300 p-4 rounded-xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'CardAccordion with custom container styling to demonstrate how the component can be integrated into different layouts.',
      },
    },
  },
};
