import React, { useRef, useState, useEffect } from 'react';
import { useStepperContext } from './stepper-context';

interface StepperListProps {
    children: React.ReactNode;
}

/**
 * StepperList Component
 *
 * A layout and progress visualization wrapper for stepper items.
 * It:
 * - Aligns `StepperItem` components in a horizontal row.
 * - Renders a base line and a growing progress line underneath.
 * - Dynamically calculates and animates the progress bar width based on the current step.
 *
 * This component must be used within a `StepperProvider` context, typically via `Stepper.Root`.
 * The child components are expected to be `StepperItem` elements.
 *
 * @component
 * @example
 * ```tsx
 * <StepperList>
 *   <StepperItem step={1} description="Info" />
 *   <StepperItem step={2} description="Details" />
 *   <StepperItem step={3} description="Submit" />
 * </StepperList>
 * ```
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - StepperItem components to be displayed.
 *
 * @returns {JSX.Element} A visual container with a horizontal progress indicator and step items.
 */

export function StepperList({ children }: StepperListProps) {
    const { currentStep, totalSteps } = useStepperContext();

    const containerRef = useRef<HTMLDivElement>(null);
    const [progressWidth, setProgressWidth] = useState(0);

    const circleDiameter = 28;
    const circleRadius = circleDiameter / 1; // Radius used for offsetting the line from container edges

    useEffect(() => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;

        // Maximum width available for the progress line, accounting for circle sizes at both ends
        const lineMaxWidth = containerWidth - circleDiameter;

        let newWidth = ((currentStep - 1) / (totalSteps - 1)) * lineMaxWidth;

        const margin = 12;

        // Prevent progress line from exceeding max width minus margin
        if (newWidth > lineMaxWidth - margin) {
            newWidth = lineMaxWidth - margin;
        }

        setProgressWidth(newWidth);
    }, [currentStep, totalSteps]);

    return (
        <div
            ref={containerRef}
            className="relative flex items-center justify-between w-full"
            style={{ minWidth: '300px' }}
        >
            {/* Base line behind the steps with reduced opacity */}
            <div
                className="absolute h-1 bg-action-default opacity-20"
                style={{
                    top: '25%',
                    left: circleRadius,
                    right: circleRadius,
                    transform: 'translateY(-50%)',
                }}
            />

            {/* Progress line that grows as steps advance */}
            <div
                className="absolute h-1 bg-action-default transition-all duration-300"
                style={{
                    top: '25%',
                    left: circleRadius,
                    width: progressWidth,
                    transform: 'translateY(-50%)',
                }}
            />

            {children}
        </div>
    );
}
