import type { Meta, StoryObj } from '@storybook/react';

import { CourseCertificate } from '../lib/components/course-certificate';
import { PaginatedCertificate } from '../lib/components/paginated-certificate';

const meta: Meta<typeof CourseCertificate> = {
  title: 'Components/CourseCertificate',
  component: CourseCertificate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A professional certificate component for displaying course completion certificates. Includes pagination for multi-page PDF export.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    studentName: { control: 'text' },
    courseTitle: { control: 'text' },
    completionDate: { control: 'text' },
    certificateId: { control: 'text' },
    platformName: { control: 'text' },
    platformLogoUrl: { control: 'text' },
    showBadge: { control: 'boolean' },
    className: { control: 'text' },
    locale: {
      control: { type: 'select' },
      options: ['en', 'de'],
    },
    awardedYear: { control: 'text' },
  },
  args: {
    studentName: 'John Doe',
    courseTitle: 'React Fundamentals',
    completionDate: 'January 15, 2025',
    certificateId: 'CER-123456',
    platformName: 'Learning Platform',
    courseDescription:
      'A comprehensive introduction to building modern web applications with React. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.',
    courseSummary: [
      {
        moduleNumber: 1,
        moduleTitle: 'Konzeption',
        lessonTitles: [
          'Kampagnen-Strategie und Konzeption',
          'Marketingmix, Kreatives Texten',
          'Kreieren von Ideen, Grundlagen der Werbung',
        ],
      },
      {
        moduleNumber: 2,
        moduleTitle: 'Umsetzung',
        lessonTitles: [
          'Visuelle Grundlagen, Personal Branding',
          'Layouten für Print und Web',
          'Einführung Affinity Publisher/Photo und Wix, Video, Photografie',
        ],
      },
      {
        moduleNumber: 3,
        moduleTitle: 'Finalisierung',
        lessonTitles: [
          'Bewerbungsgespräch, Interviewtraining',
          'Auftritts- und Präse',
        ],
      },
    ],
    showBadge: true,
    className: '',
    locale: 'en',
    awardedYear: '2025',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --------------------------------------------------
// DEFAULT
// --------------------------------------------------
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Default certificate with standard layout and dark theme.',
      },
    },
  },
};

// --------------------------------------------------
// MULTI-PAGE PDF STORY
// --------------------------------------------------
export const MultiPagePDF: Story = {
  render: (args) => (
    <div style={{ padding: '20px' }}>
      <PaginatedCertificate {...(args as any)} />
    </div>
  ),
  args: {
    studentName: 'Maria Schneider',
    courseTitle: 'Full Stack Web Development Bootcamp',
    completionDate: 'November 13, 2025',
    certificateId: 'CER-FULLSTACK-2025-42',
    platformName: 'Tech Academy',
    awardedYear: '2025',
    platformLogoUrl:
      'https://via.placeholder.com/150x50/10B981/FFFFFF?text=Tech+Academy',
    courseDescription:
      'An intensive full-stack web development bootcamp covering frontend and backend technologies. Students learn HTML, CSS, JavaScript, React, Node.js, databases, deployment, and modern development practices through hands-on projects.',
    courseSummary: [
      {
        moduleNumber: 1,
        moduleTitle: 'Frontend Fundamentals',
        lessonTitles: [
          'HTML5 Structure and Semantics',
          'CSS3 Styling and Layouts',
          'Responsive Design with Flexbox and Grid',
          'JavaScript ES6+ Fundamentals',
          'DOM Manipulation and Events',
        ],
      },
      {
        moduleNumber: 2,
        moduleTitle: 'Advanced JavaScript',
        lessonTitles: [
          'Asynchronous JavaScript and Promises',
          'Async/Await Patterns',
          'Fetch API and HTTP Requests',
          'Error Handling Best Practices',
          'Modern JavaScript Tooling',
        ],
      },
      {
        moduleNumber: 3,
        moduleTitle: 'React Development',
        lessonTitles: [
          'React Components and JSX',
          'State Management with Hooks',
          'React Router for Navigation',
          'Context API and Global State',
          'Performance Optimization',
        ],
      },
      {
        moduleNumber: 4,
        moduleTitle: 'Backend with Node.js',
        lessonTitles: [
          'Node.js Fundamentals',
          'Express.js Server Setup',
          'RESTful API Design',
          'Middleware and Authentication',
          'JWT and Session Management',
        ],
      },
      {
        moduleNumber: 5,
        moduleTitle: 'Databases',
        lessonTitles: [
          'SQL Database Design',
          'PostgreSQL and Queries',
          'MongoDB and NoSQL',
          'Database Relationships',
          'Data Modeling Best Practices',
        ],
      },
      {
        moduleNumber: 6,
        moduleTitle: 'Deployment and DevOps',
        lessonTitles: [
          'Git Version Control',
          'CI/CD Pipelines',
          'Docker Containerization',
          'Cloud Deployment (AWS/Heroku)',
          'Monitoring and Logging',
        ],
      },
    ],
    showBadge: true,
    className: '',
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Renders multiple pages automatically and provides a button to export a multi-page PDF.',
      },
    },
  },
};
