import { Button } from '@maany_shr/e-class-ui-kit';
import React from 'react';
import { useTranslations } from '@dad-e-class/translations';

export default function HomePage() {
    const t = useTranslations('home');
    return (
        <>
            {/* Header Section */}
            <div className="flex flex-col items-center font-extrablack text-button-primary-fill text-lg justify-center">
                <h1>{t('title')}</h1>
            </div>

            {/* Button Section */}
            <div className="flex flex-col justify-center items-center mt-10">
                <Button
                    variant="secondary"
                    size="huge"
                    textKey="home.buttonLabel"
                />
            </div>
        </>
    );
}