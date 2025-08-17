'use client';

import { ComponentCard, IconModule } from '@maany_shr/e-class-ui-kit';
import EditHeader from './components/edit-header';
import EditLayout from './components/edit-layout';

interface EditLessonProps {
    lessonId: number;
}

export default function EditLesson({ lessonId }: EditLessonProps) {
    return (
        <div className="flex flex-col gap-4">
            <EditHeader
                title="Edit lesson"
                onPreview={() => {
                    console.log('Preview clicked for lesson:', lessonId);
                }}
                onSave={() => {
                    console.log('Save clicked for lesson:', lessonId);
                }}
                disablePreview={false}
                isSaving={false}
            />
            <EditLayout
                panel={
                    <>
                        <span className="text-lg font-bold">Components</span>
                        <div className="flex flex-col gap-2">
                            <ComponentCard
                                name="Module"
                                icon={<IconModule />}
                                onClick={() => {}}
                            />
                        </div>
                    </>
                }
                editor={undefined}
            />
        </div>
    );
}
