import {
    CardListLayout,
    DefaultError,
    DefaultLoading,
    EmptyState,
    PackageCard,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/cms-client';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useListOffersPagePackagesPresenter } from '../../hooks/use-list-offers-page-packages-presenter';
import { useRouter } from 'next/navigation';
import { useRequiredPlatform } from '../../context/platform-context';

export default function PackageList() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.offers');
    const { platform } = useRequiredPlatform();

    const [packagesResponse] = trpc.listOffersPagePackages.useSuspenseQuery({});
    const [packagesViewModel, setPackagesViewModel] = useState<
        viewModels.TListOffersPagePackagesViewModel | undefined
    >(undefined);
    const { presenter } =
        useListOffersPagePackagesPresenter(setPackagesViewModel);
    // @ts-ignore
    presenter.present(packagesResponse, packagesViewModel);

    const router = useRouter();

    if (!packagesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (packagesViewModel.mode === 'not-found') {
        return (
            <EmptyState
                locale={locale}
                message={t('packagesNotFound.description')}
            />
        );
    }

    if (packagesViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('loadError.title')}
                description={t('loadError.description')}
            />
        );
    }

    const packages = packagesViewModel.data.packages;

    if (packages.length === 0) {
        return (
            <EmptyState
                locale={locale}
                message={t('packagesNotFound.description')}
            />
        );
    }

    return (
        <div className="flex flex-col gap-4 scroll-mt-24">
            <CardListLayout>
                {packages.map((pkg) => {
                    return (
                        <PackageCard
                            key={`package-${pkg.id}`}
                            courseCount={pkg.courseCount}
                            title={pkg.title}
                            description={pkg.description}
                            imageUrl={pkg.imageUrl ?? ''}
                            pricing={{
                                // fullPrice = sum of all courses + all coaching sessions (what you'd pay if bought separately)
                                fullPrice: (pkg.pricing.allCourses ?? 0) + (pkg.pricing.coachingSessionsTotal ?? 0),
                                // partialPrice = actual package price (NOTE: 'actual' is the price WITH coaching in this API)
                                partialPrice: pkg.pricing.actual,
                                currency: platform.currency,
                                // Display savingsWithCoachings as the savings amount shown to user
                                savingsWithoutCoachings: pkg.pricing.savingsWithCoachings,
                                savingsWithCoachings: pkg.pricing.savingsWithCoachings,
                                coachingSessionsTotal: pkg.pricing.coachingSessionsTotal,
                            }}
                            duration={pkg.duration}
                            locale={locale}
                            onClickDetails={() => {
                                router.push(`/packages/${pkg.id}`);
                            }}
                            onClickPurchase={() => {
                                router.push(`/packages/${pkg.id}`);
                            }}
                        />
                    );
                })}
            </CardListLayout>
        </div>
    );
}
