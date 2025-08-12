'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    CreateCourseForm,
    IconSave,
    SectionHeading,
    useCreateCourseForm,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TCourseMetadata } from 'packages/models/src/course';
import {
    TFileUploadRequest,
    TFileMetadata,
} from 'packages/models/src/file-metadata';
import { useState } from 'react';

export default function CreateCourse() {
    const locale = useLocale() as TLocale;

    const {
        courseTitle,
        setCourseTitle,
        courseSlug,
        setCourseSlug,
        courseDescription,
        setCourseDescription,
    } = useCreateCourseForm();

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
                courseTitle={courseTitle}
                setCourseTitle={setCourseTitle}
                courseSlug={courseSlug}
                setCourseSlug={setCourseSlug}
                courseDescription={courseDescription}
                setCourseDescription={setCourseDescription}
                onFileChange={function (
                    file: TFileUploadRequest,
                    abortSignal?: AbortSignal,
                ): Promise<TFileMetadata> {
                    throw new Error('Function not implemented.');
                }}
                onUploadComplete={function (file): void {
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
