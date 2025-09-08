'use client';

import { Button, SectionHeading } from '@maany_shr/e-class-ui-kit';

export default function EditPreCourseAssessment() {
    return (
        <div className="w-full p-4 bg-card-fill rounded-md flex flex-col gap-3 border-1 border-card-stroke">
            <SectionHeading text="Pre-course assessment form" />
            <span className="text-sm text-text-secondary">
                This form is displayed automatically at the beginning of each
                course
            </span>
            <div className="flex flex-col justify-between w-full bg-neutral-800 h-28 rounded-md border-1 border-neutral-700 p-4">
                <span className="text-sm text-text-primary font-bold">
                    This form is disabled.
                </span>
                <Button variant="primary" text="Enable form" className="w-min" size="small" />
            </div>
        </div>
    );
}
