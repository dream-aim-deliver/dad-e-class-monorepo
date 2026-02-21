import { FC, ReactNode } from 'react';
import { cn } from '../utils/style-utils';
import { IconClose } from './icons/icon-close';
import { IconWarning } from './icons/icon-warning';

interface BannerProps {
  title?: string;
  description?: string;
  icon?: boolean;
  customIcon?: ReactNode;
  style?: 'success' | 'warning' | 'error' | 'neutral';
  closeable?: boolean;
  onClose?: () => void;
  className?: string;
  button?: {
    label: string;
    onClick: () => void;
  };
  buttonClassName?: string;
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
 * @param {'success'|'warning'|'error'|'neutral'} [props.style='success'] - Visual style of the banner that determines its color scheme
 * @param {boolean} [props.closeable=false] - Whether to show a close button on the banner
 * @param {Function} [props.onClose] - Callback function triggered when the close button is clicked
 * @param {string} [props.className] - Additional CSS classes to apply to the banner
 * @param {Object} [props.button] - Optional button configuration
 * @param {string} props.button.label - Text to display on the button
 * @param {Function} props.button.onClick - Callback function triggered when the button is clicked
 * 
 * @example
 * // Success Banner
 * <Banner 
 *   title="Success!" 
 *   description="Your changes have been saved."
 *   style="success"
 * />
 * 
 * // Warning banner with icon
 * <Banner
 *   title="Warning"
 *   description="Your session will expire soon."
 *   style="warning"
 *   icon={true}
 * />
 * 
 * // Error banner with close button
 * <Banner
 *   title="Error"
 *   description="Failed to save changes."
 *   style="error"
 *   closeable={true}
 *   onClose={() => console.log('Banner closed')}
 * />
 * 
 * // Neutral banner with button
 * <Banner
 *   title="Update Available"
 *   description="A new version is available for download."
 *   style="neutral"
 *   button={{
 *     label: "Download",
 *     onClick: () => console.log('Download clicked')
 *   }}
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
  button,
  buttonClassName,
}) => {
  const styleClasses: Record<string, string> = {
    success: 'text-feedback-success-primary border-feedback-success-primary',
    warning: 'text-feedback-warning-primary border-feedback-warning-primary',
    error: 'text-feedback-error-primary border-feedback-error-primary',
    neutral: 'text-white border-white',
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
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {icon && (
          <div className="flex-shrink-0">
            {customIcon || <IconWarning data-testid='icon' />}
          </div>
        )}

        <div className="flex flex-col min-w-0">
          {title && (
            <div className="flex items-center gap-2">
              <span className="font-bold truncate" title={title}>
                {title}
              </span>
            </div>
          )}

          {description && (
            <span className="leading-tight break-words">
              {description}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 flex-shrink-0">
        {button && (
          <button
            onClick={button.onClick}
            className={cn("px-3 py-1 text-sm font-medium rounded border border-current hover:bg-current hover:bg-current/20 transition-all duration-200 cursor-pointer", buttonClassName)}
          >
            {button.label}
          </button>
        )}

        {closeable && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="hover:opacity-80 transition-all duration-200 mt-[2px]"
          >
            <IconClose classNames="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Example usage with long text to demonstrate overflow handling
export default Banner;