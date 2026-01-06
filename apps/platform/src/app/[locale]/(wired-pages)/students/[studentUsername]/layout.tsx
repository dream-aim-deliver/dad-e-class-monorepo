import SidebarLayout from '../../../../../lib/infrastructure/server/pages/layouts/sidebar-layout';
import { TLocale } from '@maany_shr/e-class-translations';

export default async function StudentLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const params = await paramsPromise;
    return (
        <SidebarLayout params={{ ...params, locale: params.locale as TLocale }}>
            {children}
        </SidebarLayout>
    );
}
