'use client';

import {
    Button,
    DefaultError,
    DefaultLoading,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/client';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformLanguagePresenter } from '../../hooks/use-platform-language-presenter';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

export function usePlatformLanguage() {
    const [
        platformLanguageResponse,
        {
            refetch: refetchPlatformLanguage,
            isRefetching: isRefetchingPlatformLanguage,
        },
    ] = trpc.getPlatformLanguage.useSuspenseQuery({});

    const [platformLanguageViewModel, setPlatformLanguageViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);

    const { presenter: platformLanguagePresenter } =
        useGetPlatformLanguagePresenter(setPlatformLanguageViewModel);

    platformLanguagePresenter.present(
        platformLanguageResponse,
        platformLanguageViewModel,
    );

    return {
        platformLanguageViewModel,
        isRefetchingPlatformLanguage,
        refetchPlatformLanguage,
    };
}
interface UsePreCourseAssessmentToggleProps {
    platformLanguageViewModel:
        | viewModels.TPlatformLanguageViewModel
        | undefined;
    refetchPlatformLanguage: () => Promise<any>;
    setError: (error: string | undefined) => void;
}

export function usePreCourseAssessmentToggle({
    platformLanguageViewModel,
    refetchPlatformLanguage,
    setError,
}: UsePreCourseAssessmentToggleProps) {
    const togglePreCourseAssessmentMutation =
        trpc.togglePreCourseAssessment.useMutation();

    const onTogglePreCourseAssessment = async (enable: boolean) => {
        if (!platformLanguageViewModel) return;
        if (platformLanguageViewModel.mode !== 'default') return;

        setError(undefined);
        const response = await togglePreCourseAssessmentMutation.mutateAsync({
            enablePreCourseAssessment: enable,
        });

        if (response.success) {
            await refetchPlatformLanguage();
        } else {
            setError('An error occurred while toggling the form.');
        }
    };

    return {
        onTogglePreCourseAssessment,
        isPending: togglePreCourseAssessmentMutation.isPending,
    };
}

interface PreCourseAssessmentDisabledCardProps {
    onEnable: () => void;
    isPending: boolean;
}

export function PreCourseAssessmentDisabledCard({
    onEnable,
    isPending,
}: PreCourseAssessmentDisabledCardProps) {
    return (
        <div className="flex flex-col justify-between w-full bg-neutral-800 h-28 rounded-md border-1 border-neutral-700 p-4">
            <span className="text-sm text-text-primary font-bold">
                This form is disabled.
            </span>
            <Button
                variant="primary"
                text={isPending ? 'Enabling form...' : 'Enable form'}
                className="w-min"
                size="small"
                onClick={onEnable}
                disabled={isPending}
            />
        </div>
    );
}

interface PreCourseAssessmentEnabledControlsProps {
    onDisable: () => void;
    isPending: boolean;
}

export function PreCourseAssessmentEnabledControls({
    onDisable,
    isPending,
}: PreCourseAssessmentEnabledControlsProps) {
    return (
        <Button
            variant="text"
            className="text-sm p-0 m-0"
            text={isPending ? 'Disabling...' : 'Disable'}
            onClick={onDisable}
            disabled={isPending}
        />
    );
}

interface PreCourseAssessmentContentProps {
    platformLanguageViewModel:
        | viewModels.TPlatformLanguageViewModel
        | undefined;
    onToggle: (enable: boolean) => void;
    isTogglePending: boolean;
    isPlatformRefetching: boolean;
    error: string | undefined;
}

export function PreCourseAssessmentContent({
    platformLanguageViewModel,
    onToggle,
    isTogglePending,
    isPlatformRefetching,
    error,
}: PreCourseAssessmentContentProps) {
    const locale = useLocale() as TLocale;

    if (!platformLanguageViewModel || isPlatformRefetching) {
        return <DefaultLoading locale={locale} />;
    }

    if (platformLanguageViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const isEnabled = platformLanguageViewModel.data.enablePreCourseAssessment;

    return (
        <div className="w-full p-4 bg-card-fill rounded-md flex flex-col gap-3 border-1 border-card-stroke">
            <div className="w-full flex sm:flex-row gap-2 flex-col sm:gap-0 justify-between items-start sm:items-center">
                <SectionHeading text="Pre-course assessment form" />
                {isEnabled && (
                    <PreCourseAssessmentEnabledControls
                        onDisable={() => onToggle(false)}
                        isPending={isTogglePending}
                    />
                )}
            </div>
            <span className="text-sm text-text-secondary">
                This form is displayed automatically at the beginning of each
                course
            </span>
            {error && <DefaultError locale={locale} description={error} />}

            {!isEnabled && (
                <PreCourseAssessmentDisabledCard
                    onEnable={() => onToggle(true)}
                    isPending={isTogglePending}
                />
            )}
        </div>
    );
}

export default function EditPreCourseAssessment() {
    const [error, setError] = useState<string | undefined>(undefined);

    const {
        platformLanguageViewModel,
        isRefetchingPlatformLanguage,
        refetchPlatformLanguage,
    } = usePlatformLanguage();

    const { onTogglePreCourseAssessment, isPending } =
        usePreCourseAssessmentToggle({
            platformLanguageViewModel,
            refetchPlatformLanguage,
            setError,
        });

    // Success state
    return (
        <PreCourseAssessmentContent
            platformLanguageViewModel={platformLanguageViewModel}
            onToggle={onTogglePreCourseAssessment}
            isTogglePending={isPending}
            isPlatformRefetching={isRefetchingPlatformLanguage}
            error={error}
        />
    );
}
