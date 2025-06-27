import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/client';
import { useMemo, useState } from 'react';
import { useListCoachingOfferingsPresenter } from '../../hooks/use-coaching-offerings-presenter';
import {
    BuyCoachingSession,
    DefaultError,
    DefaultLoading,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

interface CoachingOfferingsPanelProps {}

const PANEL_WIDTH = '400px';

export default function CoachingOfferingsPanel(
    props: CoachingOfferingsPanelProps,
) {
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
            className={`gap-5 lg:min-w-[${PANEL_WIDTH}] lg:w-[${PANEL_WIDTH}]`}
        >
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
                    console.log(sessionsPerOffering);
                }}
                currencyType={currency ?? ''}
                locale={locale}
            />
        </div>
    );
}
