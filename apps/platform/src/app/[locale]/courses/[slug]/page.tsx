import CourseServerComponent from '../../../../lib/infrastructure/server/pages/course-rsx';

export default async function Page({
    params: paramsPromise,
    searchParams: searchParamsPromise,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await paramsPromise;
    const searchParams = await searchParamsPromise;

    const slug = params.slug;
    let role = searchParams.role;
    let tab = searchParams.tab;

    if (role && Array.isArray(role)) {
        role = undefined;
    }

    if (tab && Array.isArray(tab)) {
        tab = undefined;
    }

    return <CourseServerComponent slug={slug} role={role} tab={tab} />;
}
