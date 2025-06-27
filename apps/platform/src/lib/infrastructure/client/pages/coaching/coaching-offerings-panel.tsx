import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/client';
import { Suspense, useMemo, useState } from 'react';
import { useListCoachingOfferingsPresenter } from '../../hooks/use-coaching-offerings-presenter';
import {
    AvailableCoachingSessions,
    BuyCoachingSession,
    DefaultError,
    DefaultLoading,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import { useListAvailableCoachingsPresenter } from '../../hooks/use-available-coachings-presenter';
import { useSession } from 'next-auth/react';

const PANEL_WIDTH = '400px';

function AvailableCoachings() {
    const [availableCoachingsResponse] =
        trpc.listAvailableCoachings.useSuspenseQuery({});
    const [availableCoachingsViewModel, setAvailableCoachingsViewModel] =
        useState<viewModels.TAvailableCoachingListViewModel | undefined>(
            undefined,
        );
    const { presenter } = useListAvailableCoachingsPresenter(
        setAvailableCoachingsViewModel,
    );
    presenter.present(availableCoachingsResponse, availableCoachingsViewModel);

    const locale = useLocale() as TLocale;

    if (!availableCoachingsViewModel) {
        return <DefaultLoading />;
    }

    if (availableCoachingsViewModel.mode !== 'default') {
        return (
            <DefaultError
                errorMessage={availableCoachingsViewModel.data.message}
            />
        );
    }

    const availableOfferings = availableCoachingsViewModel.data.offerings;

    return (
        <AvailableCoachingSessions
            locale={locale}
            availableCoachingSessionsData={availableOfferings.map(
                (offering) => ({
                    id: offering.id,
                    title: offering.name,
                    time: offering.duration,
                    numberOfSessions: offering.boughtCoachingIds.length,
                }),
            )}
            hideButton
        />
    );
}

export default function CoachingOfferingsPanel() {
    const [coachingOfferingsResponse] =
        trpc.listCoachingOfferings.useSuspenseQuery({});
    const [coachingOfferingsViewModel, setCoachingOfferingsViewModel] =
        useState<viewModels.TCoachingOfferingListViewModel | undefined>(
            undefined,
        );
    const { presenter } = useListCoachingOfferingsPresenter(
        setCoachingOfferingsViewModel,
    );
    presenter.present(coachingOfferingsResponse, coachingOfferingsViewModel);

    const locale = useLocale() as TLocale;
    const router = useRouter();

    const sessionDTO = useSession();
    const isLoggedIn = !!sessionDTO.data;

    const currency = useMemo(() => {
        if (
            !coachingOfferingsViewModel ||
            coachingOfferingsViewModel.mode !== 'default'
        ) {
            return undefined;
        }
        // Each offering specifies a currency, hence deriving it from the first offering
        return coachingOfferingsViewModel.data.offerings[0]?.currency;
    }, [coachingOfferingsViewModel]);

    if (!coachingOfferingsViewModel) {
        return <DefaultLoading />;
    }

    if (coachingOfferingsViewModel.mode !== 'default') {
        return (
            <DefaultError
                errorMessage={coachingOfferingsViewModel.data.message}
            />
        );
    }

    const coachingOfferings = coachingOfferingsViewModel.data.offerings;

    return (
        <div
            className={`flex flex-col space-y-5 lg:min-w-[${PANEL_WIDTH}] lg:w-[${PANEL_WIDTH}]`}
        >
            {isLoggedIn && (
                <Suspense
                    fallback={
                        <AvailableCoachingSessions
                            locale={locale}
                            isLoading
                            hideButton
                        />
                    }
                >
                    <AvailableCoachings />
                </Suspense>
            )}
            <BuyCoachingSession
                offerings={coachingOfferings.map((offering) => ({
                    id: offering.id,
                    title: offering.name,
                    content: offering.description,
                    price: offering.price,
                    currency: offering.currency,
                    duration: offering.duration,
                }))}
                onBuy={function (
                    sessionsPerOffering: Record<string | number, number>,
                ): void {
                    // TODO: construct query parameters from sessionPerOffering
                    router.push('/checkout');
                }}
                currencyType={currency ?? ''}
                locale={locale}
            />
        </div>
    );
}
