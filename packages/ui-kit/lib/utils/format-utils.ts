export function formatPrice(value: number): string {
    return value.toFixed(2);
}

// TODO: possibly support 12-hour format
export function formatDate(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} at ${hours}:${minutes}`;
}

/**
 * Formats a date for certificate display with locale support.
 * Converts ISO timestamp strings or Date objects to human-readable format.
 *
 * @param {string | Date} dateInput - ISO timestamp string or Date object
 * @param {string} locale - Language locale ('en' or 'de')
 * @returns {string} - Formatted date string
 *
 * @example
 * formatCertificateDate('2024-10-26T17:05:53.655296', 'en'); // "October 26, 2024"
 * formatCertificateDate('2024-10-26T17:05:53.655296', 'de'); // "26. Oktober 2024"
 * formatCertificateDate(new Date(), 'en'); // "January 15, 2025"
 */
export function formatCertificateDate(dateInput: string | Date, locale = 'en'): string {
    try {
        let date: Date;

        // Convert string to Date if needed
        if (typeof dateInput === 'string') {
            date = new Date(dateInput);
        } else {
            date = dateInput;
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.error('Invalid date input:', dateInput);
            return String(dateInput);
        }

        // Format based on locale
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', options);
    } catch (error) {
        console.error('Error formatting certificate date:', error);
        return String(dateInput);
    }
}
