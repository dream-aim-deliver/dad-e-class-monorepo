'use client';

import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    DefaultError,
    DefaultLoading,
    CourseMaterialsAccordion,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useListCourseMaterialsPresenter } from '../../../hooks/use-list-course-materials-presenter';
import { trpc } from '../../../trpc/cms-client';
import { usePlatform } from '../../../context/platform-context';
interface EnrolledCourseMaterialProps {
    currentRole: string;
    courseSlug: string;
}

function EnrolledCourseMaterialContent(props: EnrolledCourseMaterialProps) {
    const { courseSlug, currentRole } = props;
    const locale = useLocale() as TLocale;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const lessonMaterialId = searchParams.get('lesson-material') ?? undefined;
    const [copiedLessonId, setCopiedLessonId] = useState<string | null>(null);
    const scrollRef = useRef<boolean>(false);

    // Scroll to the target lesson on deep-link
    useEffect(() => {
        if (lessonMaterialId && !scrollRef.current) {
            scrollRef.current = true;
            const timer = setTimeout(() => {
                const element = document.getElementById(`lesson-material-${lessonMaterialId}`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [lessonMaterialId]);

    const handleCopyLessonLink = useCallback((lessonId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', 'material');
        params.set('lesson-material', lessonId);
        const link = `${window.location.origin}${pathname}?${params.toString()}`;
        navigator.clipboard.writeText(link);
        setCopiedLessonId(lessonId);
        setTimeout(() => setCopiedLessonId(null), 2000);
    }, [searchParams, pathname]);
    const t = useTranslations('pages.enrolledCourse');
    const courseTranslations = useTranslations('pages.course');
    const platformContext = usePlatform();
    const supportEmail = platformContext?.platform.supportEmailAddress;

    const [courseMaterialsResponse] = trpc.listCourseMaterials.useSuspenseQuery(
        {
            courseSlug: courseSlug,
        },
    );

    // Set up presenter
    const [courseMaterialsViewModel, setCourseMaterialsViewModel] = useState<
        viewModels.TCourseMaterialsListViewModel | undefined
    >(undefined);

    const { presenter } = useListCourseMaterialsPresenter(
        setCourseMaterialsViewModel,
    );
    
    //@ts-ignore
    presenter.present(courseMaterialsResponse,
        courseMaterialsViewModel,
    );

    if (!courseMaterialsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Handle different view model modes explicitly using discriminated union
    if (courseMaterialsViewModel.mode === 'kaboom') {
        if (supportEmail && supportEmail.trim() !== '') {
            return (
                <DefaultError
                    type="withSupportEmail"
                    locale={locale}
                    title={t('error.title')}
                    description={t('error.description')}
                    supportEmailAddress={supportEmail}
                />
            );
        } else {
            return (
                <DefaultError
                    type="simple"
                    locale={locale}
                    title={t('error.title')}
                    description={t('error.description')}
                />
            );
        }
    }

    if (courseMaterialsViewModel.mode === 'not-found') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.notFound.title')}
                description={t('error.notFound.description')}
            />
        );
    }

    // At this point the view model must be the success/default variant.
    if (props.currentRole === 'visitor')
        throw new Error(courseTranslations('completedPanel.accessDeniedError'));

    const successData = courseMaterialsViewModel.data; // typed as TCourseMaterialsListSuccess

    // Check if there are any lessons with materials across all modules
    const hasAnyMaterials = successData.modules?.some(module =>
        module.lessons?.some(lesson =>
            lesson.materials && lesson.materials.length > 0
        )
    );

    return (
        <div className="flex flex-col space-y-6">
            {!hasAnyMaterials ? (
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                    <p className="text-text-primary text-md">
                        {courseTranslations('materials.noMaterialsAvailable')}
                    </p>
                </div>
            ) : (
                <CourseMaterialsAccordion data={successData} locale={locale} expandLessonId={lessonMaterialId} onCopyLessonLink={handleCopyLessonLink} copiedLessonId={copiedLessonId} />
            )}
        </div>
    );
}

export default function EnrolledCourseMaterial(
    props: EnrolledCourseMaterialProps,
) {
    const locale = useLocale() as TLocale;

    return (
        <Suspense
            fallback={<DefaultLoading locale={locale} variant="minimal" />}
        >
            <EnrolledCourseMaterialContent {...props} />
        </Suspense>
    );
}
