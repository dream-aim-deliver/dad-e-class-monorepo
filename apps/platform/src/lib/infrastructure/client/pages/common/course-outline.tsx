import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/client';
import { Suspense, useState } from 'react';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    DefaultAccordion,
    DefaultError,
    DefaultLoading,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import { useGetCourseOutlinePresenter } from '../../hooks/use-course-outline-presenter';

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
    presenter.present(outlineResponse, outlineViewModel);

    const locale = useLocale() as TLocale;

    if (!outlineViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (outlineViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const outline = outlineViewModel.data;

    return (
        <DefaultAccordion
            className="px-6 py-4 bg-card-fill border border-card-stroke rounded-md"
            showNumbers={true}
            items={outline.items.map((item) => ({
                title: item.title,
                content: item.description,
                position: item.position,
            }))}
        />
    );
}

export default function CourseOutline({ courseSlug }: CourseOutlineProps) {
    const locale = useLocale() as TLocale;

    return (
        <div className="flex flex-col space-y-6">
            <h2> Course content </h2>
            <Suspense fallback={<DefaultLoading locale={locale} />}>
                <OutlineAccordion courseSlug={courseSlug} />
            </Suspense>
        </div>
    );
}
