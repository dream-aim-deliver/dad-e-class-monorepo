import { TLocale } from '@maany_shr/e-class-translations';
import CourseServerComponent from '../../../../../lib/infrastructure/server/pages/course-rsc';
import getSession from '../../../../../lib/infrastructure/server/config/auth/get-session';

export default async function Page({
    params: paramsPromise,
    searchParams: searchParamsPromise,
}: {
    params: Promise<{ locale: TLocale; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await paramsPromise;
    const searchParams = await searchParamsPromise;

    const { locale, slug } = params;
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
