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
import { useAccordionIconUpload } from './hooks/use-accordion-icon-upload';

interface EditCourseIntroOutlineProps {
    slug: string;
    courseVersion: number | null;
    setCourseVersion: (version: number | null) => void;
    courseIntroduction: CourseIntroductionForm;
    introductionVideoUpload: IntroductionVideoUploadState;
    setIsEdited: (isEdited: boolean) => void;
}

export default function EditCourseIntroOutline({
    slug,
    courseVersion,
    setCourseVersion,
    courseIntroduction,
    introductionVideoUpload,
    setIsEdited,
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

    const [accordionBuilderItems, setAccordionBuilderItems] = useState<
        AccordionBuilderItem[]
    >([]);
    const accordionIconUpload = useAccordionIconUpload(slug);

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
                items={accordionBuilderItems}
                setItems={setAccordionBuilderItems}
                onIconChange={accordionIconUpload.handleFileChange}
                onUploadComplete={(icon, index) => {
                    setAccordionBuilderItems((prevItems) => {
                        const newItems = [...prevItems];
                        newItems[index] = {
                            ...newItems[index],
                            icon,
                        };
                        return newItems;
                    });
                }}
                onIconDelete={(index) => {
                    setAccordionBuilderItems((prevItems) => {
                        const newItems = [...prevItems];
                        newItems[index] = {
                            ...newItems[index],
                            icon: null,
                        };
                        return newItems;
                    });
                }}
                onIconDownload={(index) => {
                    const item = accordionBuilderItems[index];
                    if (item.icon) {
                        // Trigger download for the icon
                    }
                }}
                locale={'en'}
            />
        </div>
    );
}
