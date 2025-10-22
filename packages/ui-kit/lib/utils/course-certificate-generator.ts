import jsPDF from 'jspdf';

/**
 * Interface for certificate data required for PDF generation
 */
export interface CertificateData {
    studentName: string;
    courseTitle: string;
    completionDate: string;
    platformName?: string;
}

/**
 *
 * @param data - Certificate data including student name, course title, and completion date
 * @returns Promise that resolves when PDF is generated and downloaded
 */
export async function generateCertificatePDF(data: CertificateData): Promise<void> {
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
        pdf.setFontSize(32);
        pdf.setFont('Nuninto', 'bold');
        pdf.text('Certificate of Completion', centerX, 40, { align: 'center' });

        // Decorative line under title
        pdf.setLineWidth(1);
        pdf.line(centerX - 80, 45, centerX + 80, 45);

        // "This is to certify that" text
        pdf.setFontSize(16);
        pdf.setFont('Nuninto', 'normal');
        pdf.text('This is to certify that', centerX, 65, { align: 'center' });

        // Student name (larger, bold)
        pdf.setFontSize(24);
        pdf.setFont('Nuninto', 'bold');
        pdf.text(data.studentName, centerX, 85, { align: 'center' });

        // "has successfully completed" text
        pdf.setFontSize(16);
        pdf.setFont('Nuninto', 'normal');
        pdf.text('has successfully completed the course', centerX, 105, { align: 'center' });

        // Course title (larger, bold)
        pdf.setFontSize(20);
        pdf.setFont('Nuninto', 'bold');
        pdf.text(data.courseTitle, centerX, 125, { align: 'center' });

        // Completion date
        pdf.setFontSize(14);
        pdf.setFont('Nuninto', 'normal');
        pdf.text(`Completed on: ${data.completionDate}`, centerX, 145, { align: 'center' });

        // Platform name (if provided)
        if (data.platformName) {
            pdf.setFontSize(12);
            pdf.setFont('Nuninto', 'italic');
            pdf.text(data.platformName, centerX, 170, { align: 'center' });
        }

        // Generate filename with student name and course title (sanitized)
        const sanitizedStudentName = data.studentName.replace(/[^a-zA-Z0-9]/g, '_');
        const sanitizedCourseTitle = data.courseTitle.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Certificate_${sanitizedStudentName}_${sanitizedCourseTitle}.pdf`;

        // Save the PDF
        pdf.save(filename);
    } catch (error) {
        throw `Failed to generate certificate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}