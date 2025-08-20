import EditCourseServerComponent from '../../../../../../lib/infrastructure/server/pages/workspace/edit-course-rsx';

export default async function Page({
    params: paramsPromise,
    searchParams: searchParamsPromise,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await paramsPromise;

    const slug = params.slug;
    // TODO: handle tab

    return <EditCourseServerComponent slug={slug} />;
}
