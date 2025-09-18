
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
    let tab = searchParams.tab;

    if (!tab || Array.isArray(tab)) {
        tab = undefined;
    }

    return (
        <div>
            <h1>Platform Page - {slug}</h1>
            {tab && <p>Tab: {tab}</p>}
        </div>
    )
}
