import WorkspaceSidebar from './sidebar';

export default async function RootLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    return (
        <div className="flex flex-row lg:gap-8">
            <div
                id="sidebar"
                className="sticky md:p-5 top-25 h-screen flex-shrink-0 z-[1000]"
            >
                <WorkspaceSidebar
                    isCollapsed={true}
                    userName={'Carla'}
                    userRole={'student'}
                    locale={'en'}
                >
                    {children}
                </WorkspaceSidebar>
            </div>
            <div id="content" className="w-full md:pr-30">
                {children}
            </div>
        </div>
    );
}
