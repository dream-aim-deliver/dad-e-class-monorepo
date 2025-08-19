import WorkspaceSidebar from './sidebar';
import nextAuth from '../../config/auth/next-auth.config';

export interface SidebarLayoutProps {
    children: React.ReactNode,
    params: {
        locale: string
    }
}
export default async function SidebarLayout(props: SidebarLayoutProps) {
    // Get session from NextAuth
    const session = await nextAuth.auth();
    const isLoggedIn = session !== null;
    return (
        <div className="flex flex-row lg:gap-8">
            {isLoggedIn && (
                <div
                    id="sidebar"
                    className="sticky md:p-5 top-25 h-screen flex-shrink-0 z-[1000]"
                >
                    <WorkspaceSidebar
                        isCollapsed={true}
                        userName={session.user.name || 'Your Majesty'}
                        userRole={
                            session.user.roles?.includes('admin')
                                ? 'coach'
                                : session.user.roles?.includes('coach')
                                  ? 'coach'
                                  : session.user.roles?.includes('student')
                                    ? 'student'
                                    : 'student'
                        }
                        locale={'en'}
                        profileImageUrl={session.user.image}
                        //TODO: Replace with actual rating logic
                        rating={{ score: 4.5, count: 10 }}
                    >
                        {props.children}
                    </WorkspaceSidebar>
                </div>
            )}
            <div id="content" className="w-full md:pr-30">
                {props.children}
            </div>
        </div>
    );
}
