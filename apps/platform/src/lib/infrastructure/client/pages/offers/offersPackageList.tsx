import {
    CardListLayout,
    DefaultError,
    DefaultLoading,
    PackageCard,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/client';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useGetOffersPagePackagesPresenter } from '../../hooks/use-offers-page-packages-presenterr';

export default function PackageList() {
    const locale = useLocale() as TLocale;

    const [packagesResponse] = trpc.getOffersPagePackages.useSuspenseQuery({});
    const [packagesViewModel, setPackagesViewModel] = useState<
        viewModels.TOffersPagePackageListViewModel | undefined
    >(undefined);
    const { presenter } =
        useGetOffersPagePackagesPresenter(setPackagesViewModel);
    presenter.present(packagesResponse, packagesViewModel);

    if (!packagesViewModel) {
        return <DefaultLoading />;
    }

    if (packagesViewModel.mode === 'not-found') {
        return <DefaultError errorMessage="No packages found" />;
    }

    if (packagesViewModel.mode !== 'default') {
        return <DefaultError errorMessage={packagesViewModel.data.message} />;
    }

    const packages = packagesViewModel.data.packages;

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
                    />
                );
            })}
        </CardListLayout>
    );
}
