import React from 'react';
import { StepperProvider } from './stepper-context';
import { StepperList } from './stepper-list';
import { StepperItem } from './stepper-item';
import { StepperControls } from './stepper-controls';

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultStep: number;
    totalSteps: number;
    onStepChange?: (step: number) => void;
    children: React.ReactNode;
}

function StepperRoot({
    defaultStep,
    totalSteps,
    onStepChange,
    children,
    className = '',
    ...props
}: StepperProps) {
    return (
        <StepperProvider
            defaultStep={defaultStep}
            totalSteps={totalSteps}
            onStepChange={onStepChange}
        >
            <div className={`w-full flex ${className}`} {...props}>
                <div className="w-full gap-5 flex flex-col">{children}</div>
            </div>
        </StepperProvider>
    );
}
/**
 * StepperRoot Component
 *
 * Provides a context wrapper for a stepper UI system, managing step state
 * and sharing step-related context with child components like `Stepper.Item` and `Stepper.Controls`.
 *
 * Intended to be used as `Stepper.Root` alongside:
 * - `Stepper.List` — renders the list of steps
 * - `Stepper.Item` — defines each step
 * - `Stepper.Controls` — renders navigation buttons
 *
 * @component
 * @example
 * ```tsx
 * <Stepper.Root defaultStep={0} totalSteps={3} onStepChange={(step) => console.log(step)}>
 *   <Stepper.List>
 *     <Stepper.Item step={0} description="Step One" />
 *     <Stepper.Item step={1} description="Step Two" />
 *     <Stepper.Item step={2} description="Step Three" />
 *   </Stepper.List>
 *   <Stepper.Controls />
 * </Stepper.Root>
 * ```
 *
 * @param {Object} props - Stepper configuration props.
 * @param {number} props.defaultStep - Zero-based index of the initial active step.
 * @param {number} props.totalSteps - Total number of steps in the stepper.
 * @param {(step: number) => void} [props.onStepChange] - Optional callback triggered on step changes.
 * @param {React.ReactNode} props.children - Stepper components (List, Item, Controls).
 * @param {string} [props.className] - Optional additional CSS class names.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.props] - Additional HTML attributes for the root div.
 *
 * @returns {JSX.Element} A context provider wrapping the stepper components.
 */

export const Stepper = {
    Root: StepperRoot,
    List: StepperList,
    Item: StepperItem,
    Controls: StepperControls,
};

export { StepperRoot, StepperList, StepperItem, StepperControls };
