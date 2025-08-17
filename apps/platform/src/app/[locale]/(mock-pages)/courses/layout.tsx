import WorkspaceSidebar from './sidebar';

export default async function RootLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    return (
        <div className="flex flex-row gap-8 p-4">
            <div
                id="sidebar"
                className="sticky top-25 h-screen flex-shrink-0 z-[1000]"
            >
                <WorkspaceSidebar
                    isCollapsed={true}
                    userName={'Carla'}
                    userRole={'student'}
                    children={undefined}
                    locale={'en'}
                />
            </div>
            <div
                id="content"
                className="w-full pr-6"
            >
                {children}
            </div>
        </div>
    );
}
