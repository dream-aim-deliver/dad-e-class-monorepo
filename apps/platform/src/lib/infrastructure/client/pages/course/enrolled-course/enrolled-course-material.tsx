'use client';

import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    DefaultError,
    DefaultLoading,
    CourseMaterialsAccordion,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { Suspense, useState } from 'react';
import { useListCourseMaterialsPresenter } from '../../../hooks/use-list-course-materials-presenter';
import { trpc } from '../../../trpc/client';
import MockTRPCClientProviders from '../../../trpc/mock-client-providers';

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
    
    if (currentRole !== 'student') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="flex flex-col space-y-6">

            {courseMaterialsViewModel.data.moduleCount === 0 ? (
                <div className="p-6 border border-gray-200 rounded-lg text-center">
                    <p className="text-gray-600">No materials available yet.</p>
                </div>
            ) : (
                <CourseMaterialsAccordion courseMaterials={courseMaterialsViewModel.data} />
            )}
        </div>
    );
}

export default function EnrolledCourseMaterial(props: EnrolledCourseMaterialProps) {
    const locale = useLocale() as TLocale;

    return (
        <MockTRPCClientProviders>
        <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
            <EnrolledCourseMaterialContent {...props} />
        </Suspense>
        </MockTRPCClientProviders>
    );
}
