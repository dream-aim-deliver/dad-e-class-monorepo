'use client';

import {
    AccordionBuilder,
    AccordionBuilderItem,
    CourseIntroductionForm,
    CourseIntroBanner,
    DefaultAccordion,
    DefaultError,
    DefaultLoading,
    IntroductionForm,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import { useCourseIntroduction } from './hooks/edit-introduction-hooks';
import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { IntroductionVideoUploadState } from './hooks/use-introduction-video-upload';
import { AccordionIconUploadState } from './hooks/use-accordion-icon-upload';
import { useCourseOutline } from './hooks/edit-outline-hooks';
import { fileMetadata } from '@maany_shr/e-class-models';

interface EditCourseIntroOutlineProps {
    slug: string;
    courseVersion: number | null;
    setCourseVersion: (version: number | null) => void;
    courseIntroduction: CourseIntroductionForm;
    introductionVideoUpload: IntroductionVideoUploadState;
    introductionUploadProgress?: number;
    setIsEdited: (isEdited: boolean) => void;
    outlineItems: AccordionBuilderItem[];
    setOutlineItems: React.Dispatch<
        React.SetStateAction<AccordionBuilderItem[]>
    >;
    accordionIconUpload: AccordionIconUploadState;
    accordionUploadProgress?: number;
}

export function CourseIntroOutlinePreview({ slug }: { slug: string }) {
    const locale = useLocale() as TLocale;
    const editCourseIntroOutlineT = useTranslations('pages.editCourseIntroOutline');
    const introductionViewModel = useCourseIntroduction(slug);
    const outlineViewModel = useCourseOutline(slug);

    if (!introductionViewModel || !outlineViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (introductionViewModel.mode !== 'default' || outlineViewModel.mode !== 'default') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={editCourseIntroOutlineT('error.title')}
                description={editCourseIntroOutlineT('error.description')}
            />
        );
    }

    const introduction = introductionViewModel.data;
    const outline = outlineViewModel.data;

    return (
        <div className="flex flex-col gap-8">
            {/* Introduction Section */}
            <div className="flex flex-col space-y-6">
                <SectionHeading text="Introduction" />
                <CourseIntroBanner
                    description={introduction.text}
                    videoId={introduction.video?.playbackId ?? ''}
                    locale={locale}
                    onErrorCallback={() => {
                        // TODO: Handle error callback for CourseIntroBanner
                    }}
                    thumbnailUrl={introduction.video?.thumbnailUrl || undefined}
                />
            </div>

            {/* Outline Section */}
            <div className="flex flex-col space-y-6">
                <h2>Course Content</h2>
                {(outline.items ?? []).length > 0 ? (
                    <DefaultAccordion
                        className="px-6 py-4 bg-card-fill border border-card-stroke rounded-md"
                        showNumbers={true}
                        items={(outline.items ?? []).map((item) => ({
                            title: item.title,
                            content: item.description,
                            position: item.position,
                            iconImageUrl: item.icon?.downloadUrl,
                        }))}
                    />
                ) : (
                    <DefaultError
                        type="simple"
                        locale={locale}
                        title={editCourseIntroOutlineT('noOutline.title')}
                        description={editCourseIntroOutlineT('noOutline.description')}
                    />
                )}
            </div>
        </div>
    );
}

export default function EditCourseIntroOutline({
    slug,
    courseVersion,
    setCourseVersion,
    courseIntroduction,
    introductionVideoUpload,
    introductionUploadProgress,
    setIsEdited,
    outlineItems,
    setOutlineItems,
    accordionIconUpload,
    accordionUploadProgress,
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
        console.log('[EditCourseIntroOutline] useEffect triggered, outlineViewModel:', outlineViewModel);
        if (!outlineViewModel || outlineViewModel.mode !== 'default') return;

        const mappedItems = (outlineViewModel.data.items ?? []).map((item) => ({
            title: item.title,
            content: item.description,
            icon: item.icon
                ? {
                      ...item.icon,
                      status: 'available' as const,
                      url: item.icon.downloadUrl,
                      thumbnailUrl: item.icon.downloadUrl,
                  }
                : null,
        }));

        console.log('[EditCourseIntroOutline] Setting outline items to:', mappedItems);
        setOutlineItems(mappedItems);
        setIsEdited(false);
    }, [outlineViewModel]);

    if (!introductionViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (introductionViewModel.mode !== 'default') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={editCourseIntroOutlineTranslations('error.title')}
                description={editCourseIntroOutlineTranslations('error.description')}
            />
        );
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
                uploadProgress={introductionUploadProgress}
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
                    uploadProgress={accordionUploadProgress}
                    locale={locale}
                />
            </div>
        </div>
    );
}
