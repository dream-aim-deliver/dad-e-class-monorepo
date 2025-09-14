import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale, useTranslations } from "next-intl";
import { trpc } from "../../../trpc/client";
import { Suspense, useRef, useState } from "react";
import { Button, DefaultLoading, IconCloudDownload, LessonNoteStudentView, LessonNoteView } from "@maany_shr/e-class-ui-kit";
import MockTRPCClientProviders from "../../../trpc/mock-client-providers";
import { viewModels } from "@maany_shr/e-class-models";
import { useListStudentNotesPresenter } from "../../../hooks/use-list-student-notes-presenter";
import html2pdf from "html2pdf.js";

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

    const { presenter } = useListStudentNotesPresenter(setCourseNotesViewModel);

    presenter.present(courseNotesResponse, courseNotesViewModel);

    // Download notes functionality
    const downloadNotesAsPDF = async () => {
        if (!courseNotesViewModel || courseNotesViewModel.mode !== "default" || !notesContainerRef.current) {
            return;
        }
        setIsDownloading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 100)); // wait for rendering

            // Clone the container to avoid affecting main UI
            const original = notesContainerRef.current;
            const clone = original.cloneNode(true) as HTMLElement;

            // Remove buttons from clone (no interactive UI controls in PDF)
            clone.querySelectorAll('button').forEach(btn => btn.remove());

            // Create a wrapper for the clone (for A4 width, padding, background)
            const wrapper = document.createElement('div');
            wrapper.style.width = '794px'; // A4 width in pixels
            wrapper.style.margin = '0 auto';
            wrapper.style.padding = '20px';
            wrapper.style.backgroundColor = '#ffffff';
            wrapper.style.color = '#000000';
            wrapper.style.fontFamily = '"Figtree", sans-serif';

            // Add header in the PDF
            const header = document.createElement('h2');
            header.textContent = t('yourNotes');
            header.style.fontSize = '32px';
            header.style.fontWeight = 'bold';
            header.style.marginBottom = '32px';
            header.style.color = '#000000';
            header.style.fontFamily = 'inherit';

            wrapper.appendChild(header);
            wrapper.appendChild(clone);

            // Optionally fix font sizes/colors for module and lesson titles in clone
            clone.querySelectorAll('.text-xl').forEach(el => {
                (el as HTMLElement).style.fontSize = '20px';
                (el as HTMLElement).style.fontWeight = 'bold';
                (el as HTMLElement).style.color = '#000';
            });
            clone.querySelectorAll('.text-lg').forEach(el => {
                (el as HTMLElement).style.fontSize = '18px';
                (el as HTMLElement).style.fontWeight = 'bold';
                (el as HTMLElement).style.color = '#000';
            });

            // Generate PDF from the wrapper with the cloned content
            const options = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: `course-notes-${courseSlug}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 3,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: '#ffffff',
                    width: 794,
                },
                jsPDF: {
                    unit: 'in',
                    format: 'a4',
                    orientation: 'portrait',
                },
            };

            await html2pdf()
                .set(options)
                .from(wrapper)
                .save();

        } catch (error: any) {
            alert(t('downloadFailed', { error: error?.message || 'Unknown error' }));
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

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-2">
                <h2 className="text-primary text-3xl font-bold">{t('yourNotes')}</h2>
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
                {courseNotesViewModel.data.modules.map((module) => (
                    <LessonNoteStudentView
                        key={`lesson-note-student-view-${module.id}`}
                        id={1}
                        ModuleNumber={module.position}
                        ModuleTitle={module.title}
                        locale={locale}
                    >
                        {module.lessons.map((lesson) => (
                            <LessonNoteView
                                key={`lesson-note-view-${lesson.id}`}
                                lessonNumber={lesson.position}
                                lessonTitle={lesson.title}
                                lessonDescription={lesson.notes}
                                onClickViewLesson={() => alert(`View lesson ${lesson.position} clicked`)}
                                locale={locale}
                                onDeserializationError={(message, error) => console.error(message, error)}
                            />
                        ))}
                    </LessonNoteStudentView>
                ))}
            </div>
        </div>
    )
}

export default function EnrolledCourseNotes(
    props: EnrolledCourseNotesProps,
) {
    const locale = useLocale() as TLocale;

    if(props.currentRole === 'student') {
        return (
            <MockTRPCClientProviders>
                <Suspense
                    fallback={<DefaultLoading locale={locale} variant="minimal" />}
                >
                    <EnrolledCourseNotesContent {...props} />
                </Suspense>
            </MockTRPCClientProviders>
        )
    } else {
        throw new Error('Access denied for current role');
    }
}