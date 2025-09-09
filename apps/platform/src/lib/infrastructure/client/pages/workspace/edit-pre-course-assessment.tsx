'use client';

import { Button, DefaultError, DefaultLoading, SectionHeading } from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/client';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformLanguagePresenter } from '../../hooks/use-platform-language-presenter';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

export default function EditPreCourseAssessment() {
    const locale = useLocale() as TLocale;

    const [platformLanguageResponse] =
        trpc.getPlatformLanguage.useSuspenseQuery({});
    const [platformLanguageViewModel, setPlatformLanguageViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);
    const { presenter: platformLanguagePresenter } =
        useGetPlatformLanguagePresenter(setPlatformLanguageViewModel);
    platformLanguagePresenter.present(
        platformLanguageResponse,
        platformLanguageViewModel,
    );

    if (!platformLanguageViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (platformLanguageViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const isEnabled = platformLanguageViewModel.data.enablePreCourseAssessment;

    return (
        <div className="w-full p-4 bg-card-fill rounded-md flex flex-col gap-3 border-1 border-card-stroke">
            <SectionHeading text="Pre-course assessment form" />
            <span className="text-sm text-text-secondary">
                This form is displayed automatically at the beginning of each
                course
            </span>
            {!isEnabled && <div className="flex flex-col justify-between w-full bg-neutral-800 h-28 rounded-md border-1 border-neutral-700 p-4">
                <span className="text-sm text-text-primary font-bold">
                    This form is disabled.
                </span>
                <Button
                    variant="primary"
                    text="Enable form"
                    className="w-min"
                    size="small"
                />
            </div>}
        </div>
    );
}
