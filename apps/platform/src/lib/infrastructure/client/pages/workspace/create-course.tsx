'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    CreateCourseForm,
    IconSave,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TCourseMetadata } from 'packages/models/src/course';
import {
    TFileUploadRequest,
    TFileMetadata,
} from 'packages/models/src/file-metadata';

export default function CreateCourse() {
    const locale = useLocale() as TLocale;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
                <SectionHeading text="Create Course" />
                <Button
                    variant="primary"
                    onClick={() => {
                        // Handle create course logic
                    }}
                    text="Save"
                    hasIconLeft
                    iconLeft={<IconSave />}
                />
            </div>

            <CreateCourseForm
                image={null}
                onFileChange={function (
                    file: TFileUploadRequest,
                    abortSignal?: AbortSignal,
                ): Promise<TFileMetadata> {
                    throw new Error('Function not implemented.');
                }}
                onUploadComplete={function (file): void {
                    throw new Error('Function not implemented.');
                }}
                onSave={function (course: TCourseMetadata): void {
                    throw new Error('Function not implemented.');
                }}
                onDelete={function (id: string): void {
                    throw new Error('Function not implemented.');
                }}
                onDownload={function (id: string): void {
                    throw new Error('Function not implemented.');
                }}
                locale={locale}
            />
        </div>
    );
}
