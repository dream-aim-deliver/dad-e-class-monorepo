'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@maany_shr/e-class-ui-kit';

export default function AccessDeniedPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/auth/login' });
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-base-neutral-950)]">
            <div className="max-w-md w-full p-8 bg-[var(--color-card-fill)] border border-[var(--color-card-stroke)] rounded-[var(--radius-huge)] shadow-xl">
                <div className="text-center">
                    <div className="mb-6">
                        <svg
                            className="mx-auto h-16 w-16 text-[var(--color-feedback-error-primary)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Access Denied
                    </h1>

                    <p className="text-text-secondary mb-8">
                        {session?.user?.email ? (
                            <>
                                Sorry <strong>{session.user.email}</strong>, you don&apos;t have permission to access the CMS.
                                <br />
                                <br />
                                Admin role is required to access this area.
                            </>
                        ) : (
                            'You need admin privileges to access this area.'
                        )}
                    </p>

                    <div className="flex flex-col space-y-3">
                        <Button
                            onClick={handleSignOut}
                            className="w-full"
                        >
                            Sign Out & Try Different Account
                        </Button>

                        <Button
                            onClick={handleGoBack}
                            variant="secondary"
                            className="w-full"
                        >
                            Go Back
                        </Button>
                    </div>

                    {session?.user?.roles && (
                        <div className="mt-6 pt-6 border-t border-[var(--color-divider)]">
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Your current roles: {session.user.roles.join(', ')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}