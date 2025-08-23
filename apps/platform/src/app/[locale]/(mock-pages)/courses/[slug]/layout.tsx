import SidebarLayout from '../../../../../../src/lib/infrastructure/server/pages/layouts/sidebar-layout';

export default async function CourseLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const params = await paramsPromise;
    return (
        <SidebarLayout params={params}>{children}</SidebarLayout>
    );
}
