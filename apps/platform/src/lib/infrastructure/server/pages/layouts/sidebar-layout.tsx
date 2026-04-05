import WorkspaceSidebar from './sidebar';
import nextAuth from '../../config/auth/next-auth.config';
import { TLocale } from '@maany_shr/e-class-translations';
import { Z_INDEX } from '@maany_shr/e-class-ui-kit';

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
        <div className="flex flex-row items-start gap-0 px-[max(16px,4vw)] py-5 lg:gap-[max(16px,4vw)]">
            {isLoggedIn && (
                <div
                    id="sidebar"
                    className="hidden lg:block sticky top-22 self-start h-[calc(100vh-5.5rem)] flex-shrink-0"
                    style={{ zIndex: Z_INDEX.SIDEBAR }}
                >
                    <WorkspaceSidebar
                        userName={session.user.name || 'Your Majesty'}
                        userRole={
                            session.user.roles?.includes('admin')
                                ? 'admin'
                                : session.user.roles?.includes('course_creator')
                                  ? 'courseCreator'
                                : session.user.roles?.includes('coach')
                                  ? 'coach'
                                  : session.user.roles?.includes('student')
                                    ? 'student'
                                    : 'student'
                        }
                        locale={props.params.locale}
                        profileImageUrl={session.user.image}
                    />
                </div>
            )}
            <div id="content" className="w-full min-w-0 max-w-[100rem] mx-auto px-0">
                {props.children}
            </div>
        </div>
    );
}
