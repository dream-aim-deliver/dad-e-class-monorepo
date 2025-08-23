import {
    CourseIntroductionForm,
    DefaultError,
    DefaultLoading,
    IntroductionForm,
} from '@maany_shr/e-class-ui-kit';
import { useCourseIntroduction } from './hooks/edit-introduction-hooks';
import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { IntroductionVideoUploadState } from './hooks/use-introduction-video-upload';

interface EditCourseIntroOutlineProps {
    slug: string;
    courseVersion: number | null;
    setCourseVersion: (version: number | null) => void;
    courseIntroduction: CourseIntroductionForm;
    introductionVideoUpload: IntroductionVideoUploadState;
}

export default function EditCourseIntroOutline({
    slug,
    courseVersion,
    setCourseVersion,
    courseIntroduction,
    introductionVideoUpload,
}: EditCourseIntroOutlineProps) {
    const locale = useLocale() as TLocale;

    const introductionViewModel = useCourseIntroduction(slug);

    useEffect(() => {
        if (!introductionViewModel || introductionViewModel.mode !== 'default')
            return;
        courseIntroduction.parseIntroductionText(
            introductionViewModel.data.text,
        );
        const video = introductionViewModel.data.video;
        if (video) {
            introductionVideoUpload.handleUploadComplete({
                ...video,
                status: 'available',
                url: video.downloadUrl,
                thumbnailUrl: video.thumbnailUrl,
                videoId: video.playbackId,
            });
        }
        setCourseVersion(introductionViewModel.data.courseVersion);
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
                locale={locale}
                courseVersion={courseVersion}
                {...courseIntroduction}
                onFileChange={introductionVideoUpload.handleFileChange}
                onUploadComplete={introductionVideoUpload.handleUploadComplete}
                onDelete={introductionVideoUpload.handleDelete}
                onDownload={introductionVideoUpload.handleDownload}
                videoFile={introductionVideoUpload.video}
                uploadError={introductionVideoUpload.uploadError}
            />
        </div>
    );
}
