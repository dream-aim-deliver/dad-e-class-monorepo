import type { Viewport } from 'next';
import { TLocale } from '@maany_shr/e-class-translations';
import CourseServerComponent from '../../../../../lib/infrastructure/server/pages/course-rsc';
import getSession from '../../../../../lib/infrastructure/server/config/auth/get-session';
import { redirect } from 'next/navigation';
import { getQueryClient, trpc } from '../../../../../lib/infrastructure/server/config/trpc/cms-server';
import { createGetCourseAccessPresenter } from '../../../../../lib/infrastructure/server/presenter/get-course-access-presenter';
import { viewModels } from '@maany_shr/e-class-models';

// MOBILE-HACK: Responsive viewport for unauthenticated visitors (always visitor view).
// Authenticated users keep 1280px (may be enrolled). The RSC's renderVisitorView includes
// a client-side MobileReadyViewport component to handle the authenticated-visitor edge case.
export async function generateViewport(): Promise<Viewport> {
    const session = await getSession();
    if (!session) return { width: 'device-width', initialScale: 1 };
    return { width: 1280 };
}

export default async function Page({
    params: paramsPromise,
    searchParams: searchParamsPromise,
}: {
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await paramsPromise;
    const searchParams = await searchParamsPromise;

    const locale = params.locale as TLocale;
    const { slug } = params;

    // Check if we need to redirect for PCA language before fetching all data
    await handlePCALocaleRedirect(locale, slug);
    let role = searchParams.role;
    let tab = searchParams.tab;
    let lesson = searchParams.lesson;

    if (role && Array.isArray(role)) {
        role = undefined;
    }

    if (tab && Array.isArray(tab)) {
        tab = undefined;
    }

    if (lesson && Array.isArray(lesson)) {
        lesson = undefined;
    }

    // Get session and extract student username
    const session = await getSession();
    const username = session?.user?.name || undefined;

    return (
        <CourseServerComponent
            slug={slug}
            locale={locale}
            role={role}
            tab={tab}
            lesson={lesson}
            username={username}
        />
    );
}

async function handlePCALocaleRedirect(locale: TLocale, slug: string): Promise<void> {
    const queryOptions = trpc.getCourseAccess.queryOptions({
        courseSlug: slug,
    });
    const queryClient = getQueryClient();
    const courseAccessResponse = await queryClient.fetchQuery(queryOptions);

    let courseAccessViewModel: viewModels.TGetCourseAccessViewModel | undefined;
    const presenter = createGetCourseAccessPresenter((viewModel) => {
        courseAccessViewModel = viewModel;
    });

    // @ts-ignore
    await presenter.present(courseAccessResponse, courseAccessViewModel);

    if (courseAccessViewModel?.mode === 'default') {
        const { highestRole, isAssessmentCompleted, course } = courseAccessViewModel.data;
        const shouldShowAssessment = isAssessmentCompleted === false;

        if (shouldShowAssessment) {
            const courseLanguage = course?.language?.code as TLocale;
            if (courseLanguage && courseLanguage !== locale) {
                redirect(`/${courseLanguage}/courses/${slug}`);
            }
        }
    }
}
