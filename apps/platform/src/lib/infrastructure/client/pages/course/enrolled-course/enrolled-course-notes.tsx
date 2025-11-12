"use client";
import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale, useTranslations } from "next-intl";
import { trpc } from "../../../trpc/cms-client";
import { Suspense, useRef, useState } from "react";
import { Button, CourseNotesAccordion, DefaultLoading, IconCloudDownload } from "@maany_shr/e-class-ui-kit";
import { viewModels } from "@maany_shr/e-class-models";
import { useListStudentNotesPresenter } from "../../../hooks/use-list-student-notes-presenter";

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

    //@ts-ignore
    presenter.present(courseNotesResponse, courseNotesViewModel);

    // TODO: Style PDF
    // Download notes functionality
    const downloadNotesAsPDF = async () => {
        if (!courseNotesViewModel || courseNotesViewModel.mode !== "default" || !notesContainerRef.current) {
            return;
        }
        setIsDownloading(true);

        try {
            // Dynamically import html2pdf only when needed (client-side only)
            const html2pdf = (await import("html2pdf.js")).default;

            await new Promise(resolve => setTimeout(resolve, 100)); // wait for rendering

            // We'll build the content directly from the view model data

            // Create a wrapper for the clone with proper PDF styling
            const wrapper = document.createElement('div');
            wrapper.style.width = '794px'; // A4 width in pixels
            wrapper.style.margin = '0 auto';
            wrapper.style.padding = '20px 30px'; // Reduced padding
            wrapper.style.backgroundColor = '#ffffff';
            wrapper.style.color = '#000000';
            wrapper.style.fontFamily = '"Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            wrapper.style.lineHeight = '1.6';

            // Add header in the PDF
            const header = document.createElement('h1');
            header.textContent = t('yourNotes');
            header.style.fontSize = '24px'; // Smaller font
            header.style.fontWeight = '700';
            header.style.marginTop = '0'; // Remove top margin
            header.style.marginBottom = '20px'; // Reduced bottom margin
            header.style.color = '#000000';
            header.style.borderBottom = '2px solid #f59f0b5d';
            header.style.paddingBottom = '12px'; // Reduced padding

            wrapper.appendChild(header);

            // COMPLETELY RESTRUCTURE THE CONTENT FOR PDF
            // Access the data directly from the view model instead of trying to parse DOM
            const modulesContainer = document.createElement('div');

            // Debug: Let's see what data we have
            console.log('CourseNotesViewModel data:', courseNotesViewModel.data);

            if (courseNotesViewModel.mode === 'default' && courseNotesViewModel.data.modules) {
                courseNotesViewModel.data.modules.forEach((module) => {
                    console.log('Processing module:', module.title, 'with', module.lessons?.length, 'lessons');
                    const moduleDiv = document.createElement('div');
                    moduleDiv.style.marginBottom = '4px';
                    moduleDiv.style.marginTop = '0'; // Ensure no top margin

                    // Module title
                    const titleDiv = document.createElement('h2');
                    titleDiv.textContent = `Module ${module.position} - ${module.title}`;
                    titleDiv.style.fontSize = '20px'; // Slightly smaller
                    titleDiv.style.fontWeight = '600';
                    titleDiv.style.color = '#000000';
                    titleDiv.style.marginTop = '0';
                    titleDiv.style.marginBottom = '0';
                    titleDiv.style.borderLeft = '4px solid #f59f0bb4';
                    titleDiv.style.paddingLeft = '16px';
                    moduleDiv.appendChild(titleDiv);

                    // Process lessons
                    if (module.lessons) {
                        module.lessons.forEach((lesson, lessonIndex) => {
                            console.log('Processing lesson:', lesson.title, 'Notes available:', !!lesson.notes, typeof lesson.notes);

                            const lessonDiv = document.createElement('div');
                            // Check if this is the last lesson in the module
                            const isLastLesson = lessonIndex === (module.lessons?.length ?? 0) - 1;
                            lessonDiv.style.marginBottom = isLastLesson ? '0px' : '4px'; // No margin for last lesson
                            lessonDiv.style.marginTop = '0'; // Ensure no top margin
                            lessonDiv.style.marginLeft = '16px'; // Slightly reduced indentation

                            // Lesson title
                            const lessonTitleDiv = document.createElement('h3');
                            const lessonNumber = courseNotesViewModel.data.modules
                                .slice(0, courseNotesViewModel.data.modules.indexOf(module))
                                .reduce((sum, mod) => sum + (mod.lessonCount ?? 0), 0) + (lesson.position ?? lessonIndex + 1);
                            lessonTitleDiv.textContent = `Lesson ${lessonNumber} - ${lesson.title}`;
                            lessonTitleDiv.style.fontSize = '16px'; // Smaller font
                            lessonTitleDiv.style.fontWeight = '600';
                            lessonTitleDiv.style.color = '#000000';
                            lessonTitleDiv.style.marginTop = '0';
                            lessonTitleDiv.style.marginBottom = '8px'; 
                            lessonDiv.appendChild(lessonTitleDiv);

                            // Lesson content/notes - Try both view model and DOM
                            if (lesson.notes) {
                                console.log('Found notes in view model for lesson:', lesson.title);
                                const contentDiv = document.createElement('div');
                                contentDiv.style.fontSize = '14px';
                                contentDiv.style.color = '#000000';
                                contentDiv.style.lineHeight = '1.6';
                                contentDiv.style.marginLeft = '20px'; // Indented from lesson title
                                contentDiv.style.marginTop = '4px'; // Small gap from lesson title
                                contentDiv.style.marginBottom = '0';
                                contentDiv.style.paddingTop = '8px'; // Top padding for separation
                                contentDiv.style.borderTop = '1px solid #f59f0b5d'; // Subtle top border
                                contentDiv.style.paddingLeft = '0'; // No left padding needed

                                // If notes is a string, parse it, otherwise use it directly
                                if (typeof lesson.notes === 'string') {
                                    try {
                                        const parsedNotes = JSON.parse(lesson.notes);
                                        // Render the rich text content with full formatting support
                                        if (Array.isArray(parsedNotes)) {
                                            parsedNotes.forEach((node: any) => {
                                                if (node.type === 'paragraph' && node.children) {
                                                    const p = document.createElement('p');
                                                    p.style.margin = '0';
                                                    p.style.padding = '0';
                                                    p.style.color = 'black';

                                                    node.children.forEach((child: any) => {
                                                        if (child.text) {
                                                            const span = document.createElement('span');
                                                            span.textContent = child.text;
                                                            if (child.bold) span.style.fontWeight = '700';
                                                            if (child.italic) span.style.fontStyle = 'italic';
                                                            if (child.underline) span.style.textDecoration = 'underline';
                                                            if (child.code) {
                                                                span.style.fontFamily = 'monospace';
                                                                span.style.backgroundColor = '#f1f5f9';
                                                                span.style.padding = '2px 4px';
                                                                span.style.borderRadius = '2px';
                                                            }
                                                            p.appendChild(span);
                                                        }
                                                    });
                                                    contentDiv.appendChild(p);
                                                } else if (node.type === 'bulleted-list' || node.type === 'unordered-list') {
                                                    const ul = document.createElement('ul');
                                                    ul.style.listStyleType = 'disc';
                                                    ul.style.paddingLeft = '16px';
                                                    ul.style.margin = '0';
                                                    ul.style.color = 'black';

                                                    if (node.children) {
                                                        node.children.forEach((listItem: any) => {
                                                            if (listItem.type === 'list-item') {
                                                                const li = document.createElement('li');
                                                                li.style.margin = '0';
                                                                li.style.padding = '0';
                                                                li.style.color = 'black';

                                                                if (listItem.children) {
                                                                    listItem.children.forEach((child: any) => {
                                                                        if (child.text) {
                                                                            const span = document.createElement('span');
                                                                            span.textContent = child.text;
                                                                            if (child.bold) span.style.fontWeight = '700';
                                                                            if (child.italic) span.style.fontStyle = 'italic';
                                                                            li.appendChild(span);
                                                                        }
                                                                    });
                                                                }
                                                                ul.appendChild(li);
                                                            }
                                                        });
                                                    }
                                                    contentDiv.appendChild(ul);
                                                } else if (node.type === 'numbered-list') {
                                                    const ol = document.createElement('ol');
                                                    ol.style.listStyleType = 'decimal';
                                                    ol.style.paddingLeft = '16px';
                                                    ol.style.margin = '0';
                                                    ol.style.color = 'black';

                                                    if (node.children) {
                                                        node.children.forEach((listItem: any) => {
                                                            if (listItem.type === 'list-item') {
                                                                const li = document.createElement('li');
                                                                li.style.margin = '0';
                                                                li.style.padding = '0';
                                                                li.style.color = 'black';

                                                                if (listItem.children) {
                                                                    listItem.children.forEach((child: any) => {
                                                                        if (child.text) {
                                                                            const span = document.createElement('span');
                                                                            span.textContent = child.text;
                                                                            if (child.bold) span.style.fontWeight = '700';
                                                                            if (child.italic) span.style.fontStyle = 'italic';
                                                                            li.appendChild(span);
                                                                        }
                                                                    });
                                                                }
                                                                ol.appendChild(li);
                                                            }
                                                        });
                                                    }
                                                    contentDiv.appendChild(ol);
                                                } else if (node.type === 'link') {
                                                    const a = document.createElement('a');
                                                    a.href = node.url || '#';
                                                    a.textContent = node.children?.[0]?.text || node.url;
                                                    a.style.color = '#3b82f6';
                                                    a.style.textDecoration = 'underline';
                                                    contentDiv.appendChild(a);
                                                } else if (node.type === 'block-quote') {
                                                    const blockquote = document.createElement('blockquote');
                                                    blockquote.style.borderLeft = '3px solid #e2e8f0';
                                                    blockquote.style.paddingLeft = '12px';
                                                    blockquote.style.fontStyle = 'italic';
                                                    blockquote.style.margin = '0';
                                                    blockquote.style.color = 'black';

                                                    if (node.children) {
                                                        node.children.forEach((child: any) => {
                                                            if (child.text) {
                                                                blockquote.textContent += child.text;
                                                            }
                                                        });
                                                    }
                                                    contentDiv.appendChild(blockquote);
                                                } else if (node.type?.startsWith('h')) {
                                                    // Handle headings (h1, h2, h3, etc.)
                                                    const heading = document.createElement(node.type);
                                                    heading.style.fontWeight = '600';
                                                    heading.style.margin = '0';
                                                    heading.style.color = 'black';

                                                    if (node.children) {
                                                        node.children.forEach((child: any) => {
                                                            if (child.text) {
                                                                heading.textContent += child.text;
                                                            }
                                                        });
                                                    }
                                                    contentDiv.appendChild(heading);
                                                }
                                            });
                                        } else {
                                            contentDiv.textContent = lesson.notes;
                                        }
                                    } catch {
                                        // If parsing fails, just show as plain text
                                        contentDiv.textContent = lesson.notes;
                                    }
                                } else {
                                    contentDiv.textContent = 'No notes available';
                                }

                                lessonDiv.appendChild(contentDiv);
                            } else {
                                // Try to get notes from DOM as fallback
                                console.log('No notes in view model, trying to extract from DOM for lesson:', lesson.title);

                                // Try to find this lesson in the actual DOM
                                const original = notesContainerRef.current;
                                if (original) {
                                    // Look for lesson content in the accordion structure
                                    const lessonElements = original.querySelectorAll('h5');
                                    let foundContentElement: HTMLElement | null = null;

                                    lessonElements.forEach(h5Element => {
                                        if (h5Element.textContent?.includes(lesson.title || '')) {
                                            // Find the content area for this lesson
                                            const accordionItem = h5Element.closest('[role="region"]') ||
                                                                h5Element.closest('[data-radix-collapsible-content]') ||
                                                                h5Element.closest('div');

                                            if (accordionItem) {
                                                const contentArea = accordionItem.querySelector('[class*="text-text-secondary"]') ||
                                                                  accordionItem.querySelector('div:last-child');
                                                if (contentArea && contentArea.textContent?.trim()) {
                                                    const clonedElement = contentArea.cloneNode(true);
                                                    if (clonedElement instanceof HTMLElement) {
                                                        foundContentElement = clonedElement;
                                                    }
                                                }
                                            }
                                        }
                                    });

                                    if (foundContentElement) {
                                        console.log('Found content in DOM for lesson:', lesson.title);
                                        const contentDiv = document.createElement('div');
                                        const htmlElement = foundContentElement as HTMLElement;

                                        // Copy the content with all formatting preserved
                                        contentDiv.innerHTML = htmlElement.innerHTML;

                                        contentDiv.style.fontSize = '14px';
                                        contentDiv.style.color = '#000000';
                                        contentDiv.style.lineHeight = '1.6';
                                        contentDiv.style.marginLeft = '20px'; // Indented from lesson title
                                        contentDiv.style.marginTop = '4px'; // Small gap from lesson title
                                        contentDiv.style.marginBottom = '0';
                                        contentDiv.style.paddingTop = '8px'; // Top padding for separation
                                        contentDiv.style.borderTop = '1px solid #e5e5e5'; // Subtle top border
                                        contentDiv.style.paddingLeft = '0'; // No left padding needed

                                        // Clean up any remaining interactive elements but preserve formatting
                                        contentDiv.querySelectorAll('button').forEach(btn => btn.remove());
                                        contentDiv.querySelectorAll('svg').forEach(svg => svg.remove());

                                        // Ensure rich text formatting is preserved for PDF
                                        contentDiv.querySelectorAll('p').forEach(p => {
                                            (p as HTMLElement).style.margin = '0';
                                            (p as HTMLElement).style.padding = '0';
                                            (p as HTMLElement).style.color = 'black';
                                        });
                                        contentDiv.querySelectorAll('strong, b').forEach(strong => {
                                            (strong as HTMLElement).style.fontWeight = '700';
                                            (strong as HTMLElement).style.color = 'black';
                                        });
                                        contentDiv.querySelectorAll('em, i').forEach(em => {
                                            (em as HTMLElement).style.fontStyle = 'italic';
                                            (em as HTMLElement).style.color = 'black';
                                        });
                                        contentDiv.querySelectorAll('u').forEach(u => {
                                            (u as HTMLElement).style.textDecoration = 'underline';
                                            (u as HTMLElement).style.color = 'black';
                                        });
                                        contentDiv.querySelectorAll('ul').forEach(ul => {
                                            (ul as HTMLElement).style.listStyleType = 'disc';
                                            (ul as HTMLElement).style.paddingLeft = '16px';
                                            (ul as HTMLElement).style.margin = '0';
                                            (ul as HTMLElement).style.color = 'black';
                                        });
                                        contentDiv.querySelectorAll('ol').forEach(ol => {
                                            (ol as HTMLElement).style.listStyleType = 'decimal';
                                            (ol as HTMLElement).style.paddingLeft = '16px';
                                            (ol as HTMLElement).style.margin = '0';
                                            (ol as HTMLElement).style.color = 'black';
                                        });
                                        contentDiv.querySelectorAll('li').forEach(li => {
                                            (li as HTMLElement).style.margin = '0';
                                            (li as HTMLElement).style.padding = '0';
                                            (li as HTMLElement).style.color = 'black';
                                        });
                                        contentDiv.querySelectorAll('a').forEach(link => {
                                            (link as HTMLElement).style.color = '#3b82f6';
                                            (link as HTMLElement).style.textDecoration = 'underline';
                                        });
                                        contentDiv.querySelectorAll('blockquote').forEach(bq => {
                                            (bq as HTMLElement).style.borderLeft = '3px solid #e2e8f0';
                                            (bq as HTMLElement).style.paddingLeft = '12px';
                                            (bq as HTMLElement).style.fontStyle = 'italic';
                                            (bq as HTMLElement).style.margin = '0';
                                            (bq as HTMLElement).style.color = 'black';
                                        });

                                        lessonDiv.appendChild(contentDiv);
                                    } else {
                                        // Still no content found
                                        const noNotesDiv = document.createElement('div');
                                        noNotesDiv.textContent = 'No notes available for this lesson';
                                        noNotesDiv.style.fontSize = '14px';
                                        noNotesDiv.style.color = '#000000';
                                        noNotesDiv.style.fontStyle = 'italic';
                                        noNotesDiv.style.marginLeft = '16px';
                                        lessonDiv.appendChild(noNotesDiv);
                                    }
                                }
                            }

                            moduleDiv.appendChild(lessonDiv);
                        });
                    }

                    modulesContainer.appendChild(moduleDiv);
                });
            }

            wrapper.appendChild(modulesContainer);

            // Generate PDF from the wrapper with the cloned content
            const imageType: "jpeg" | "png" | "webp" | undefined = "jpeg";
            const margin: [number, number, number, number] = [0.5, 0.5, 0.5, 0.5];
            const orientation: "portrait" | "landscape" | undefined = "portrait";

            const options = {
                margin: margin,
                filename: `course-notes-${courseSlug}.pdf`,
                image: { type: imageType, quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: '#ffffff',
                    width: 794,
                },
                jsPDF: {
                    unit: 'in',
                    format: 'a4',
                    orientation: orientation,
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

    // Check if there are any notes in any lesson
    const hasAnyNotes = courseNotesViewModel.data.modules.some(module =>
        module.lessons?.some(lesson => lesson.notes && lesson.notes.trim() !== '')
    );

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