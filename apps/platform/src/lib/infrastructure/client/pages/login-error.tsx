'use client';

import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import React, { Suspense, useEffect, useState } from 'react';
import { Button, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface ErrorPageProps {
    platform: string;
    locale: TLocale;
}

/**
 * Inner component that handles OAuth errors
 * Uses useSearchParams which requires Suspense boundary
 */
const ErrorPageContent = (props: ErrorPageProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSigningOut, setIsSigningOut] = useState(false);

    // Get the error type from query params (NextAuth passes error type)
    const errorType = searchParams?.get('error');

    // Clear any invalid session on mount to ensure clean state
    useEffect(() => {
        // Only clear session for auth-related errors, not for other errors
        if (errorType === 'OAuthCallback' || errorType === 'OAuthSignin' || errorType === 'Callback') {
            // Clear session silently without redirect
            signOut({ redirect: false }).catch(err => {
                console.error('[AuthError] Failed to clear session:', err);
            });
        }
    }, [errorType]);

    const tryAgain = () => {
        router.push(`/${props.locale}/auth/login`);
    };

    const continueAsVisitor = async () => {
        setIsSigningOut(true);
        try {
            // Clear session and redirect to homepage
            await signOut({ redirect: false });
            router.push(`/${props.locale}/`);
        } catch (err) {
            console.error('[AuthError] Failed to sign out:', err);
            // Redirect anyway even if signOut fails
            router.push(`/${props.locale}/`);
        }
    };

    const dictionary = getDictionary(props.locale);
    const title = dictionary.pages.auth.errorPage.title;
    const description = dictionary.pages.auth.errorPage.description;
    const tryAgainText = dictionary.pages.auth.errorPage.tryAgain;
    const continueAsVisitorText = dictionary.pages.auth.errorPage.continueAsVisitor;

    return (
        <div className="space-y-4 rounded-md border border-base-neutral-700 bg-card-fill p-6 shadow-md">
            <h2>{title}</h2>
            <p className="text-lg text-neutral-300">{description}</p>
            <div className="flex flex-col gap-3">
                <Button
                    variant="primary"
                    size="medium"
                    text={tryAgainText}
                    onClick={tryAgain}
                    className="mx-auto w-full"
                />
                <Button
                    variant="secondary"
                    size="medium"
                    text={continueAsVisitorText}
                    onClick={continueAsVisitor}
                    disabled={isSigningOut}
                    className="mx-auto w-full"
                />
            </div>
        </div>
    );
};

/**
 * Error page component with Suspense boundary for useSearchParams
 */
const ErrorPage = (props: ErrorPageProps) => {
    return (
        <div className="theme-Cms flex items-center justify-center text-neutral-50">
            <div className="flex flex-col items-center text-center space-y-6">
                <h1 className="text-4xl font-bold">{props.platform}</h1>
                <Suspense fallback={<DefaultLoading locale={props.locale} variant="minimal" />}>
                    <ErrorPageContent {...props} />
                </Suspense>
            </div>
        </div>
    );
};

export default ErrorPage;
