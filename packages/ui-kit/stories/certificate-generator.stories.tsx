import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useRef } from 'react';
import { PaginatedCertificate, PaginatedCertificateHandle } from '../lib/components/paginated-certificate';
import type { CourseCertificateProps } from '../lib/components/course-certificate';
import { Button } from '../lib/components/button';
import type { TLocale } from '@maany_shr/e-class-translations';

type CertificateDemoData = Omit<CourseCertificateProps, 'className' | 'showBadge'>;

const CertificateGeneratorDemo = ({ locale, data }: { locale: TLocale; data: CertificateDemoData }) => {
    const certificateRef = useRef<PaginatedCertificateHandle>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState<string>('');

    const handleGeneratePDF = async () => {
        try {
            setIsGenerating(true);
            setMessage('Generating certificate...');

            const element = certificateRef.current?.getElement();
            if (!element) {
                setMessage('Certificate element not found');
                return;
            }

            const html2pdf = (await import('html2pdf.js')).default;

            const options = {
                margin: 0,
                filename: `Certificate_test.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#0C0A09',
                },
                jsPDF: {
                    unit: 'mm' as const,
                    format: 'a4' as const,
                    orientation: 'landscape' as const,
                },
                pagebreak: { mode: ['css', 'legacy'] as const },
            };

            await html2pdf().set(options).from(element).save();

            setMessage('Certificate generated successfully! Check your Downloads folder.');
        } catch (error) {
            setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Button
                    variant="primary"
                    text={isGenerating ? 'Generating...' : 'Download Certificate PDF'}
                    onClick={handleGeneratePDF}
                    disabled={isGenerating}
                />
                {message && (
                    <span style={{ fontSize: '14px', color: message.includes('Error') ? '#dc2626' : '#16a34a' }}>
                        {message}
                    </span>
                )}
            </div>
            <div style={{ border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                <PaginatedCertificate
                    ref={certificateRef}
                    {...data}
                    showBadge={true}
                    className=""
                    locale={locale}
                />
            </div>
        </div>
    );
};

const meta: Meta<typeof CertificateGeneratorDemo> = {
    title: 'Utils/Certificate Generator',
    component: CertificateGeneratorDemo,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Interactive demo for testing PDF certificate generation using the same PaginatedCertificate + html2pdf approach as the production app.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Language for certificate text',
        },
    },
    args: {
        locale: 'en',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultData: CertificateDemoData = {
    studentName: 'John Doe',
    courseTitle: 'React Fundamentals',
    completionDate: 'January 15, 2025',
    certificateId: 'CER-john-doe-react',
    platformName: 'Learning Platform',
    awardedYear: '2025',
    courseDescription:
        'A comprehensive introduction to building modern web applications with React',
    courseSummary: [
        {
            moduleNumber: 1,
            moduleTitle: 'Introduction to React',
            lessonTitles: [
                'What is React?',
                'Setting up your development environment',
                'Your first React component',
            ],
        },
        {
            moduleNumber: 2,
            moduleTitle: 'React Components',
            lessonTitles: [
                'Functional Components',
                'Class Components',
                'Props and State',
                'Component Lifecycle',
            ],
        },
        {
            moduleNumber: 3,
            moduleTitle: 'Hooks and State Management',
            lessonTitles: ['useState Hook', 'useEffect Hook', 'Custom Hooks', 'Context API'],
        },
    ],
    locale: 'en',
};

export const Interactive: Story = {
    render: (args) => <CertificateGeneratorDemo locale={args.locale} data={{ ...defaultData, locale: args.locale }} />,
};

export const ManyModules: Story = {
    render: (args) => (
        <CertificateGeneratorDemo
            locale={args.locale}
            data={{
                studentName: 'Maria Schneider',
                courseTitle: 'Full Stack Web Development Bootcamp',
                completionDate: 'November 13, 2025',
                certificateId: 'CER-FULLSTACK-2025-42',
                platformName: 'Tech Academy',
                awardedYear: '2025',
                courseDescription:
                    'An intensive full-stack web development bootcamp covering frontend and backend technologies.',
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
                locale: args.locale,
            }}
        />
    ),
    parameters: {
        docs: {
            description: {
                story: 'Tests multi-page pagination with 6 modules of 5 lessons each.',
            },
        },
    },
};

export const LongLessonLists: Story = {
    render: (args) => (
        <CertificateGeneratorDemo
            locale={args.locale}
            data={{
                studentName: 'Alexandra Konstantinidou',
                courseTitle: 'Comprehensive Marketing Masterclass',
                completionDate: 'March 6, 2026',
                certificateId: 'CER-MARKETING-2026-99',
                platformName: 'Business Academy',
                awardedYear: '2026',
                courseDescription:
                    'A deep-dive masterclass covering every aspect of modern marketing from strategy to execution.',
                courseSummary: [
                    {
                        moduleNumber: 1,
                        moduleTitle: 'Konzeption und Strategie',
                        lessonTitles: [
                            'Kampagnen-Strategie und Konzeption',
                            'Marketingmix und Kreatives Texten',
                            'Kreieren von Ideen und Grundlagen der Werbung',
                            'Zielgruppenanalyse und Marktsegmentierung',
                            'Wettbewerbsanalyse und Positionierung',
                            'Markenidentität und Corporate Design',
                            'Content-Marketing-Strategie entwickeln',
                            'Social-Media-Marketing Grundlagen',
                            'Suchmaschinenoptimierung (SEO) Basics',
                            'E-Mail-Marketing und Automatisierung',
                            'Influencer-Marketing Strategien',
                            'Affiliate-Marketing Programme',
                            'Performance Marketing und KPIs',
                            'Marketing-Budget Planung und ROI',
                            'Krisenmanagement in der Kommunikation',
                        ],
                    },
                    {
                        moduleNumber: 2,
                        moduleTitle: 'Umsetzung und Produktion',
                        lessonTitles: [
                            'Visuelle Grundlagen und Personal Branding',
                            'Layouten für Print und Web',
                            'Einführung Affinity Publisher',
                            'Affinity Photo Grundlagen',
                            'Wix Website Builder',
                            'Video-Produktion und Schnitt',
                            'Fotografie für Marketing',
                            'Grafikdesign mit Canva',
                            'Infografiken erstellen',
                            'Podcast-Produktion',
                            'Webinar-Planung und Durchführung',
                            'Landing Page Optimierung',
                            'A/B Testing Methoden',
                            'Analytics und Reporting',
                            'Marketing-Automation Tools',
                            'CRM-Integration und Lead Management',
                            'Conversion Rate Optimierung',
                            'User Experience Design Basics',
                        ],
                    },
                    {
                        moduleNumber: 3,
                        moduleTitle: 'Finalisierung und Karriere',
                        lessonTitles: [
                            'Bewerbungsgespräch und Interviewtraining',
                            'Auftritts- und Präsentationstraining',
                            'Portfolio-Erstellung',
                            'Networking und LinkedIn-Strategie',
                            'Freelancing im Marketing',
                        ],
                    },
                ],
                locale: args.locale,
            }}
        />
    ),
    parameters: {
        docs: {
            description: {
                story:
                    'Stress test: modules with 15-18 lessons each. Tests content-aware pagination that splits long lesson lists across pages.',
            },
        },
    },
};

export const GermanExample: Story = {
    render: (args) => (
        <CertificateGeneratorDemo
            locale={args.locale}
            data={{
                studentName: 'Maximilian Müller',
                courseTitle: 'Fortgeschrittene Webentwicklung mit React',
                completionDate: '15. Januar 2025',
                certificateId: 'CER-max-mueller-web',
                platformName: 'Lernplattform',
                awardedYear: '2025',
                courseDescription:
                    'Ein umfassender Kurs über moderne Webanwendungen mit React und TypeScript',
                courseSummary: [
                    {
                        moduleNumber: 1,
                        moduleTitle: 'Einführung in React',
                        lessonTitles: [
                            'Was ist React?',
                            'Entwicklungsumgebung einrichten',
                            'Ihre erste React-Komponente',
                        ],
                    },
                    {
                        moduleNumber: 2,
                        moduleTitle: 'React-Komponenten',
                        lessonTitles: [
                            'Funktionale Komponenten',
                            'Klassenkomponenten',
                            'Props und State',
                            'Komponenten-Lebenszyklus',
                        ],
                    },
                    {
                        moduleNumber: 3,
                        moduleTitle: 'Hooks und Zustandsverwaltung',
                        lessonTitles: ['useState Hook', 'useEffect Hook', 'Eigene Hooks', 'Context API'],
                    },
                    {
                        moduleNumber: 4,
                        moduleTitle: 'Fortgeschrittene Themen',
                        lessonTitles: [
                            'TypeScript mit React',
                            'Performance-Optimierung',
                            'Server-seitiges Rendering',
                            'Testing',
                        ],
                    },
                ],
                locale: args.locale,
            }}
        />
    ),
    args: {
        locale: 'de',
    },
    parameters: {
        docs: {
            description: {
                story: 'German language certificate with umlauts. Uses the same html2pdf approach as production.',
            },
        },
    },
};
