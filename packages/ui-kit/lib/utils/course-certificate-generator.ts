import jsPDF from 'jspdf';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { slateToPlainText } from '../components/rich-text-element/serializer';
import { formatCertificateDate } from './format-utils';
import { ICON_AWARDED_SVG } from './certificate-assets';

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
    /**
     * Optional URL to certificate template background image (JPG or PNG).
     * If not provided, uses default styled background.
     * For bundled templates, provide the full URL path to the asset.
     */
    certificateTemplateUrl?: string;
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
        const margin = 20;

        // Define 2-column layout: left for certificate card, right for course details
        const leftColumnWidth = (pageWidth - 3 * margin) * 0.45; // 45% for certificate card
        const rightColumnWidth = (pageWidth - 3 * margin) * 0.55; // 55% for course details
        const leftColumnX = margin;
        const rightColumnX = margin + leftColumnWidth + margin;

        // Helper function to add page setup with solid background color
        const setupPage = () => {
            // Add solid background color matching Tailwind color-base-neutral-950 (#0C0A09)
            pdf.setFillColor(12, 10, 9); // RGB for #0C0A09
            pdf.rect(0, 0, pageWidth, pageHeight, 'F'); // Fill entire page
            pdf.setTextColor(255, 255, 255); // White text for visibility
        };

        // Setup first page
        setupPage();

        // LEFT COLUMN: Certificate Card (centered vertically)
        const drawCertificateCard = async (startY: number) => {
            const cardX = leftColumnX;
            const cardWidth = leftColumnWidth;
            const cardPadding = 15;

            // Draw card background with fill and border
            const cardHeight = 140;
            const cardY = startY;

            // Card background - card-fill (#1C1917)
            pdf.setFillColor(28, 25, 23); // RGB for #1C1917
            pdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, 'F');

            // Card border - card-stroke (#292524)
            pdf.setDrawColor(41, 37, 36); // RGB for #292524
            pdf.setLineWidth(0.5);
            pdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, 'S');

            let cardCurrentY = cardY + cardPadding;

            // Platform logo (if provided) at top
            if (data.platformLogoUrl) {
                const logo = new Image();
                logo.src = data.platformLogoUrl;
                await new Promise((resolve, reject) => {
                    logo.onload = resolve;
                    logo.onerror = () => resolve(null); // Don't fail if logo doesn't load
                    setTimeout(() => resolve(null), 3000);
                }).catch(() => {
                    // Intentionally ignore errors when loading logo
                });

                if (logo.complete && logo.naturalHeight !== 0) {
                    const logoSize = 15;
                    pdf.addImage(logo, 'PNG', cardX + (cardWidth / 2) - (logoSize / 2), cardCurrentY, logoSize, logoSize);
                    cardCurrentY += logoSize + 5;
                }
            }

            // Certificate title
            pdf.setFontSize(16);
            pdf.setFont('Nunito', 'bold');
            pdf.text(t.certificateTitle, cardX + cardWidth / 2, cardCurrentY, { align: 'center', maxWidth: cardWidth - 2 * cardPadding });
            cardCurrentY += 12;

            // "This is to certify that" text
            pdf.setFontSize(9);
            pdf.setFont('Nunito', 'normal');
            pdf.text(t.certifyThat, cardX + cardWidth / 2, cardCurrentY, { align: 'center' });
            cardCurrentY += 10;

            // Student name
            pdf.setFontSize(18);
            try {
                pdf.setFont('Nunito', 'normal');
            } catch {
                // Fallback to Times italic for script-like appearance
                pdf.setFont('times', 'italic');
            }
            const studentNameLines = pdf.splitTextToSize(data.studentName, cardWidth - 2 * cardPadding);
            pdf.text(studentNameLines, cardX + cardWidth / 2, cardCurrentY, { align: 'center' });
            cardCurrentY += studentNameLines.length * 7 + 8;

            // Reset to regular font
            pdf.setFont('Nunito', 'normal');

            // "for successfully completing the course"
            pdf.setFontSize(9);
            pdf.setFont('Nunito', 'normal');
            pdf.text(t.hasCompleted, cardX + cardWidth / 2, cardCurrentY, { align: 'center', maxWidth: cardWidth - 2 * cardPadding });
            cardCurrentY += 10;

            // Course title in quotes
            pdf.setFontSize(11);
            pdf.setFont('Nunito', 'bold');
            const courseTitleLines = pdf.splitTextToSize(`"${data.courseTitle}"`, cardWidth - 2 * cardPadding);
            pdf.text(courseTitleLines, cardX + cardWidth / 2, cardCurrentY, { align: 'center' });
            cardCurrentY += courseTitleLines.length * 5 + 5;

            // Awarded badge/seal - Draw a gold star/seal badge
            const badgeSize = 28;
            const badgeCenterX = cardX + cardWidth / 2;
            const badgeCenterY = cardCurrentY + badgeSize / 2;

            // Draw outer star/seal shape using a circle for simplicity
            // Outer gold ring
            pdf.setFillColor(220, 190, 128); // Light gold #DCBE80
            pdf.circle(badgeCenterX, badgeCenterY, badgeSize / 2, 'F');

            // Middle ring (darker gold)
            pdf.setFillColor(197, 147, 44); // Dark gold #C5932C
            pdf.circle(badgeCenterX, badgeCenterY, (badgeSize / 2) - 1.5, 'F');

            // Inner circle (light gold again)
            pdf.setFillColor(220, 190, 128); // Light gold #DCBE80
            pdf.circle(badgeCenterX, badgeCenterY, (badgeSize / 2) - 3, 'F');

            // Add decorative border lines
            pdf.setDrawColor(197, 147, 44); // Dark gold
            pdf.setLineWidth(0.3);
            pdf.circle(badgeCenterX, badgeCenterY, badgeSize / 2, 'S');
            pdf.circle(badgeCenterX, badgeCenterY, (badgeSize / 2) - 1.5, 'S');
            pdf.circle(badgeCenterX, badgeCenterY, (badgeSize / 2) - 3, 'S');

            // "AWARDED" text
            pdf.setTextColor(197, 147, 44); // Dark gold text
            pdf.setFontSize(6);
            pdf.setFont('Nunito', 'bold');
            pdf.text('AWARDED', badgeCenterX, badgeCenterY - 3, { align: 'center' });

            // Year text
            const currentYear = new Date().getFullYear();
            pdf.setFontSize(9);
            pdf.setFont('Nunito', 'bold');
            pdf.text(currentYear.toString(), badgeCenterX, badgeCenterY + 4, { align: 'center' });

            // Reset text color to white
            pdf.setTextColor(255, 255, 255);

            cardCurrentY += badgeSize + 7;

            // Certificate ID and Awarded date at bottom of card
            pdf.setFontSize(7);
            pdf.setFont('Nunito', 'normal');

            // Certificate ID (left aligned within card)
            const certIdText = `${t.certificateId || 'Certificate ID'}`;
            const certIdValue = `CER-${data.studentUsername}-${data.courseSlug}`.substring(0, 20);
            pdf.text(certIdText, cardX + cardPadding, cardCurrentY);
            pdf.setFont('Nunito', 'bold');
            pdf.text(certIdValue, cardX + cardPadding, cardCurrentY + 4);

            // Awarded date (right aligned within card)
            pdf.setFont('Nunito', 'normal');
            const formattedDate = formatCertificateDate(data.completionDate, locale);
            const awardedText = `${t.completedOn}`;
            pdf.text(awardedText, cardX + cardWidth - cardPadding, cardCurrentY, { align: 'right' });
            pdf.setFont('Nunito', 'bold');
            pdf.text(formattedDate, cardX + cardWidth - cardPadding, cardCurrentY + 4, { align: 'right' });

            // Platform name at the very bottom (centered)
            cardCurrentY += 10;
            pdf.setFontSize(6);
            pdf.setFont('Nunito', 'normal');
            pdf.setTextColor(180, 180, 180); // Gray text
            const platformFooterText = data.platformFooterContent
                ? slateToPlainText(data.platformFooterContent).substring(0, 80)
                : data.platformName;
            const platformLines = pdf.splitTextToSize(platformFooterText, cardWidth - 2 * cardPadding);
            pdf.text(platformLines, cardX + cardWidth / 2, cardCurrentY, { align: 'center' });
            pdf.setTextColor(255, 255, 255); // Reset to white

            return cardY + cardHeight;
        };

        // Calculate vertical center for certificate card
        const totalContentHeight = 140; // Approximate card height
        const certificateStartY = (pageHeight - totalContentHeight) / 2;

        // Draw certificate card on left
        await drawCertificateCard(certificateStartY);

        // RIGHT COLUMN: Course Details
        const rightStartY = margin + 15;
        let rightCurrentY = rightStartY;

        // Course description header
        pdf.setFontSize(11);
        pdf.setFont('Nunito', 'bold');
        pdf.text('Course description', rightColumnX, rightCurrentY);
        rightCurrentY += 7;

        // Course description content
        if (data.courseDescription) {
            pdf.setFontSize(8);
            pdf.setFont('Nunito', 'normal');
            const descriptionText = slateToPlainText(data.courseDescription);
            // Limit to ~280 characters as per design
            const limitedDescription = descriptionText.substring(0, 280);
            const descriptionLines = pdf.splitTextToSize(limitedDescription, rightColumnWidth);
            pdf.text(descriptionLines, rightColumnX, rightCurrentY);
            rightCurrentY += descriptionLines.length * 3.5 + 8;
        }

        // Course modules
        const maxYBeforeFooter = pageHeight - 25;

        if (data.courseSummary && data.courseSummary.length > 0) {
            for (const module of data.courseSummary) {
                // Check if we need a new page
                if (rightCurrentY > maxYBeforeFooter - 20) {
                    // Add footer to current page
                    const currentPage = pdf.getCurrentPageInfo().pageNumber;
                    pdf.setFontSize(8);
                    pdf.setFont('Nunito', 'normal');
                    pdf.text(`Pag. ${currentPage}/${pdf.getNumberOfPages() + 1}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

                    // Add new page
                    pdf.addPage();
                    setupPage();

                    // Redraw certificate card on left (same position)
                    await drawCertificateCard(certificateStartY);

                    // Reset right column position
                    rightCurrentY = rightStartY;
                }

                // Module title
                pdf.setFontSize(9);
                pdf.setFont('Nunito', 'bold');
                const moduleText = `${t.module} ${module.moduleNumber}: ${module.moduleTitle}`;
                const moduleLines = pdf.splitTextToSize(moduleText, rightColumnWidth);
                pdf.text(moduleLines, rightColumnX, rightCurrentY);
                rightCurrentY += moduleLines.length * 3.5 + 4;

                // Lesson titles
                pdf.setFontSize(8);
                pdf.setFont('Nunito', 'normal');
                for (const lessonTitle of module.lessonTitles) {
                    if (rightCurrentY > maxYBeforeFooter - 10) {
                        // Add footer to current page
                        const currentPage = pdf.getCurrentPageInfo().pageNumber;
                        pdf.setFontSize(8);
                        pdf.setFont('Nunito', 'normal');
                        pdf.text(`Pag. ${currentPage}/${pdf.getNumberOfPages() + 1}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

                        // Add new page
                        pdf.addPage();
                        setupPage();

                        // Redraw certificate card on left
                        await drawCertificateCard(certificateStartY);

                        // Reset right column position
                        rightCurrentY = rightStartY;

                        // Reset font after page break
                        pdf.setFontSize(8);
                        pdf.setFont('Nunito', 'normal');
                    }

                    const lessonLines = pdf.splitTextToSize(lessonTitle, rightColumnWidth - 5);
                    pdf.text(lessonLines, rightColumnX, rightCurrentY);
                    rightCurrentY += lessonLines.length * 3.5;
                }

                // Add divider line after module (except if we're near the bottom)
                if (rightCurrentY < maxYBeforeFooter - 15) {
                    rightCurrentY += 5; // Space before divider
                    pdf.setDrawColor(100, 100, 100); // Gray color for divider
                    pdf.setLineWidth(0.2);
                    pdf.line(rightColumnX, rightCurrentY, rightColumnX + rightColumnWidth, rightCurrentY);
                    rightCurrentY += 5; // Space after divider
                } else {
                    rightCurrentY += 5; // Just add space if no room for divider
                }
            }
        }

        // Add footer with platform footer content (centered at bottom)
        const pageCount = pdf.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);

            const footerY = pageHeight - 12;

            // Platform footer content (if available) - smaller text at bottom
            if (data.platformFooterContent) {
                pdf.setFontSize(7);
                pdf.setFont('Nunito', 'italic');
                pdf.setTextColor(180, 180, 180); // Lighter gray
                const footerText = slateToPlainText(data.platformFooterContent);
                const footerLines = pdf.splitTextToSize(footerText, pageWidth - 2 * margin - 40);
                pdf.text(footerLines, pageWidth / 2, footerY - 4, { align: 'center' });
            }

            // Page numbers on all pages (centered) - "Pag. 1/2" format
            pdf.setFontSize(8);
            pdf.setFont('Nunito', 'normal');
            pdf.setTextColor(255, 255, 255); // White
            pdf.text(`Pag. ${i}/${pageCount}`, pageWidth / 2, footerY, { align: 'center' });
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