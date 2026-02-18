import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../lib/components/accordion';
import { cn } from '../lib/utils/style-utils';

/**
 * NestedAccordion Component - Demonstrates nested accordions
 * Shows how the maxHeight fix allows nested accordions to work properly
 */
const NestedAccordion: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <Accordion
      className={cn("flex flex-col gap-6", className)}
      type="multiple"
      defaultValue={['module-1']}
    >
      {/* Module 1 */}
      <AccordionItem
        key="module-1"
        value="module-1"
        className="bg-card-fill border border-card-stroke px-6 py-4 rounded-medium"
      >
        <AccordionTrigger
          value="module-1"
          className="w-full"
        >
          <div className="flex items-center gap-4 flex-1">
            <h3 className="text-text-primary font-semibold">Module 1: Introduction to Web Development</h3>
            <span className="text-text-secondary text-xs">3 lessons</span>
          </div>
        </AccordionTrigger>

        <AccordionContent value="module-1" className="pt-4">
          {/* Nested Lessons Accordion */}
          <div className="ml-4">
            <Accordion
              type="multiple"
              className="flex flex-col gap-4"
              defaultValue={['lesson-1-1']}
            >
              {/* Lesson 1.1 */}
              <AccordionItem
                key="lesson-1-1"
                value="lesson-1-1"
                className="bg-base-neutral-800 p-4 rounded-medium border border-base-neutral-700"
              >
                <AccordionTrigger
                  value="lesson-1-1"
                  className="w-full"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <h4 className="text-text-primary">Lesson 1.1: What is HTML?</h4>
                    <span className="text-text-secondary text-xs">Content</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent value="lesson-1-1" className="pt-4">
                  <div className="space-y-4">
                    <div className="text-text-secondary leading-relaxed">
                      <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages.</p>
                      <ul className="list-disc pl-5 mt-2">
                        <li>HTML provides the basic structure of sites</li>
                        <li>It is often assisted by technologies such as CSS and JavaScript</li>
                        <li>Web browsers receive HTML documents and render them into web pages</li>
                      </ul>
                    </div>

                    {/* Nested accordion within lesson content */}
                    <Accordion
                      type="single"
                      className="flex flex-col gap-2 mt-6"
                    >
                      <AccordionItem
                        key="exercise-1"
                        value="exercise-1"
                        className="bg-base-neutral-700 p-3 rounded-medium border border-base-neutral-600"
                      >
                        <AccordionTrigger
                          value="exercise-1"
                          className="w-full text-sm"
                        >
                          <span className="text-text-primary">Exercise: Create Your First HTML Page</span>
                        </AccordionTrigger>
                        <AccordionContent value="exercise-1" className="pt-2">
                          <div className="text-text-secondary text-sm leading-relaxed">
                            Create a simple HTML page with DOCTYPE, html, head, and body tags. Include a heading and paragraph element.
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Lesson 1.2 */}
              <AccordionItem
                key="lesson-1-2"
                value="lesson-1-2"
                className="bg-base-neutral-800 p-4 rounded-medium border border-base-neutral-700"
              >
                <AccordionTrigger
                  value="lesson-1-2"
                  className="w-full"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <h4 className="text-text-primary">Lesson 1.2: CSS Fundamentals</h4>
                    <span className="text-text-secondary text-xs">Content</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent value="lesson-1-2" className="pt-4">
                  <div className="text-text-secondary leading-relaxed">
                    <p>CSS (Cascading Style Sheets) is used to describe the presentation of a document written in HTML.</p>
                    <h4 className="text-lg font-semibold mt-4 mb-2">Key CSS Concepts</h4>
                    <ol className="list-decimal pl-5">
                      <li>Selectors: How to target HTML elements</li>
                      <li>Properties: What styling to apply</li>
                      <li>Values: The specific styling values</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Lesson 1.3 */}
              <AccordionItem
                key="lesson-1-3"
                value="lesson-1-3"
                className="bg-base-neutral-800 p-4 rounded-medium border border-base-neutral-700"
              >
                <AccordionTrigger
                  value="lesson-1-3"
                  className="w-full"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <h4 className="text-text-primary">Lesson 1.3: JavaScript Basics</h4>
                    <span className="text-text-secondary text-xs">Content</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent value="lesson-1-3" className="pt-4">
                  <div className="space-y-4">
                    <div className="text-text-secondary leading-relaxed">
                      <p>JavaScript is a programming language that enables interactive web pages.</p>
                      <h4 className="text-lg font-semibold mt-4 mb-2">Basic JavaScript Concepts</h4>
                      <ul className="list-disc pl-5">
                        <li>Variables: Storing data values</li>
                        <li>Functions: Reusable blocks of code</li>
                        <li>Events: Responding to user interactions</li>
                        <li>DOM manipulation: Changing HTML content dynamically</li>
                      </ul>
                    </div>

                    {/* Deeply nested accordion */}
                    <Accordion
                      type="multiple"
                      className="flex flex-col gap-2 mt-6"
                      defaultValue={['code-example']}
                    >
                      <AccordionItem
                        key="code-example"
                        value="code-example"
                        className="bg-base-neutral-700 p-3 rounded-medium border border-base-neutral-600"
                      >
                        <AccordionTrigger
                          value="code-example"
                          className="w-full text-sm"
                        >
                          <span className="text-text-primary">Code Example: Hello World</span>
                        </AccordionTrigger>
                        <AccordionContent value="code-example" className="pt-2">
                          <div className="text-text-secondary text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded">
                            // JavaScript Hello World<br/>
                            console.log("Hello, World!");<br/><br/>
                            // Simple alert example:<br/>
                            alert("Hello, World!");
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        key="exercise-js"
                        value="exercise-js"
                        className="bg-base-neutral-700 p-3 rounded-medium border border-base-neutral-600"
                      >
                        <AccordionTrigger
                          value="exercise-js"
                          className="w-full text-sm"
                        >
                          <span className="text-text-primary">Exercise: Your First JavaScript</span>
                        </AccordionTrigger>
                        <AccordionContent value="exercise-js" className="pt-2">
                          <div className="text-text-secondary text-sm leading-relaxed">
                            Try creating a simple JavaScript program that displays an alert when a button is clicked.
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Module 2 */}
      <AccordionItem
        key="module-2"
        value="module-2"
        className="bg-card-fill border border-card-stroke px-6 py-4 rounded-medium"
      >
        <AccordionTrigger
          value="module-2"
          className="w-full"
        >
          <div className="flex items-center gap-4 flex-1">
            <h3 className="text-text-primary font-semibold">Module 2: Advanced Topics</h3>
            <span className="text-text-secondary text-xs">2 lessons</span>
          </div>
        </AccordionTrigger>

        <AccordionContent value="module-2" className="pt-4">
          <div className="ml-4">
            <Accordion
              type="multiple"
              className="flex flex-col gap-4"
            >
              <AccordionItem
                key="lesson-2-1"
                value="lesson-2-1"
                className="bg-base-neutral-800 p-4 rounded-medium border border-base-neutral-700"
              >
                <AccordionTrigger
                  value="lesson-2-1"
                  className="w-full"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <h4 className="text-text-primary">Lesson 2.1: React Components</h4>
                    <span className="text-text-secondary text-xs">Content</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent value="lesson-2-1" className="pt-4">
                  <div className="text-text-secondary leading-relaxed">
                    <p>React components are the building blocks of React applications.</p>
                    <p>Components can be functional or class-based.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                key="lesson-2-2"
                value="lesson-2-2"
                className="bg-base-neutral-800 p-4 rounded-medium border border-base-neutral-700"
              >
                <AccordionTrigger
                  value="lesson-2-2"
                  className="w-full"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <h4 className="text-text-primary">Lesson 2.2: State Management</h4>
                    <span className="text-text-secondary text-xs">Content</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent value="lesson-2-2" className="pt-4">
                  <div className="text-text-secondary leading-relaxed">
                    <p>State management is crucial for building complex applications.</p>
                    <p>Learn about different approaches and best practices.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

/**
 * Storybook metadata for NestedAccordion
 */
const meta: Meta<typeof NestedAccordion> = {
  title: 'Components/Accordion/NestedAccordion',
  component: NestedAccordion,
  tags: ['docs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Demonstrates nested accordions. This story showcases how the maxHeight fix allows deeply nested accordions to expand and collapse smoothly without breaking the layout.'
      }
    }
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;

type Story = StoryObj<typeof NestedAccordion>;

/**
 * Default nested accordion story
 */
export const Default: Story = {
  args: {
    className: 'max-w-4xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'A comprehensive example of nested accordions. Shows 3 levels of nesting: Module → Lesson → Exercise/Code Example.'
      }
    }
  },
};

/**
 * Compact nested accordion story
 */
export const Compact: Story = {
  args: {
    className: 'max-w-2xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'A more compact version of the nested accordion with smaller max-width. Demonstrates responsive behavior.'
      }
    }
  },
};
