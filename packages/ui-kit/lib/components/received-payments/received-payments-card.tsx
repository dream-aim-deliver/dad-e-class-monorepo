import { Button } from '../button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Divider } from '../divider';
import { IconFile } from '../icons';
import { IconExternalLink } from '../icons/icon-external-link';
import { Badge } from '../badge';

export interface ReceivedPaymentsCardProps extends isLocalAware {
    transactionId: string;
    transactionDate: string;
    total: string;
    fromStudentName?: string;
    items: string[];
    tags?: string[];
    onInvoiceClick: () => void;
}

/**
 * `ReceivedPaymentsCard` is a UI component that displays
 * a received payment transaction from a student/customer.
 *
 * It shows:
 * - Transaction ID and date
 * - Student name who made the payment
 * - List of purchased items
 * - Total amount
 * - Invoice download button
 *
 * ---
 *
 * ### 🧩 Example usage
 *
 * ```tsx
 * <ReceivedPaymentsCard
 *   locale="en"
 *   transactionId="912840"
 *   transactionDate="2024-12-13"
 *   total="248.00 CHF"
 *   fromStudentName="John Doe"
 *   items={[
 *     '2x 40min coaching sessions',
 *     '4x "Intro to photography" course sales',
 *     '1x "Advanced photo editing" course sale, as part of "Complete photography" package',
 *     '20x assignments reviewed'
 *   ]}
 *   onInvoiceClick={() => alert('Invoice clicked')}
 * />
 * ```
 *
 * ---
 *
 * @param {ReceivedPaymentsCardProps} props - Component props
 * @param {string} props.transactionId - Unique ID of the transaction
 * @param {string} props.transactionDate - Date when the payment was received
 * @param {string} props.total - Formatted total amount received
 * @param {string} props.fromStudentName - Name of the student who made the payment
 * @param {string[]} props.items - List of items included in the payment
 * @param {string[]} [props.tags] - Optional tags to display
 * @param {string} props.locale - Locale for localized labels
 * @param {() => void} props.onInvoiceClick - Callback when invoice is clicked
 */

export const ReceivedPaymentsCard = (props: ReceivedPaymentsCardProps) => {
    const dictionary = getDictionary(props.locale).components
        .receivedPaymentsCard;

    return (
        <div className="flex flex-col md:p-4 p-2 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <p className="text-text-primary text-md">
                    {props.transactionDate}
                </p>
                <p className="text-text-secondary text-xs truncate" title={`ID: ${props.transactionId}`}>
                    ID: {props.transactionId}
                </p>
            </div>
            <Divider className="my-1" />

            {/* Invoice Footer */}
            <div className="flex flex-row w-full px-2 py-4 justify-between items-center gap-2 bg-base-neutral-800 border border-base-neutral-700 rounded-md">
                <Button
                    variant="text"
                    className="p-0 gap-1 text-sm flex-shrink-0"
                    size="small"
                    text={dictionary.invoice}
                    onClick={props.onInvoiceClick}
                    hasIconRight
                    iconRight={<IconExternalLink size="6" />}
                />
                <h6 className="text-right truncate" title={props.total}>{props.total}</h6>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-2">
                <ul className="list-disc list-inside text-text-secondary text-sm md:text-md space-y-1">
                    {props.items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            <Divider className="my-1" />
            {/* Tags */}
            {props.tags && props.tags.length > 0 && (
                <div className="flex flex-row flex-wrap gap-2 mt-2">
                    {props.tags.map((tag, index) => (
                        <>
                            <Badge
                                variant="info"
                                size="medium"
                                text={tag}
                                key={index}
                            />
                        </>
                    ))}
                </div>
            )}
        </div>
    );
};
