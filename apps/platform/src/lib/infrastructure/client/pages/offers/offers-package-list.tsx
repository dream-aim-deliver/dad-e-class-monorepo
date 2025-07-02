import {
    CardListLayout,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    PackageCard,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/client';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useListOffersPagePackagesPresenter } from '../../hooks/use-offers-page-packages-presenterr';
import { useRouter } from 'next/navigation';

export default function PackageList() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.offers');

    const [packagesResponse] = trpc.listOffersPagePackages.useSuspenseQuery({});
    const [packagesViewModel, setPackagesViewModel] = useState<
        viewModels.TOffersPagePackageListViewModel | undefined
    >(undefined);
    const { presenter } =
        useListOffersPagePackagesPresenter(setPackagesViewModel);
    presenter.present(packagesResponse, packagesViewModel);
    const router = useRouter();

    if (!packagesViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (packagesViewModel.mode === 'not-found') {
        return (
            <DefaultNotFound
                locale={locale}
                title={t('packagesNotFound.title')}
                description={t('packagesNotFound.description')}
            />
        );
    }

    if (packagesViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const packages = packagesViewModel.data.packages;

    if (packages.length === 0) {
        return <DefaultNotFound locale={locale} />;
    }

    return (
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
                            fullPrice: pkg.pricing.allCourses,
                            partialPrice: pkg.pricing.actual,
                            currency: pkg.pricing.currency,
                        }}
                        duration={pkg.duration}
                        locale={locale}
                        onClickDetails={() => {
                            router.push(`/packages/${pkg.slug}`);
                        }}
                        onClickPurchase={() => {
                            router.push(`/checkout/${pkg.slug}`);
                        }}
                    />
                );
            })}
        </CardListLayout>
    );
}
