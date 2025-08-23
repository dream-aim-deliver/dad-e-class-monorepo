import {
    CourseIntroductionForm,
    DefaultError,
    DefaultLoading,
    IntroductionForm,
} from '@maany_shr/e-class-ui-kit';
import {
    TFileUploadRequest,
    TFileMetadata,
    TFileMetadataImage,
} from 'packages/models/src/file-metadata';
import { useCourseIntroduction } from './hooks/edit-introduction-hooks';
import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

interface EditCourseIntroOutlineProps {
    slug: string;
    courseVersion: number | null;
    setCourseVersion: (version: number | null) => void;
    courseIntroduction: CourseIntroductionForm;
}

export default function EditCourseIntroOutline({
    slug,
    courseVersion,
    setCourseVersion,
    courseIntroduction,
}: EditCourseIntroOutlineProps) {
    const locale = useLocale() as TLocale;

    const introductionViewModel = useCourseIntroduction(slug);

    useEffect(() => {
        if (!introductionViewModel || introductionViewModel.mode !== 'default')
            return;
        courseIntroduction.parseIntroductionText(
            introductionViewModel.data.text,
        );
        setCourseVersion(5);
    }, [introductionViewModel]);

    if (!introductionViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (introductionViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div>
            <IntroductionForm
                courseVersion={courseVersion}
                {...courseIntroduction}
                onFileChange={function (
                    file: TFileUploadRequest,
                    abortSignal?: AbortSignal,
                ): Promise<TFileMetadata> {
                    throw new Error('Function not implemented.');
                }}
                onUploadComplete={function (file: TFileMetadataImage): void {
                    throw new Error('Function not implemented.');
                }}
                onDelete={function (id: string): void {
                    throw new Error('Function not implemented.');
                }}
                onDownload={function (id: string): void {
                    throw new Error('Function not implemented.');
                }}
            />
        </div>
    );
}
