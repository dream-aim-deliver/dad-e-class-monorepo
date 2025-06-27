'use client';

import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import React from 'react';
import { Button } from '@maany_shr/e-class-ui-kit';
import { useRouter } from 'next/navigation';

interface ErrorPageProps {
    platform: string;
    locale: TLocale;
}

const ErrorPage = (props: ErrorPageProps) => {
    const router = useRouter();
    const tryAgain = () => {
        router.push(`/${props.locale}/auth/login`);
    };

    const dictionary = getDictionary(props.locale);
    const title = dictionary.pages.auth.errorPage.title;
    const description = dictionary.pages.auth.errorPage.description;
    const tryAgainText = dictionary.pages.auth.errorPage.tryAgain;

    return (
        <div className="theme-Cms flex items-center justify-center text-neutral-50">
            <div className="flex flex-col items-center text-center space-y-6">
                <h1 className="text-4xl font-bold">{props.platform}</h1>
                <div className="space-y-4 rounded-md border border-base-neutral-700 bg-card-fill p-6 shadow-md">
                    <h2>{title}</h2>
                    <p className="text-lg text-neutral-300">{description}</p>
                    <Button
                        variant="primary"
                        size="medium"
                        text={tryAgainText}
                        onClick={tryAgain}
                        className="mx-auto"
                    ></Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
