'use client';

import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    DefaultError,
    DefaultLoading,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { Suspense, useState } from 'react';
import { useListCourseMaterialsPresenter } from '../../../hooks/use-list-course-materials-presenter';
import { trpc } from '../../../trpc/client';

interface EnrolledCourseMaterialProps {
    currentRole: string;
    courseSlug: string;
}

function EnrolledCourseMaterialContent(props: EnrolledCourseMaterialProps) {
    const { courseSlug, currentRole } = props;
    const locale = useLocale() as TLocale;

    // Fetch course materials using TRPC
    const [courseMaterialsResponse] = trpc.listCourseMaterials.useSuspenseQuery({
        courseSlug: courseSlug,
    });

    // Set up presenter
    const [courseMaterialsViewModel, setCourseMaterialsViewModel] = useState<
        viewModels.TCourseMaterialsListViewModel | undefined
    >(undefined);

    const { presenter } = useListCourseMaterialsPresenter(setCourseMaterialsViewModel);

    // Present the data
    presenter.present(courseMaterialsResponse, courseMaterialsViewModel);

    if (!courseMaterialsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Handle different view model modes
    if (courseMaterialsViewModel.mode === 'kaboom' || courseMaterialsViewModel.mode === 'not-found') {
        return <DefaultError locale={locale} />;
    }

    // For default mode, we have the success data
    const { modules, moduleCount } = courseMaterialsViewModel.data;

    if (currentRole !== 'student') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold">Course Materials</h2>

            {moduleCount === 0 ? (
                <div className="p-6 border border-gray-200 rounded-lg text-center">
                    <p className="text-gray-600">No materials available yet.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {modules.map((module) => (
                        <div key={module.id} className="border border-gray-200 rounded-lg p-6">
                            <h3 className="text-xl font-medium mb-4">{module.title}</h3>

                            <div className="space-y-6">
                                {module.lessons.map((lesson) => (
                                    <div key={lesson.id} className="border-l-4 border-blue-500 pl-4">
                                        <h4 className="text-lg font-medium mb-3">{lesson.title}</h4>

                                        <div className="space-y-4">
                                            {lesson.materials.map((material) => (
                                                <div key={material.id} className="bg-gray-50 p-4 rounded-lg">
                                                    {material.type === 'richText' && (
                                                        <>
                                                            <h5 className="font-medium mb-2">Rich Text Content</h5>
                                                            <div
                                                                className="prose prose-sm max-w-none"
                                                                dangerouslySetInnerHTML={{ __html: material.text }}
                                                            />
                                                        </>
                                                    )}

                                                    {material.type === 'links' && (
                                                        <>
                                                            <h5 className="font-medium mb-2">Useful Links</h5>
                                                            <div className="space-y-2">
                                                                {material.links.map((link, index) => (
                                                                    <a
                                                                        key={index}
                                                                        href={link.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="block p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <div className="font-medium text-blue-600">{link.title}</div>
                                                                        <div className="text-sm text-gray-500">{link.url}</div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}

                                                    {material.type === 'downloadFiles' && (
                                                        <>
                                                            <h5 className="font-medium mb-2">Download Files</h5>
                                                            <div className="space-y-2">
                                                                {material.files.map((file) => (
                                                                    <a
                                                                        key={file.id}
                                                                        href={file.downloadUrl}
                                                                        download
                                                                        className="flex items-center justify-between p-3 bg-white rounded border hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <div>
                                                                            <div className="font-medium">{file.name}</div>
                                                                            <div className="text-sm text-gray-500">
                                                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-blue-600">Download</div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function EnrolledCourseMaterial(props: EnrolledCourseMaterialProps) {
    const locale = useLocale() as TLocale;

    return (
        <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
            <EnrolledCourseMaterialContent {...props} />
        </Suspense>
    );
}