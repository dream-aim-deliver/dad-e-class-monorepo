import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { generateCertificatePDF, type CertificateData } from '../lib/utils/course-certificate-generator';
import { Button } from '../lib/components/button';
import { InputField } from '../lib/components/input-field';
import type { TLocale } from '@maany_shr/e-class-translations';

// Create a wrapper component for the story
const CertificateGeneratorDemo = ({ locale }: { locale: TLocale }) => {
    const [certificateData, setCertificateData] = useState<CertificateData>({
        studentUsername: 'john-doe',
        studentName: 'John Doe',
        courseTitle: 'React Fundamentals',
        courseSlug: 'react-fundamentals',
        courseDescription: 'A comprehensive introduction to building modern web applications with React',
        completionDate: '2024-01-15',
        platformName: 'Learning Platform',
        platformFooterContent: 'This certificate verifies completion of all course modules and assessments',
        courseSummary: [
            {
                moduleNumber: 1,
                moduleTitle: 'Introduction to React',
                lessonTitles: ['What is React?', 'Setting up your development environment', 'Your first React component']
            },
            {
                moduleNumber: 2,
                moduleTitle: 'React Components',
                lessonTitles: ['Functional Components', 'Class Components', 'Props and State', 'Component Lifecycle']
            },
            {
                moduleNumber: 3,
                moduleTitle: 'Hooks and State Management',
                lessonTitles: ['useState Hook', 'useEffect Hook', 'Custom Hooks', 'Context API']
            }
        ],
        locale: locale,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState<string>('');

    const handleInputChange = (field: keyof CertificateData, value: string) => {
        setCertificateData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleGenerateCertificate = async () => {
        try {
            setIsGenerating(true);
            setMessage('Generating certificate...');

            await generateCertificatePDF({ ...certificateData, locale });

            setMessage('✅ Certificate generated successfully! Check your Downloads folder.');
        } catch (error) {
            setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Certificate Generator Test</h2>

            <div style={{
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: '#f0f9ff',
                borderRadius: '4px',
                fontSize: '14px'
            }}>
                <strong>Current Locale:</strong> {locale === 'en' ? '🇬🇧 English' : '🇩🇪 Deutsch'}
                <br />
                <em>Use the "locale" control in the panel below to switch languages</em>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Student Name:
                    </label>
                    <InputField
                        value={certificateData.studentName}
                        onChange={(e) => handleInputChange('studentName', e.target.value)}
                        placeholder="Enter student name"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Course Title:
                    </label>
                    <InputField
                        value={certificateData.courseTitle}
                        onChange={(e) => handleInputChange('courseTitle', e.target.value)}
                        placeholder="Enter course title"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Completion Date:
                    </label>
                    <InputField
                        value={certificateData.completionDate}
                        onChange={(e) => handleInputChange('completionDate', e.target.value)}
                        placeholder="YYYY-MM-DD"
                        type="date"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Platform Name (Optional):
                    </label>
                    <InputField
                        value={certificateData.platformName || ''}
                        onChange={(e) => handleInputChange('platformName', e.target.value)}
                        placeholder="Enter platform name"
                    />
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <Button
                    variant="primary"
                    text={isGenerating ? "Generating..." : "Generate Certificate"}
                    onClick={handleGenerateCertificate}
                    disabled={isGenerating}
                />
            </div>

            {message && (
                <div style={{
                    padding: '10px',
                    borderRadius: '4px',
                    backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
                    border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
                    color: message.includes('✅') ? '#155724' : '#721c24',
                }}>
                    {message}
                </div>
            )}

            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <h3>Instructions:</h3>
                <ol>
                    <li>Fill in the certificate details above</li>
                    <li>Click "Generate Certificate" button</li>
                    <li>The PDF will be automatically downloaded to your Downloads folder</li>
                    <li>Check your browser's download bar or Downloads folder</li>
                </ol>

                <h4 style={{ marginTop: '15px' }}>Test Cases:</h4>
                <ul>
                    <li><strong>Default:</strong> Uses sample data (John Doe, React Fundamentals)</li>
                    <li><strong>Special Characters:</strong> Try "José María-González" and "Advanced C++ & Data Structures"</li>
                    <li><strong>Long Names:</strong> Try very long student names and course titles</li>
                    <li><strong>Unicode:</strong> Try "张三李四" and "Programación Avanzada"</li>
                    <li><strong>No Platform:</strong> Clear the platform name field</li>
                </ul>
            </div>
        </div>
    );
};

const meta: Meta<typeof CertificateGeneratorDemo> = {
    title: 'Utils/Certificate Generator',
    component: CertificateGeneratorDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Interactive demo for testing PDF certificate generation. This story allows you to test the certificate generator with different inputs and actually download PDFs.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Language for certificate text and filename prefix',
            table: {
                type: { summary: 'TLocale' },
                defaultValue: { summary: 'en' },
            },
        },
    },
    args: {
        locale: 'en',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
    render: (args) => <CertificateGeneratorDemo {...args} />,
};

export const WithSampleData: Story = {
    render: (args) => <CertificateGeneratorDemo {...args} />,
    parameters: {
        docs: {
            description: {
                story: 'Default story with sample certificate data pre-filled. Click "Generate Certificate" to download a test PDF.',
            },
        },
    },
};

export const WithSpecialCharacters: Story = {
    render: (args) => {
        const SpecialCharDemo = ({ locale }: { locale: TLocale }) => {
            const [isGenerating, setIsGenerating] = useState(false);
            const [message, setMessage] = useState<string>('');

            const specialCharData: CertificateData = {
                studentName: 'José María-González',
                studentUsername: 'jose-maria-gonzalez',
                courseTitle: 'Advanced C++ & Data Structures',
                courseSlug: 'advanced-cpp-data-structures',
                courseDescription: 'Master advanced programming concepts with C++ and complex data structures',
                completionDate: '2024-03-10',
                platformName: 'Plataforma de Aprendizaje',
                platformFooterContent: 'Certificado válido. Contacto: info@plataforma.com',
                courseSummary: [
                    {
                        moduleNumber: 1,
                        moduleTitle: 'Punteros y Gestión de Memoria',
                        lessonTitles: ['Introducción a punteros', 'Memoria dinámica', 'Referencias y punteros inteligentes']
                    },
                    {
                        moduleNumber: 2,
                        moduleTitle: 'Estructuras de Datos Avanzadas',
                        lessonTitles: ['Árboles binarios', 'Grafos', 'Hash tables', 'Árboles AVL']
                    }
                ],
                locale: locale,
            };

            const handleGenerate = async () => {
                try {
                    setIsGenerating(true);
                    setMessage('Generating certificate with special characters...');

                    await generateCertificatePDF(specialCharData);

                    setMessage('✅ Certificate with special characters generated successfully!');
                } catch (error) {
                    setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                } finally {
                    setIsGenerating(false);
                }
            };

            return (
                <div style={{ maxWidth: '400px', padding: '20px' }}>
                    <h3>Special Characters Test</h3>
                    <div style={{ marginBottom: '15px', fontSize: '14px' }}>
                        <strong>Student:</strong> {specialCharData.studentName}<br />
                        <strong>Course:</strong> {specialCharData.courseTitle}<br />
                        <strong>Date:</strong> {specialCharData.completionDate}<br />
                        <strong>Platform:</strong> {specialCharData.platformName}
                    </div>

                    <Button
                        variant="primary"
                        text={isGenerating ? "Generating..." : "Generate Certificate"}
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    />

                    {message && (
                        <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            borderRadius: '4px',
                            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
                            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
                            color: message.includes('✅') ? '#155724' : '#721c24',
                        }}>
                            {message}
                        </div>
                    )}
                </div>
            );
        };

        return <SpecialCharDemo locale={args.locale} />;
    },
    parameters: {
        docs: {
            description: {
                story: 'Tests certificate generation with special characters and accents to ensure proper filename sanitization.',
            },
        },
    },
};

export const GermanExample: Story = {
    render: (args) => {
        const GermanDemo = ({ locale }: { locale: TLocale }) => {
            const [isGenerating, setIsGenerating] = useState(false);
            const [message, setMessage] = useState<string>('');

            const germanData: CertificateData = {
                studentName: 'Maximilian Müller',
                studentUsername: 'maximilian-mueller',
                courseTitle: 'Fortgeschrittene Webentwicklung mit React',
                courseSlug: 'fortgeschrittene-webentwicklung-react',
                courseDescription: 'Ein umfassender Kurs über moderne Webanwendungen mit React und TypeScript',
                completionDate: '2024-01-15',
                platformName: 'Lernplattform',
                platformFooterContent: 'Dieses Zertifikat bestätigt den erfolgreichen Abschluss aller Kursmodule und Prüfungen',
                courseSummary: [
                    {
                        moduleNumber: 1,
                        moduleTitle: 'Einführung in React',
                        lessonTitles: ['Was ist React?', 'Entwicklungsumgebung einrichten', 'Ihre erste React-Komponente']
                    },
                    {
                        moduleNumber: 2,
                        moduleTitle: 'React-Komponenten',
                        lessonTitles: ['Funktionale Komponenten', 'Klassenkomponenten', 'Props und State', 'Komponenten-Lebenszyklus']
                    },
                    {
                        moduleNumber: 3,
                        moduleTitle: 'Hooks und Zustandsverwaltung',
                        lessonTitles: ['useState Hook', 'useEffect Hook', 'Eigene Hooks', 'Context API']
                    },
                    {
                        moduleNumber: 4,
                        moduleTitle: 'Fortgeschrittene Themen',
                        lessonTitles: ['TypeScript mit React', 'Performance-Optimierung', 'Server-seitiges Rendering', 'Testing']
                    }
                ],
                locale: locale,
            };

            const handleGenerate = async () => {
                try {
                    setIsGenerating(true);
                    setMessage('Zertifikat wird generiert...');

                    await generateCertificatePDF(germanData);

                    setMessage('✅ Zertifikat erfolgreich generiert! Überprüfen Sie Ihren Downloads-Ordner.');
                } catch (error) {
                    setMessage(`❌ Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
                } finally {
                    setIsGenerating(false);
                }
            };

            return (
                <div style={{ maxWidth: '400px', padding: '20px' }}>
                    <h3>Deutsches Zertifikat-Beispiel</h3>
                    <div style={{ marginBottom: '15px', fontSize: '14px' }}>
                        <strong>Student:</strong> {germanData.studentName}<br />
                        <strong>Kurs:</strong> {germanData.courseTitle}<br />
                        <strong>Datum:</strong> {germanData.completionDate}<br />
                        <strong>Plattform:</strong> {germanData.platformName}<br />
                        <strong>Sprache:</strong> Deutsch (de)<br />
                        <strong>Dateiname:</strong> <code>zertifikat_maximilian-mueller_fortgeschrittene-webentwicklung-react.pdf</code>
                    </div>

                    <Button
                        variant="primary"
                        text={isGenerating ? "Generiert..." : "Zertifikat generieren"}
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    />

                    {message && (
                        <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            borderRadius: '4px',
                            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
                            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
                            color: message.includes('✅') ? '#155724' : '#721c24',
                        }}>
                            {message}
                        </div>
                    )}

                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <h4>Hinweise:</h4>
                        <ul style={{ fontSize: '13px', marginTop: '10px' }}>
                            <li>Dateiname wird mit "zertifikat_" anstatt "certificate_" präfixiert</li>
                            <li>Deutsche Umlaute (ä, ö, ü, ß) werden korrekt dargestellt</li>
                            <li>Vollständige Kursstruktur mit 4 Modulen</li>
                            <li>Mehrseitige PDF mit Seitenzahlen</li>
                        </ul>
                    </div>
                </div>
            );
        };

        return <GermanDemo locale={args.locale} />;
    },
    args: {
        locale: 'de',
    },
    parameters: {
        docs: {
            description: {
                story: 'German language certificate example with umlauts (ä, ö, ü, ß). Use the locale control to switch between German (de) and English (en) to see the translation differences.',
            },
        },
    },
};