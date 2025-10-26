import jsPDF from 'jspdf';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { slateToPlainText } from '../components/rich-text-element/serializer';
import { formatCertificateDate } from './format-utils';

/**
 * Interface for module in course summary
 */
export interface ModuleSummary {
    moduleTitle: string;
    moduleNumber: number;
    lessonTitles: string[];
}

/**
 * Interface for certificate data required for PDF generation
 */
export interface CertificateData {
    studentName: string;
    studentUsername: string;
    courseTitle: string;
    courseSlug: string;
    /** Course description - can be plain text or SlateJS JSON string. Will be converted to plain text for PDF. */
    courseDescription?: string;
    /** Completion date - can be ISO timestamp string or Date object. Will be formatted based on locale. */
    completionDate: string | Date;
    platformName: string;
    platformLogoUrl?: string;
    /** Platform footer - can be plain text or SlateJS JSON string. Will be converted to plain text for PDF. */
    platformFooterContent?: string;
    courseSummary: ModuleSummary[];
    locale?: TLocale;
}

/**
 * Generates a PDF certificate for course completion with full course structure listing.
 *
 * The certificate is generated in landscape orientation with:
 * - Page 1: Certificate of completion with student name, course title, and completion date
 * - Page 2+: Course structure with all modules and lessons, including page numbers in footer
 *
 * @param data - Certificate data including student name, course title, completion date, and course structure
 * @returns Promise that resolves when PDF is generated and downloaded
 *
 * @remarks
 * **Character Support:**
 *
 * The PDF generator uses jsPDF with default Nunito font, which supports **Latin-1 (ISO-8859-1)** character encoding.
 *
 * **✅ SUPPORTED CHARACTERS:**
 * - English: A-Z, a-z, 0-9
 * - Spanish: á, é, í, ó, ú, ñ, ü, ¿, ¡
 * - French: à, â, ç, è, é, ê, ë, î, ï, ô, ù, û, ü, ÿ
 * - German: ä, ö, ü, ß
 * - Portuguese: ã, õ, á, é, í, ó, ú, â, ê, ô, ç
 * - Italian: à, è, é, ì, ò, ù
 * - All Western European languages with Latin-based alphabets
 *
 * **❌ NOT SUPPORTED:**
 * - Chinese (CJK): 中文, 汉字 → Will render as garbled characters
 * - Japanese: ひらがな, カタカナ, 漢字
 * - Korean: 한글
 * - Arabic: العربية
 * - Hebrew: עברית
 * - Cyrillic: Русский, Українська
 * - Thai, Vietnamese (with special diacritics), and other non-Latin scripts
 *
 * To support CJK or other Unicode characters, we would need to:
 * 1. Embed a custom Unicode font (e.g., Noto Sans CJK)
 * 2. Load the font file into jsPDF
 * 3. Significantly increase PDF file size (CJK fonts are 5-10MB+)
 *
 * @example
 * ```typescript
 * // This will render correctly
 * await generateCertificatePDF({
 *   studentName: 'José María García',
 *   courseTitle: 'Programación Avanzada en C++',
 *   // ... other fields
 * });
 *
 * // This will NOT render correctly (garbled text)
 * await generateCertificatePDF({
 *   studentName: '张三李四',  // Chinese characters
 *   courseTitle: 'Advanced Programming',
 *   // ... other fields
 * });
 * ```
 */
