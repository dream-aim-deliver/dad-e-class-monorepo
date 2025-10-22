import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { generateCertificatePDF, type CertificateData } from '../lib/utils/course-certificate-generator';
import { Button } from '../lib/components/button';
import { InputField } from '../lib/components/input-field';

// Create a wrapper component for the story
const CertificateGeneratorDemo = () => {
    const [certificateData, setCertificateData] = useState<CertificateData>({
        studentName: 'John Doe',
        courseTitle: 'React Fundamentals',
        completionDate: '2024-01-15',
        platformName: 'Learning Platform',
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

            await generateCertificatePDF(certificateData);

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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
    render: () => <CertificateGeneratorDemo />,
};

export const WithSampleData: Story = {
    render: () => <CertificateGeneratorDemo />,
    parameters: {
        docs: {
            description: {
                story: 'Default story with sample certificate data pre-filled. Click "Generate Certificate" to download a test PDF.',
            },
        },
    },
};

export const WithSpecialCharacters: Story = {
    render: () => {
        const SpecialCharDemo = () => {
            const [isGenerating, setIsGenerating] = useState(false);
            const [message, setMessage] = useState<string>('');

            const specialCharData: CertificateData = {
                studentName: 'José María-González',
                courseTitle: 'Advanced C++ & Data Structures',
                completionDate: '2024-03-10',
                platformName: 'Plataforma de Aprendizaje',
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

        return <SpecialCharDemo />;
    },
    parameters: {
        docs: {
            description: {
                story: 'Tests certificate generation with special characters and accents to ensure proper filename sanitization.',
            },
        },
    },
};

export const WithUnicodeCharacters: Story = {
    render: () => {
        const UnicodeDemo = () => {
            const [isGenerating, setIsGenerating] = useState(false);
            const [message, setMessage] = useState<string>('');

            const unicodeData: CertificateData = {
                studentName: '张三李四',
                courseTitle: 'Programación Avanzada',
                completionDate: '2024-01-15',
                platformName: 'Plataforma de Aprendizaje',
            };

            const handleGenerate = async () => {
                try {
                    setIsGenerating(true);
                    setMessage('Generating certificate with Unicode characters...');

                    await generateCertificatePDF(unicodeData);

                    setMessage('✅ Certificate with Unicode characters generated successfully!');
                } catch (error) {
                    setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                } finally {
                    setIsGenerating(false);
                }
            };

            return (
                <div style={{ maxWidth: '400px', padding: '20px' }}>
                    <h3>Unicode Characters Test</h3>
                    <div style={{ marginBottom: '15px', fontSize: '14px' }}>
                        <strong>Student:</strong> {unicodeData.studentName}<br />
                        <strong>Course:</strong> {unicodeData.courseTitle}<br />
                        <strong>Date:</strong> {unicodeData.completionDate}<br />
                        <strong>Platform:</strong> {unicodeData.platformName}
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

        return <UnicodeDemo />;
    },
    parameters: {
        docs: {
            description: {
                story: 'Tests certificate generation with Chinese characters and Spanish accents to ensure proper Unicode handling.',
            },
        },
    },
};