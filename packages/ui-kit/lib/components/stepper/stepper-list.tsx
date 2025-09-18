'use client';

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

// Constants for stepper visual styling
const circleDiameter = 28;
const circleRadius = circleDiameter / 2;
const progressLineOffset = 8; // Additional offset for progress line extension

export function StepperList({ children }: StepperListProps) {
    const { currentStep, totalSteps } = useStepperContext();

    const containerRef = useRef<HTMLDivElement>(null);
    const [progressWidth, setProgressWidth] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const stepElements = container.querySelectorAll('[data-step-item]');

            if (stepElements.length === 0 || totalSteps <= 1) {
                setProgressWidth(0);
                return;
            }

            // Get the first and last step positions
            const firstStep = stepElements[0] as HTMLElement;
            const lastStep = stepElements[
                stepElements.length - 1
            ] as HTMLElement;

            // Find the circle elements within each step to get their exact positions
            const firstCircle = firstStep.querySelector(
                '[data-step-circle]',
            ) as HTMLElement;
            const lastCircle = lastStep.querySelector(
                '[data-step-circle]',
            ) as HTMLElement;

            if (!firstCircle || !lastCircle) return;

            const firstStepCenter =
                firstStep.offsetLeft + firstStep.offsetWidth / 2;
            const lastStepCenter =
                lastStep.offsetLeft + lastStep.offsetWidth / 2;

            // Calculate the total distance between first and last steps
            const totalDistance = lastStepCenter - firstStepCenter;

            // Calculate progress based on current step
            const progress = (currentStep - 1) / (totalSteps - 1);
            const baseWidth = totalDistance * progress;

            // Add offset to ensure the line extends slightly beyond the current step
            const newWidth = Math.max(0, baseWidth + progressLineOffset);

            setProgressWidth(newWidth);
        };

        // Initial calculation
        calculateProgress();

        // Recalculate on window resize
        const handleResize = () => {
            setTimeout(calculateProgress, 0); // Allow DOM to update
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [currentStep, totalSteps]);

    return (
        <div
            ref={containerRef}
            className="relative flex items-start justify-between w-full min-w-0 overflow-hidden"
        >
            {/* Base line behind the steps with reduced opacity */}
            <div
                className="absolute h-1 bg-action-default opacity-20 top-3 sm:top-[14px] -translate-y-1/2"
                style={{
                    left: circleRadius,
                    right: circleRadius,
                }}
            />

            {/* Progress line that grows as steps advance */}
            <div
                className="absolute h-1 bg-action-default transition-all duration-300 top-3 sm:top-[14px] -translate-y-1/2"
                style={{
                    left: circleRadius,
                    width: progressWidth,
                }}
            />

            {children}
        </div>
    );
}
