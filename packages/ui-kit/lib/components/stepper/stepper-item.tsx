import React from 'react';
import { useStepperContext } from './stepper-context';
import { cn } from '../../utils/style-utils';

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
    step: number;
    description: string;
    clickable?: boolean;
}

/**
 * StepperItem Component
 *
 * A single step in a stepper sequence. Visually represents its state based on the current step:
 * - **Active**: Highlighted with a border and active color.
 * - **Completed**: Filled with a background color to indicate progress.
 * - **Upcoming**: Muted styling for steps not yet reached.
 *
 * This component should be used within a `StepperProvider` context (typically via `Stepper.Root`)
 * and is intended to be rendered inside `Stepper.List`.
 *
 * @component
 * @example
 * ```tsx
 * <StepperItem step={1} description="Personal Info" />
 * ```
 *
 * @param {Object} props - Component props.
 * @param {number} props.step - The step number (should start from 1).
 * @param {string} props.description - Text label shown below the step number.
 * @param {boolean} [props.clickable=true] - Whether the step can be clicked to navigate.
 * @param {string} [props.className] - Optional custom class names.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.props] - Additional HTML div attributes.
 *
 * @returns {JSX.Element} A styled visual representation of the step.
 */

export function StepperItem({
    step,
    description,
    clickable = true,
    className,
    onClick,
    ...props
}: StepperItemProps) {
    const { currentStep, setCurrentStep } = useStepperContext();

    const isCompleted = step < currentStep;
    const isActive = step === currentStep;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (clickable) {
            setCurrentStep(step);
        }
        if (onClick) {
            onClick(event);
        }
    };

    return (
        <div
            className={cn(
                'flex flex-col items-center min-w-[50px]',
                clickable && 'cursor-pointer hover:scale-90 transition-opacity',
                className,
            )}
            data-step-item
            onClick={handleClick}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={(e) => {
                if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setCurrentStep(step);
                }
            }}
            {...props}
        >
            <div
                className={cn(
                    'w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center font-semibold z-10 text-xs sm:text-sm',
                    isCompleted
                        ? 'bg-action-default text-text-primary-inverted border-action-default'
                        : isActive
                          ? 'border-action-default text-text-primary bg-card-fill'
                          : 'border-card-stroke text-text-primary bg-card-fill',
                )}
                data-step-circle
            >
                {step}
            </div>
            <span
                className={cn(
                    'mt-1 sm:mt-2 text-xs sm:text-sm text-center max-w-[60px] sm:max-w-[80px] leading-tight break-words hyphens-auto',
                    isActive ? 'text-action-default' : 'text-text-secondary',
                )}
                title={description}
            >
                {description}
            </span>
        </div>
    );
}
