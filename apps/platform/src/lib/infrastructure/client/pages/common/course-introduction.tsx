import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/client';
import { Suspense, useState } from 'react';
import { useGetCourseIntroductionPresenter } from '../../hooks/use-course-introduction-presenter';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    CourseIntroBanner,
    DefaultError,
    DefaultLoading,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';

interface CourseIntroductionProps {
    courseSlug: string;
}

function IntroductionBanner({ courseSlug }: CourseIntroductionProps) {
    const [introductionResponse] = trpc.getCourseIntroduction.useSuspenseQuery({
        courseSlug: courseSlug,
    });
    const [introductionViewModel, setIntroductionViewModel] = useState<
        viewModels.TCourseIntroductionViewModel | undefined
    >(undefined);
    const { presenter } = useGetCourseIntroductionPresenter(
        setIntroductionViewModel,
    );
    presenter.present(introductionResponse, introductionViewModel);

    const locale = useLocale() as TLocale;

    if (!introductionViewModel) {
        return <DefaultLoading locale={locale} variant='minimal'/>;
    }

    if (introductionViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const introduction = introductionViewModel.data;

    return (
        <CourseIntroBanner
            description={introduction.text}
            videoId={introduction.video?.playbackId ?? ''}
            locale={locale}
            onErrorCallback={() => {
                // TODO: Handle error case, e.g., show a toast or log the error
            }}
            thumbnailUrl={introduction.video?.thumbnailUrl || undefined}
        />
    );
}

export default function CourseIntroduction({
    courseSlug,
}: CourseIntroductionProps) {
    const locale = useLocale() as TLocale;

    return (
        <div className="flex flex-col space-y-6">
            <SectionHeading text="Introduction" />
            <Suspense fallback={<DefaultLoading locale={locale} variant='minimal'/>}>
                <IntroductionBanner courseSlug={courseSlug} />
            </Suspense>
        </div>
    );
}