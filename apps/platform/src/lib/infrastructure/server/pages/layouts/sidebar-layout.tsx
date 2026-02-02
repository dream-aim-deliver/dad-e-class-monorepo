import WorkspaceSidebar from './sidebar';
import nextAuth from '../../config/auth/next-auth.config';
import { TLocale } from '@maany_shr/e-class-translations';

export interface SidebarLayoutProps {
    children: React.ReactNode;
    params: {
        locale: TLocale;
    };
}
export default async function SidebarLayout(props: SidebarLayoutProps) {
    // Get session from NextAuth
    const session = await nextAuth.auth();
    const isLoggedIn = session !== null;
    return (
        <div className="flex flex-row lg:gap-3 p-5 overflow-y-auto">
            {isLoggedIn && (
                <div
                    id="sidebar"
                    className="sticky top-25 h-screen flex-shrink-0 z-[1000]"
                >
                    <WorkspaceSidebar
                        isCollapsed={true}
                        userName={session.user.name || 'Your Majesty'}
                        userRole={
                            session.user.roles?.includes('admin')
                                ? 'admin'
                                : session.user.roles?.includes('coach')
                                  ? 'coach'
                                  : session.user.roles?.includes('student')
                                    ? 'student'
                                    : 'student'
                        }
                        locale={props.params.locale}
                        profileImageUrl={session.user.image}
                        // TODO: Replace with actual rating logic
                        rating={{ score: 4.5, count: 10 }}
                    >
                        {props.children}
                    </WorkspaceSidebar>
                </div>
            )}
            <div id="content" className="w-full min-w-0 px-5">
                {props.children}
            </div>
        </div>
    );
}
