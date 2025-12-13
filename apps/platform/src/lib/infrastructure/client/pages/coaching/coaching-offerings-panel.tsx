import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/cms-client';
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
import { groupOfferings } from '../../utils/group-offerings';

function AvailableCoachings() {
    const router = useRouter();
    const [availableCoachingsResponse] =
        trpc.listAvailableCoachings.useSuspenseQuery({});
    const [availableCoachingsViewModel, setAvailableCoachingsViewModel] =
        useState<viewModels.TAvailableCoachingListViewModel | undefined>(
            undefined,
        );
    const { presenter } = useListAvailableCoachingsPresenter(
        setAvailableCoachingsViewModel,
    );
    // @ts-ignore
    presenter.present(availableCoachingsResponse, availableCoachingsViewModel);

    const locale = useLocale() as TLocale;

    const groupedOfferings = useMemo(
        () => {
            if (!availableCoachingsViewModel) return [];
            return groupOfferings(availableCoachingsViewModel);
        },
        [availableCoachingsViewModel],
    );

    if (!availableCoachingsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (availableCoachingsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    if (
        availableCoachingsViewModel.mode === 'not-found' ||
        availableCoachingsViewModel.mode === 'unauthenticated'
    ) {
        return;
    }

    const availableOfferings = availableCoachingsViewModel.data.offerings;

    if (availableOfferings.length === 0) {
        return;
    }

    return (
        <AvailableCoachingSessions
            locale={locale}
            availableCoachingSessionsData={groupedOfferings}
            onClickBuyMoreSessions={() => {
                router.push('/checkout');
            }}
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
    // @ts-ignore
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
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coachingOfferingsViewModel.mode === 'not-found') {
        return;
    }

    if (coachingOfferingsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const coachingOfferings = coachingOfferingsViewModel.data.offerings;

    if (coachingOfferings.length === 0) {
        return;
    }

    return (
        <div
            className={`flex flex-col space-y-5 lg:min-w-[400px] lg:w-[400px]`}
        >
            {isLoggedIn && (
                <Suspense
                    fallback={
                        <AvailableCoachingSessions
                            locale={locale}
                            isLoading
                            hideButton
                            availableCoachingSessionsData={[]}
                            onClickBuyMoreSessions={() => {
                                router.push('/checkout');
                            }}
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
