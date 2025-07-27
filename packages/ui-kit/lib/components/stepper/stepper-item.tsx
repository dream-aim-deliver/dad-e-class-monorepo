import React from 'react';
import { useStepperContext } from './stepper-context';
import { cn } from '../../utils/style-utils';

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
    step: number;
    description: string;
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
 * @param {string} [props.className] - Optional custom class names.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.props] - Additional HTML div attributes.
 *
 * @returns {JSX.Element} A styled visual representation of the step.
 */

export function StepperItem({
    step,
    description,
    className,
    ...props
}: StepperItemProps) {
    const { currentStep } = useStepperContext();

    const isCompleted = step < currentStep;
    const isActive = step === currentStep;

    return (
        <div
            className={cn('flex flex-col items-center min-w-[50px]', className)}
            {...props}
        >
            <div
                className={cn(
                    'w-7 h-7 rounded-full border-2 flex items-center justify-center font-semibold z-10',
                    isCompleted
                        ? 'bg-action-default text-text-primary-inverted border-action-default'
                        : isActive
                          ? 'border-action-default text-text-primary bg-card-fill'
                          : 'border-card-stroke text-text-primary bg-card-fill',
                )}
            >
                {step}
            </div>
            <span
                className={cn(
                    'mt-2 text-sm text-center',
                    isActive ? 'text-action-default' : 'text-text-secondary',
                )}
            >
                {description}
            </span>
        </div>
    );
}