export async function generateCertificatePDF(data: CertificateData): Promise<void> {
    const locale = data.locale || 'en';
    const dictionary = getDictionary(locale);
    const t = dictionary.components.certificateGenerator;

    try {
        // Create new PDF document in landscape orientation for certificate
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Set up document dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const centerX = pageWidth / 2;
        const margin = 20;
        let currentY = 25;

        // Set background color (card-stroke: #27272A - dark gray/blue)
        pdf.setFillColor(39, 39, 42); // RGB for #27272A
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        // Add certificate border (white)
        pdf.setDrawColor(255, 255, 255); // White border
        pdf.setLineWidth(2);
        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

        // Add inner decorative border (white)
        pdf.setLineWidth(0.5);
        pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

        // Set text color to base-white (#FFFFFF)
        pdf.setTextColor(255, 255, 255);

        // Certificate title
        pdf.setFontSize(28);
        pdf.setFont('Nunito', 'bold');
        pdf.text(t.certificateTitle, centerX, currentY, { align: 'center' });
        currentY += 10;

        // Decorative line under title
        pdf.setLineWidth(1);
        pdf.line(centerX - 60, currentY, centerX + 60, currentY);
        currentY += 15;

        // "This is to certify that" text
        pdf.setFontSize(12);
        pdf.setFont('Nunito', 'normal');
        pdf.text(t.certifyThat, centerX, currentY, { align: 'center' });
        currentY += 10;

        // Student name (larger, bold)
        pdf.setFontSize(18);
        pdf.setFont('Nunito', 'bold');
        pdf.text(data.studentName, centerX, currentY, { align: 'center' });
        currentY += 10;

        // "has successfully completed" text
        pdf.setFontSize(12);
        pdf.setFont('Nunito', 'normal');
        pdf.text(t.hasCompleted, centerX, currentY, { align: 'center' });
        currentY += 10;

        // Course title (larger, bold)
        pdf.setFontSize(16);
        pdf.setFont('Nunito', 'bold');
        const courseTitleLines = pdf.splitTextToSize(data.courseTitle, pageWidth - 2 * margin);
        pdf.text(courseTitleLines, centerX, currentY, { align: 'center' });
        currentY += courseTitleLines.length * 7;

        // Course description (if provided)
        if (data.courseDescription) {
            currentY += 5;
            pdf.setFontSize(10);
            pdf.setFont('Nunito', 'italic');
            // Convert SlateJS to plain text if needed
            const descriptionText = slateToPlainText(data.courseDescription);
            const descriptionLines = pdf.splitTextToSize(descriptionText, pageWidth - 2 * margin);
            pdf.text(descriptionLines, centerX, currentY, { align: 'center' });
            currentY += descriptionLines.length * 5;
        }

        currentY += 5;

        // Completion date
        pdf.setFontSize(11);
        pdf.setFont('Nunito', 'normal');
        // Format the date for display
        const formattedDate = formatCertificateDate(data.completionDate, locale);
        pdf.text(`${t.completedOn}: ${formattedDate}`, centerX, currentY, { align: 'center' });

        // Add page 2 for course structure if there are modules
        if (data.courseSummary && data.courseSummary.length > 0) {
            pdf.addPage();
            pdf.setFillColor(39, 39, 42);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
            pdf.setDrawColor(255, 255, 255);
            pdf.setLineWidth(2);
            pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
            pdf.setLineWidth(0.5);
            pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);
            pdf.setTextColor(255, 255, 255);

            currentY = 30;

            // Course Structure Section
            pdf.setFontSize(16);
            pdf.setFont('Nunito', 'bold');
            pdf.text(t.courseStructure, centerX, currentY, { align: 'center' });
            currentY += 10;

            // Decorative line
            pdf.setLineWidth(0.5);
            pdf.line(margin, currentY, pageWidth - margin, currentY);
            currentY += 10;

            // Render modules and lessons
            pdf.setFontSize(10);
            const leftMargin = margin + 5;
            const maxYBeforeFooter = pageHeight - 40; // Reserve space for footer with page numbers

            for (const module of data.courseSummary) {
                // Check if we need a new page
                if (currentY > maxYBeforeFooter) {
                    pdf.addPage();
                    pdf.setFillColor(39, 39, 42);
                    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                    pdf.setDrawColor(255, 255, 255);
                    pdf.setLineWidth(2);
                    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
                    pdf.setLineWidth(0.5);
                    pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);
                    pdf.setTextColor(255, 255, 255);
                    currentY = 30;
                }

                // Module title
                pdf.setFont('Nunito', 'bold');
                const moduleText = `${t.module} ${module.moduleNumber}: ${module.moduleTitle}`;
                pdf.text(moduleText, leftMargin, currentY);
                currentY += 6;

                // Lesson titles
                pdf.setFont('Nunito', 'normal');
                for (const lessonTitle of module.lessonTitles) {
                    if (currentY > maxYBeforeFooter) {
                        pdf.addPage();
                        pdf.setFillColor(39, 39, 42);
                        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                        pdf.setDrawColor(255, 255, 255);
                        pdf.setLineWidth(2);
                        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
                        pdf.setLineWidth(0.5);
                        pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);
                        pdf.setTextColor(255, 255, 255);
                        currentY = 30;
                    }

                    pdf.text(`  • ${lessonTitle}`, leftMargin + 5, currentY);
                    currentY += 5;
                }
                currentY += 3; // Extra space between modules
            }
        }

        // Add footer on all pages
        const pageCount = pdf.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);

            // Platform name and footer content
            pdf.setFontSize(9);
            pdf.setFont('Nunito', 'italic');
            let footerY = pageHeight - 20;

            if (i === 1) {
                // Page 1: Only platform footer content
                if (data.platformFooterContent) {
                    // Convert SlateJS to plain text if needed
                    const footerText = slateToPlainText(data.platformFooterContent);
                    const footerLines = pdf.splitTextToSize(footerText, pageWidth - 2 * margin);
                    pdf.text(footerLines, centerX, footerY, { align: 'center' });
                } else {
                    pdf.text(data.platformName, centerX, footerY, { align: 'center' });
                }
            } else {
                // Page 2+: Platform footer + page numbers
                if (data.platformFooterContent) {
                    // Convert SlateJS to plain text if needed
                    const footerText = slateToPlainText(data.platformFooterContent);
                    const footerLines = pdf.splitTextToSize(footerText, pageWidth - 2 * margin);
                    pdf.text(footerLines, centerX, footerY, { align: 'center' });
                    footerY += footerLines.length * 4 + 3;
                } else {
                    pdf.text(data.platformName, centerX, footerY, { align: 'center' });
                    footerY += 6;
                }

                // Add page numbers on pages 2+
                pdf.setFontSize(8);
                pdf.setFont('Nunito', 'normal');
                pdf.text(`${i} / ${pageCount}`, centerX, footerY, { align: 'center' });
            }
        }

        // Generate filename with student username and course slug (already sanitized)
        const sanitizedStudentName = data.studentUsername;
        const sanitizedCourseTitle = data.courseSlug;
        const filename = `${t.certificatePrefix}_${sanitizedStudentName}_${sanitizedCourseTitle}.pdf`;

        // Save the PDF
        pdf.save(filename);

    } catch (error) {
        throw `Failed to generate certificate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}