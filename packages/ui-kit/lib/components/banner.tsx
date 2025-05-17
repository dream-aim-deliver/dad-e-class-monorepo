import { FC, ReactNode } from 'react';

import { cn } from '../utils/style-utils';
import { IconClose } from './icons/icon-close';
import { IconWarning } from './icons/icon-warning';

interface BannerProps {
    title?: string;
    description?: string;
    icon?: boolean;
    customIcon?: ReactNode;
    style?: 'success' | 'warning' | 'error';
    closeable?: boolean;
    onClose?: () => void;
    className?: string;
}

/**
 * Banner component for displaying information, warnings, or errors.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.title] - The main heading text of the banner
 * @param {string} [props.description] - Additional explanatory text to display under the title
 * @param {boolean} [props.icon=false] - Whether to show an icon on the left side of the banner
 * @param {ReactNode} [props.customIcon] - Custom icon element to override the default warning icon
 * @param {'success'|'warning'|'error'} [props.style='success'] - Visual style of the banner that determines its color scheme
 * @param {boolean} [props.closeable=false] - Whether to show a close button on the banner
 * @param {Function} [props.onClose] - Callback function triggered when the close button is clicked
 * @param {string} [props.className] - Additional CSS classes to apply to the banner
 * 
 * @example
 *  Success Banner
 * <Banner 
 *   title="Success!" 
 *   description="Your changes have been saved."
 *   style="success"
 * />
 * 
 * Error banner with custom icon
 * <Banner
 *   title="Warning"
 *   description="Your session will expire soon."
 *   style="warning"
 *   icon={true}
 * />
 * 
 * Error banner with close button
 * <Banner
 *   title="Error"
 *   description="Failed to save changes."
 *   style="error"
 *   closeable={true}
 *   onClose={() => console.log('Banner closed')}
 * />
 */
const Banner: FC<BannerProps> = ({
    title,
    description,
    icon = false,
    customIcon,
    style = 'success',
    closeable = false,
    onClose,
    className,
}) => {
    const styleClasses: Record<string, string> = {
        success: 'text-feedback-success-primary border-feedback-success-primary',
        warning: 'text-feedback-warning-primary border-feedback-warning-primary',
        error: 'text-feedback-error-primary border-feedback-error-primary',
    };

    const colorClass = styleClasses[style];

    const containerClasses = cn(
        'flex items-start justify-between px-4 py-3',
        'transition-all duration-200 rounded-small',
        'bg-transparent',
        'border border-[1px]',
        colorClass,
        className
    );

    return (
        <div data-testid='parent' className={containerClasses}>
            <div className="flex items-start gap-3">
                {icon && (
                    <div className="flex-shrink-0">
                        {customIcon || <IconWarning data-testid='icon' />}
                    </div>
                )}

                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-bold">
                            {title}
                        </span>
                    </div>

                    {description && (
                        <span
                            className="leading-tight"

                        >
                            {description}
                        </span>
                    )}
                </div>
            </div>

            {closeable && (
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="flex-shrink-0 hover:opacity-80 transition-all duration-200 mt-[2px]"
                >
                    <IconClose classNames="w-4 h-4 md:w-5 md:h-5" />
                </button>
            )}
        </div>
    );
};

export default Banner;
