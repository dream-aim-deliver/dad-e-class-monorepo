import { viewModels } from '@maany_shr/e-class-models';
import { Suspense, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    DefaultAccordion,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
} from '@maany_shr/e-class-ui-kit';
import { useGetCourseOutlinePresenter } from '../../hooks/use-course-outline-presenter';
import { trpc } from '../../trpc/cms-client';

interface CourseOutlineProps {
    courseSlug: string;
}

function OutlineAccordion({ courseSlug }: CourseOutlineProps) {
    const [outlineResponse] = trpc.getCourseOutline.useSuspenseQuery({
        courseSlug: courseSlug,
    });
    const [outlineViewModel, setOutlineViewModel] = useState<
        viewModels.TCourseOutlineViewModel | undefined
    >(undefined);
    const { presenter } = useGetCourseOutlinePresenter(setOutlineViewModel);
    // @ts-ignore
    presenter.present(outlineResponse, outlineViewModel);

    const locale = useLocale() as TLocale;

    if (!outlineViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (outlineViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const outline = outlineViewModel.data;

    if (outline.items.length === 0) {
        return <DefaultError locale={locale} description="The course doesn't have an outline." />;
    }

    return (
        <DefaultAccordion
            className="px-6 py-4 bg-card-fill border border-card-stroke rounded-md"
            showNumbers={true}
            items={outline.items.map((item) => ({
                title: item.title,
                content: item.description,
                position: item.position,
                iconImageUrl: item.icon?.downloadUrl,
            }))}
        />
    );
}

export default function CourseOutline({ courseSlug }: CourseOutlineProps) {
    const locale = useLocale() as TLocale;
    const courseOutlineTranslations = useTranslations('pages.courseOutline');

    return (
        <div className="flex flex-col space-y-6">
            <h2>{courseOutlineTranslations('courseContent')}</h2>
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <OutlineAccordion courseSlug={courseSlug} />
            </Suspense>
        </div>
    );
}
