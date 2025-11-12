"use client";
import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale, useTranslations } from "next-intl";
import { trpc } from "../../../trpc/cms-client";
import { Suspense, useRef, useState } from "react";
import { Button, CourseNotesAccordion, DefaultLoading, IconCloudDownload, ConfirmationModal } from "@maany_shr/e-class-ui-kit";
import { viewModels } from "@maany_shr/e-class-models";
import { useListStudentNotesPresenter } from "../../../hooks/use-list-student-notes-presenter";
import { generateCourseNotesPdf, type CourseNotesData } from "../../../utils/generate-course-notes-pdf";

interface EnrolledCourseNotesProps {
    courseSlug: string;
    currentRole: string;
}

function EnrolledCourseNotesContent(
    props: EnrolledCourseNotesProps,
) {
    const { courseSlug } = props;
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.course.courseNotes');
    const notesContainerRef = useRef<HTMLDivElement>(null);

    const [courseNotesResponse] = trpc.listStudentNotes.useSuspenseQuery({
        courseSlug,
    });

    const [courseNotesViewModel, setCourseNotesViewModel] = useState<
        viewModels.TStudentNotesViewModel | undefined
    >(undefined);
    const [isDownloading, setIsDownloading] = useState(false);

    // Error modal state
    const [errorModal, setErrorModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
    });

    const { presenter } = useListStudentNotesPresenter(setCourseNotesViewModel);

    //@ts-ignore
    presenter.present(courseNotesResponse, courseNotesViewModel);

    // Download notes functionality using the reusable utility
    const downloadNotesAsPDF = async () => {
        if (!courseNotesViewModel || courseNotesViewModel.mode !== "default") {
            return;
        }
        setIsDownloading(true);

        try {
            await generateCourseNotesPdf({
                courseSlug,
                data: courseNotesViewModel.data as CourseNotesData,
                locale: locale,
                translations: {
                    yourNotes: t('yourNotes'),
                    module: t('module'),
                    lesson: t('lesson'),
                    noNotesAvailable: t('noNotesAvailable'),
                },
            });
        } catch (error: any) {
            setErrorModal({
                isOpen: true,
                title: t('error.title'),
                message: t('downloadFailed', { error: error?.message || 'Unknown error' }),
            });
        } finally {
            setIsDownloading(false);
        }
    };


    if (!courseNotesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (courseNotesViewModel.mode !== "default") {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Check if there are any notes in any lesson
    const hasAnyNotes = courseNotesViewModel.data?.modules?.some(module =>
        module.lessons?.some(lesson => lesson.notes && lesson.notes.trim() !== '')
    ) ?? false;

    // Show empty state if no notes exist
    if (!hasAnyNotes) {
        return (
            <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
                <p className="text-text-primary text-md">
                    {t('noNotesFound')}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-2">
                    <h2>{t('yourNotes')}</h2>
                    <Button
                        variant="secondary"
                        size="medium"
                        text={isDownloading ? t('downloading') : t('downloadNotes')}
                        hasIconLeft
                        iconLeft={<IconCloudDownload />}
                        onClick={downloadNotesAsPDF}
                        disabled={isDownloading}
                    />
                </div>
                <div ref={notesContainerRef} className="flex flex-col gap-6">
                    <CourseNotesAccordion
                        data={courseNotesViewModel.data}
                        onDeserializationError={(message, error) => console.error(message, error)}
                        onClickViewLesson={() => {
                            // No-op: View lesson functionality not implemented in notes view
                        }}
                        locale={locale}
                    />
                </div>
            </div>

            <ConfirmationModal
                type="accept"
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                onConfirm={() => setErrorModal({ ...errorModal, isOpen: false })}
                title={errorModal.title}
                message={errorModal.message}
                confirmText="OK"
                locale={locale}
            />
        </>
    )
}

export default function EnrolledCourseNotes(
    props: EnrolledCourseNotesProps,
) {
    const locale = useLocale() as TLocale;

    if (props.currentRole === 'student') {
        return (
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <EnrolledCourseNotesContent {...props} />
            </Suspense>
        )
    } else {
        throw new Error('Access denied for current role');
    }
}