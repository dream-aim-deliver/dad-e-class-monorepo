import {
    AccordionBuilder,
    AccordionBuilderItem,
    CourseIntroductionForm,
    DefaultError,
    DefaultLoading,
    IntroductionForm,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import { useCourseIntroduction } from './hooks/edit-introduction-hooks';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { IntroductionVideoUploadState } from './hooks/use-introduction-video-upload';
import {
    TFileUploadRequest,
    TFileMetadataImage,
} from 'packages/models/src/file-metadata';
import {
    AccordionIconUploadState,
    useAccordionIconUpload,
} from './hooks/use-accordion-icon-upload';

interface EditCourseIntroOutlineProps {
    slug: string;
    courseVersion: number | null;
    setCourseVersion: (version: number | null) => void;
    courseIntroduction: CourseIntroductionForm;
    introductionVideoUpload: IntroductionVideoUploadState;
    setIsEdited: (isEdited: boolean) => void;
    outlineItems: AccordionBuilderItem[];
    setOutlineItems: React.Dispatch<
        React.SetStateAction<AccordionBuilderItem[]>
    >;
    accordionIconUpload: AccordionIconUploadState;
}

export default function EditCourseIntroOutline({
    slug,
    courseVersion,
    setCourseVersion,
    courseIntroduction,
    introductionVideoUpload,
    setIsEdited,
    outlineItems,
    setOutlineItems,
    accordionIconUpload,
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
        setIsEdited(false);
        setCourseVersion(introductionViewModel.data.courseVersion);
    }, [introductionViewModel]);

    if (!introductionViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (introductionViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="flex flex-col gap-8">
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
            <SectionHeading text="Outline" />
            <AccordionBuilder
                items={outlineItems}
                setItems={setOutlineItems}
                onIconChange={accordionIconUpload.handleFileChange}
                onIconDownload={(index) => {
                    const item = outlineItems[index];
                    if (!item.icon) return;
                    accordionIconUpload.handleDownload(item.icon);
                }}
                locale={locale}
            />
        </div>
    );
}
