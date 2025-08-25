import CreateCourseServerComponent from '../../../../../lib/infrastructure/server/pages/workspace/create-course-rsc';

export default async function Page({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    let duplicationCourseSlug = searchParams.duplicate;

    if (duplicationCourseSlug && Array.isArray(duplicationCourseSlug)) {
        duplicationCourseSlug = undefined;
    }

    return (
        <CreateCourseServerComponent
            duplicationCourseSlug={duplicationCourseSlug}
        />
    );
}
