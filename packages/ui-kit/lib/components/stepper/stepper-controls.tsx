import React from 'react';
import { useStepperContext } from './stepper-context';
import { Button } from '../button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface Step {
    step: number;
    description: string;
}

interface StepperControlsProps extends isLocalAware {
    steps: Step[];
    onPublish?: () => void;
    onGoBack?: () => void;
}

/**
 * StepperControls Component
 *
 * Provides navigation controls (Back and Next/Publish buttons) for a multi-step form or process.
 * It integrates with the `StepperProvider` context to track and modify the current step.
 * Automatically adjusts button text and behavior based on the current step.
 * Localization support is included through the `locale` prop.
 *
 * @component
 * @example
 * ```tsx
 * <StepperControls
 *   steps={[
 *     { step: 1, description: 'Personal Info' },
 *     { step: 2, description: 'Payment' },
 *     { step: 3, description: 'Confirmation' }
 *   ]}
 *   locale="en"
 *   onPublish={() => console.log('Form submitted')}
 * />
 * ```
 *
 * @param {Object} props - Component props.
 * @param {Array<{ step: number, description: string }>} props.steps - Step metadata used to display the next step's description.
 * @param {string} props.locale - Locale identifier used for translations (e.g., "en-US").
 * @param {() => void} [props.onPublish] - Optional callback fired when the final step's primary button is clicked.
 * @param {() => void} [props.onGoBack] - Optional callback fired when the "Back" button is clicked (not currently used in code).
 *
 * @returns {JSX.Element} Rendered control buttons for navigating steps.
 */

export function StepperControls({
    steps,
    locale,
    onPublish,
}: StepperControlsProps) {
    const { currentStep, setCurrentStep, totalSteps } = useStepperContext();
    const dictionary = getDictionary(locale).components.stepper;

    const nextStepDescription =
        steps.find((s) => s.step === currentStep + 1)?.description ?? '';

    const handleNextClick = () => {
        if (currentStep === totalSteps) {
            if (onPublish) {
                onPublish();
            }
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    return (
        <div className="flex flex-row gap-2">
            <Button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="w-full"
                variant="secondary"
                text={
                    currentStep === totalSteps
                        ? dictionary.noPublishButton
                        : dictionary.backButton
                }
            />
            <Button
                onClick={handleNextClick}
                className="w-full"
                variant="primary"
                text={
                    currentStep === totalSteps
                        ? dictionary.publishButton
                        : `${dictionary.nextButton} ${nextStepDescription}`
                }
            />
        </div>
    );
}
