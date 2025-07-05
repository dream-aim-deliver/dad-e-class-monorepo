import CourseServerComponent from '../../../../lib/infrastructure/server/pages/course-rsx';

export default async function Page({
    params: paramsPromise,
}: {
    params: Promise<{ slug: string }>;
}) {
    const params = await paramsPromise;
    const slug = params.slug;
    return <CourseServerComponent slug={slug} />;
}
