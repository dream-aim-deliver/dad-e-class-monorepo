import { FC } from 'react';
import { Button } from '../button';
import { TextInput } from '../text-input';
import { cn } from '../../utils/style-utils';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';

interface JoinGroupProps {
  variant: 'empty' | 'already-has-coach';
  locale: TLocale;
  couponCode?: string;
  onCouponCodeChange?: (value: string) => void;
  onValidateCode?: () => void;
  isValidating?: boolean;
  validationError?: string;
  className?: string;
}

/**
 * JoinGroup component for entering a coupon code to join a group
 * 
 * @param variant - 'empty' shows the basic join form, 'already-has-coach' disables the form
 * @param locale - The locale for translations
 * @param couponCode - Current coupon code value
 * @param onCouponCodeChange - Callback for coupon code changes
 * @param onValidateCode - Callback for validating the coupon code
 * @param isValidating - Whether validation is in progress
 * @param validationError - Error message from validation (shown via TextInput feedback)
 * @param className - Additional CSS classes
 */
export const JoinGroup: FC<JoinGroupProps> = ({
  variant,
  locale,
  couponCode = '',
  onCouponCodeChange,
  onValidateCode,
  isValidating = false,
  validationError,
  className,
}) => {
  const dictionary = getDictionary(locale);

  return (
    <div
      className={cn(
        'flex flex-col bg-card-fill gap-4 text-sm md:text-md border border-card-stroke p-4 rounded-lg text-text-secondary h-fit',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col min-w-0">
          <h3 className="text-text-primary text-sm md:text-md leading-4 font-bold">
            {dictionary.components.joinGroup.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary leading-[150%]">
        {dictionary.components.joinGroup.description}
      </p>

      {/* Form */}
      <div className="flex flex-col gap-4">
        {/* Coupon Code Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">
            {dictionary.components.joinGroup.couponCodeLabel}
          </label>
          <TextInput
            inputField={{
              value: couponCode,
              setValue: variant === 'already-has-coach' 
                ? () => { /* Input disabled for already-has-coach variant */ } 
                : (onCouponCodeChange || (() => { /* No handler provided */ })),
              inputText: dictionary.components.joinGroup.couponCodePlaceholder,
            }}
            hasFeedback={!!validationError}
            feedbackMessage={
              validationError
                ? {
                    type: 'error' as const,
                    message: validationError,
                  }
                : undefined
            }
          />
        </div>

        {/* Validate Button */}
        <Button
          variant="primary"
          size="medium"
          onClick={onValidateCode}
          text={isValidating ? dictionary.components.joinGroup.validating : dictionary.components.joinGroup.validateCode}
          disabled={!couponCode.trim() || isValidating || variant === 'already-has-coach'}
        />
      </div>
    </div>
  );
};

export default JoinGroup;
