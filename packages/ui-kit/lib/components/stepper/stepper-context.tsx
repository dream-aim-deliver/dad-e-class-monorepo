'use client';
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface StepperContextType {
    currentStep: number; // Current active step in the stepper
    setCurrentStep: (step: number) => void; // Function to update the current step
    totalSteps: number; // Total number of steps in the stepper
}

/**
 * useStepperContext Hook
 *
 * Custom hook to access the stepper state (currentStep, setCurrentStep, totalSteps).
 * Must be used within a component wrapped by `StepperProvider`.
 *
 * @throws Will throw an error if called outside a `StepperProvider`.
 *
 * @returns {{
 *   currentStep: number;
 *   setCurrentStep: (step: number) => void;
 *   totalSteps: number;
 * }} Stepper state and handlers.
 */

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export function useStepperContext() {
    const context = useContext(StepperContext);
    if (!context) {
        throw new Error(
            'useStepperContext must be used inside StepperProvider',
        );
    }
    return context;
}

export interface StepperProviderProps {
    defaultStep: number; // Initial step to start on
    totalSteps: number; // Total steps for the stepper
    onStepChange?: (step: number) => void; // Optional callback when step changes
    children: React.ReactNode; // Nested components inside the provider
}

/**
 * StepperProvider Component
 *
 * A React context provider that manages and exposes state for a stepper interface,
 * including the current step, total steps, and a setter function. It also optionally
 * notifies consumers when the step changes via a callback.
 *
 * Must wrap any components that use `useStepperContext`, such as `StepperItem`,
 * `StepperControls`, or `StepperList`.
 *
 * @component
 * @example
 * ```tsx
 * <StepperProvider defaultStep={1} totalSteps={3} onStepChange={(step) => console.log(step)}>
 *   <StepperList>
 *     <StepperItem step={1} description="Step One" />
 *     <StepperItem step={2} description="Step Two" />
 *     <StepperItem step={3} description="Step Three" />
 *   </StepperList>
 *   <StepperControls />
 * </StepperProvider>
 * ```
 *
 * @param {Object} props - StepperProvider props.
 * @param {number} props.defaultStep - The initial active step (1-based index).
 * @param {number} props.totalSteps - Total number of steps in the stepper flow.
 * @param {(step: number) => void} [props.onStepChange] - Optional callback invoked when step changes.
 * @param {React.ReactNode} props.children - Nested children that will have access to the stepper context.
 *
 * @returns {JSX.Element} Stepper context provider wrapping child components.
 */

export function StepperProvider({
    defaultStep,
    totalSteps,
    onStepChange,
    children,
}: StepperProviderProps) {
    const [currentStep, setCurrentStepState] = useState(defaultStep);

    // Memoize handler to prevent unnecessary re-renders
    const setCurrentStep = useCallback((step: number) => {
        setCurrentStepState(step);
        if (onStepChange) onStepChange(step);
    }, [onStepChange]);

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ currentStep, setCurrentStep, totalSteps }), [currentStep, setCurrentStep, totalSteps]);

    return (
        <StepperContext.Provider value={value}>
            {children}
        </StepperContext.Provider>
    );
}
