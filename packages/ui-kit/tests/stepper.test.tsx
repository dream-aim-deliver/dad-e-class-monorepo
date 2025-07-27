import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stepper } from '../lib/components/stepper/stepper';
import { StepperControls } from '../lib/components/stepper/stepper-controls';

const steps = [
    { step: 1, description: 'Pkg. Details' },
    { step: 2, description: 'Courses' },
    { step: 3, description: 'Pricing' },
    { step: 4, description: 'Preview' },
];

const onPublishMock = vi.fn();

describe('<Stepper />', () => {
    it('renders all step descriptions', () => {
        render(
            <Stepper.Root defaultStep={2} totalSteps={steps.length}>
                <Stepper.List>
                    {steps.map(({ step, description }) => (
                        <Stepper.Item
                            key={step}
                            step={step}
                            description={description}
                        />
                    ))}
                </Stepper.List>
                <StepperControls
                    steps={steps}
                    locale="en"
                    onPublish={onPublishMock}
                />
            </Stepper.Root>,
        );

        steps.forEach(({ description }) => {
            expect(screen.getByText(description)).toBeInTheDocument();
        });
    });

    it('calls onPublish when publish button is clicked on last step', () => {
        render(
            <Stepper.Root defaultStep={steps.length} totalSteps={steps.length}>
                <Stepper.List>
                    {steps.map(({ step, description }) => (
                        <Stepper.Item
                            key={step}
                            step={step}
                            description={description}
                        />
                    ))}
                </Stepper.List>
                <StepperControls
                    steps={steps}
                    locale="en"
                    onPublish={onPublishMock}
                />
            </Stepper.Root>,
        );

        const publishButton = screen.getByRole('button', { name: /publish/i });
        expect(publishButton).toBeInTheDocument();

        publishButton.click();
        expect(onPublishMock).toHaveBeenCalledTimes(1);
    });
});
