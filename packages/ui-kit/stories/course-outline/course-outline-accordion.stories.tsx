import { Meta, StoryObj } from '@storybook/react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from '../../lib/components/accordion';
import {ModuleHeader} from '../../lib/components/course-outline/module-header';
import { LessonLink } from '../../lib/components/course-outline/lesson-link';
import { LessonLinkItem } from '../../lib/components/course-outline/lesson-link-item';
import { Milestone } from '../../lib/components/course-outline/milestone';
import { cn } from '../../lib/utils/style-utils';
import { FC, useState } from 'react'; 

const meta: Meta = {
  title: 'Components/CourseOutline/CourseOutlineAccordion',
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

interface TLesson {
  type: 'lesson';
  title: string;
  completed?: boolean;
  optional?: boolean;
  updated?: boolean;
}

interface TMilestone {
  type: 'milestone';
  completed?: boolean;
}

type TModuleItem = TLesson | TMilestone;

interface TModule {
  moduleTitle: string;
  items: TModuleItem[];
  completed?: boolean;
}

interface TAccordionList {
  title: string;
  modules: TModule[];  
}

// Properly typed data with explicit literal types
const modulesData: TAccordionList = {
  title: 'Course Outline',
  modules: [
    {
      moduleTitle: 'Web Fundamentals',
      items: [
        { 
          type: 'lesson', 
          title: 'HTML5 Essentials', 
          completed: true, 
          updated: true 
        },
        { 
          type: 'lesson', 
          title: 'CSS3 Styling Techniques', 
          completed: true 
        },
        { 
          type: 'lesson', 
          title: 'Responsive Design Principles', 
          completed: true, 
          optional: true 
        },
        { 
          type: 'lesson', 
          title: 'JavaScript Basics', 
          completed: true, 
          optional: true, 
          updated: true 
        },
        { 
          type: 'milestone', 
          completed: true 
        }
      ],
      completed: true
    },
    {
      moduleTitle: 'Frontend Development',
      items: [
        { 
          type: 'milestone', 
          completed: true 
        },
        { 
          type: 'lesson', 
          title: 'React.js Fundamentals', 
          completed: true 
        },
        { 
          type: 'lesson', 
          title: 'State Management with Redux', 
          completed: true 
        },
        { 
          type: 'lesson', 
          title: 'React Router v6', 
          completed: true 
        },
        { 
          type: 'milestone', 
          completed: true 
        }
      ],
      completed: true
    },
    {
      moduleTitle: 'Backend Development',
      items: [
        { 
          type: 'lesson', 
          title: 'Node.js & Express Basics', 
          completed: true 
        },
        { 
          type: 'lesson', 
          title: 'REST API Design' 
        },
        { 
          type: 'lesson', 
          title: 'Database Modeling with MongoDB', 
          updated: true 
        },
        { 
          type: 'lesson', 
          title: 'Authentication Strategies' 
        },
        { 
          type: 'milestone', 
          completed: false 
        }
      ]
    },
    {
      moduleTitle: 'Advanced Concepts',
      items: [
        { 
          type: 'lesson', 
          title: 'GraphQL Implementation' 
        },
        { 
          type: 'lesson', 
          title: 'TypeScript for Full-Stack' 
        },
        { 
          type: 'lesson', 
          title: 'WebSockets & Real-time Features' 
        }
      ]
    },
    {
      moduleTitle: 'Capstone Project',
      items: [
        { 
          type: 'lesson', 
          title: 'Project Planning & Architecture' 
        },
        { 
          type: 'lesson', 
          title: 'Agile Development Workflow' 
        },
        { 
          type: 'lesson', 
          title: 'Deployment Strategies' 
        },
        { 
          type: 'milestone', 
          completed: false 
        }
      ]
    }
  ]
};

// Define the CourseOutlineAccordion component
const CourseOutlineAccordion: FC<TAccordionList> = ({
  title,
  modules,
}) => {
  const [activeLessons, setActiveLessons] = useState<Record<string, number>>({});
  
  let lessonCounter = 0;

  // Handle lesson item click
  const handleLessonClick = (moduleTitle: string, index: number) => {
    setActiveLessons(prev => ({
      ...prev,
      [moduleTitle]: prev[moduleTitle] === index ? -1 : index 
    }));
  };

  return (
    <Accordion className='flex flex-col gap-7 md:w-[343px] w-[280px]' type="single" defaultValue={[modules[0].moduleTitle]}>
      <div className="w-full bg-card-fill rounded-medium border border-card-stroke p-4">
        <p className="text-md text-text-primary font-bold border-b border-divider pb-4">{title}</p>
        {modules.map((item, modIndex) => {
          const currentModuleActiveIndex = activeLessons[item.moduleTitle] ?? -1;
          lessonCounter = 0;
          return (
            <AccordionItem
              className={cn('py-4', 'border-b border-divider')}
              key={item.moduleTitle}
              value={item.moduleTitle}
            >
              <AccordionTrigger value={item.moduleTitle}>
                <ModuleHeader
                  totalModules={modules.length}
                  currentModule={modIndex + 1}
                  moduleTitle={item.moduleTitle}
                  locale="en"
                />
              </AccordionTrigger>
              <AccordionContent value={item.moduleTitle} className="pt-2">
                <LessonLink>
                  {item.items.map((moduleItem, index) => {
                    if (moduleItem.type === 'lesson') {
                      lessonCounter++;
                      return (
                        <LessonLinkItem
                          key={index}
                          lessonTitle={moduleItem.title}
                          lessonNumber={lessonCounter}
                          isCompleted={moduleItem.completed}
                          isActive={index === currentModuleActiveIndex}
                          isOptional={moduleItem.optional}
                          isUpdated={moduleItem.updated}
                          locale='en'
                          onClick={() => handleLessonClick(item.moduleTitle, index)}
                        />
                      );
                    }
                    lessonCounter = 0;
                    return (
                      <div className="py-2" key={index}>
                        <Milestone
                          completed={moduleItem.completed}
                          locale='en'
                        />
                      </div>
                    );
                  })}
                </LessonLink>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </div>
    </Accordion>
  );
};

export const Default: StoryObj = {
  render: () => <CourseOutlineAccordion {...modulesData} />,
};
