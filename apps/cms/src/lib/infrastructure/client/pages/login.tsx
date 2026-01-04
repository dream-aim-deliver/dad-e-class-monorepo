'use client';
import React, { Suspense, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { validateCallbackUrl } from '@maany_shr/e-class-auth';
import env from '../config/env';

interface LoginPageProps {
    platform: string;
    locale: TLocale;
    enableCredentials: boolean;
    isProduction: boolean;
}

const LoginPage = (props: LoginPageProps) => {
    const searchParams = useSearchParams();
    const loggedOut = searchParams?.get('loggedout');

    // Get and validate callback URL from query parameters
    const rawCallbackUrl = searchParams?.get('callbackUrl');
    const callbackUrl = validateCallbackUrl(rawCallbackUrl, {
        defaultUrl: `/${props.locale}`,
    });

    const dictionary = getDictionary(props.locale);

    const handleSubmit = async (inputValues: {
        userName: string;
        userPassword: string;
    }): Promise<void> => {
        await signIn('credentials', {
            username: inputValues.userName,
            password: inputValues.userPassword,
            callbackUrl: callbackUrl,
        });
    };

    // TODO: what is the purpose of this?
    const handleAuth0 = async () => {
        await signIn(
            'auth0',
            { callbackUrl: callbackUrl },
            {
                ui_locales: props.locale,
                platform: props.platform,
                // TODO: the logo URL is passed from the backend
                platform_logo_public_url: 'mock',
                // TODO: the platform is identified by its ID ( Not in Auth0 Setup)
                platform_short_name: env.NEXT_PUBLIC_E_CLASS_RUNTIME,
                terms_and_conditions_title:
                    dictionary.pages.sso.termsAndConditions.title,
                terms_and_conditions_content:
                    dictionary.pages.sso.termsAndConditions.content,
                terms_and_conditions_confirmation_text:
                    dictionary.pages.sso.termsAndConditions.confirmationText,
                privacy_policy_url: `${env.NEXT_PUBLIC_APP_URL}/${props.locale}/privacy-policy`,
                terms_of_use_url: `${env.NEXT_PUBLIC_APP_URL}/${props.locale}/terms-of-use`,
                rules_url: `${env.NEXT_PUBLIC_APP_URL}/${props.locale}/rules`,
                courses_information_url: `${env.NEXT_PUBLIC_APP_URL}/${props.locale}/courses-information`,
            },
        );
    };

    // Auto-redirect to Auth0 in production mode (must run client-side only)
    useEffect(() => {
        if (props.isProduction) {
            handleAuth0();
        }
    }, [props.isProduction]);

    if (props.isProduction) {
        return <DefaultLoading locale={props.locale} variant="minimal" />;
    }

    return (
        <div className="flex text-white w-full items-center justify-center ">
            <div className="flex flex-col items-center justify-between text-center gap-4">
                <h1 className="mb-8 text-4xl font-bold animate-pulseGrow">
                    {' '}
                    {props.platform}{' '}
                </h1>
                <div className="text-left space-y-4 animate-fade-in transform rounded-md border border-gray-300 p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    {loggedOut && (
                        <div className="mb-4 rounded bg-green-500 p-4 text-white">
                            {dictionary.pages.login.postLogout}
                        </div>
                    )}
                    <h2 className="mb-4 text-2xl font-bold">
                        {dictionary.pages.login.title}
                    </h2>
                    {props.enableCredentials && (
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const inputValues = {
                                    userName: formData.get(
                                        'username',
                                    ) as string,
                                    userPassword: formData.get(
                                        'password',
                                    ) as string,
                                };
                                await handleSubmit(inputValues);
                            }}
                        >
                            <div className="mb-4">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-500"
                                >
                                    {dictionary.pages.login.username}
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-500"
                                >
                                    {dictionary.pages.login.password}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {dictionary.pages.login.signIn}
                                </button>
                            </div>
                        </form>
                    )}
                    <button
                        onClick={handleAuth0}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {dictionary.pages.login.signIn + ' (E-Class)'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LoginPageWithSuspense = (props: LoginPageProps) => {
    const dictionary = getDictionary(props.locale);

    return (
        <Suspense fallback={<DefaultLoading locale={props.locale} variant="minimal" />}>
            <LoginPage {...props} />
        </Suspense>
    );
};

export default LoginPageWithSuspense;
