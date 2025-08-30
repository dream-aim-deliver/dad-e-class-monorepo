'use client';

import {
    AccordionBuilder,
    AccordionBuilderItem,
    CourseIntroductionForm,
    DefaultError,
    DefaultLoading,
    IntroductionForm,
} from '@maany_shr/e-class-ui-kit';
import { useCourseIntroduction } from './hooks/edit-introduction-hooks';
import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { IntroductionVideoUploadState } from './hooks/use-introduction-video-upload';
import { AccordionIconUploadState } from './hooks/use-accordion-icon-upload';
import CourseIntroduction from '../../common/course-introduction';
import CourseOutline from '../../common/course-outline';
import { useCourseOutline } from './hooks/edit-outline-hooks';
import { fileMetadata } from '@maany_shr/e-class-models';

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

export function CourseIntroOutlinePreview({ slug }: { slug: string }) {
    return (
        <div>
            <CourseIntroduction courseSlug={slug} />
            <CourseOutline courseSlug={slug} />
        </div>
    );
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
    const editCourseIntroOutlineTranslations = useTranslations(
        'pages.editCourseIntroOutline',
    );

    const introductionViewModel = useCourseIntroduction(slug);
    const outlineViewModel = useCourseOutline(slug);

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

    useEffect(() => {
        if (!outlineViewModel || outlineViewModel.mode !== 'default') return;
        setOutlineItems(
            outlineViewModel.data.items.map((item) => ({
                title: item.title,
                content: item.description,
                icon: item.icon
                    ? {
                          ...item.icon,
                          status: 'available',
                          url: item.icon.downloadUrl,
                          thumbnailUrl: item.icon.downloadUrl,
                      }
                    : null,
            })),
        );
    }, [outlineViewModel]);

    if (!introductionViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
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
                onUploadComplete={(file) =>
                    introductionVideoUpload.handleUploadComplete(
                        file as fileMetadata.TFileMetadataVideo,
                    )
                }
                onDelete={introductionVideoUpload.handleDelete}
                onDownload={introductionVideoUpload.handleDownload}
                videoFile={introductionVideoUpload.video}
                uploadError={introductionVideoUpload.uploadError}
            />
            <div className="flex flex-col gap-4">
                <h2>{editCourseIntroOutlineTranslations('outlineText')}</h2>
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
        </div>
    );
}
