'use client';

import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../trpc/cms-client';
import { useListPackagesPresenter } from '../hooks/use-list-packages-presenter';
import { useArchivePackagePresenter } from '../hooks/use-archive-package-presenter';
import { useState, useEffect } from 'react';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  DefaultLoading,
  DefaultError,
  DefaultNotFound,
  PackageCmsCardList,
  PackageCmsCard,
  Breadcrumbs,
  ArchivePackageModal,
  ArchiveSuccessModal,
  Banner,
  FeedBackMessage
} from '@maany_shr/e-class-ui-kit';
import { idToNumber } from '../utils/id-to-number';
import { useRequiredPlatform } from '../context/platform-context';

interface PackageImage {
  id: string;
  name: string;
  size: number;
  category: "image";
  downloadUrl: string;
}

interface PackageData {
  id: string | number;
  title: string;
  description: string;
  status: "archived" | "published";
  price: number;
  priceWithCoachings: number;
  image?: PackageImage | null;
  courseCount: number;
  duration: number;
}

interface AllPackagesProps {
  locale: TLocale;
  platformSlug: string;
  platformLocale: string;
}

export default function AllPackages({ locale, platformSlug, platformLocale }: AllPackagesProps) {
  const currentLocale = useLocale() as TLocale;
  const router = useRouter();
  const t = useTranslations('pages.allPackages');
  const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
  const { platform } = useRequiredPlatform();

  // TRPC query for listPackages usecase 
  const [listPackagesResponse] = trpc.listPackages.useSuspenseQuery({
    platformSlug,
    platformLocale,
  });

  const [listPackagesViewModel, setListPackagesViewModel] = useState<
    viewModels.TListPackagesViewModel | undefined
  >(undefined);

  // Create useListPackagesPresenter hook
  const { presenter } = useListPackagesPresenter(setListPackagesViewModel);

  // Present the data when you have the response
  // @ts-ignore
  presenter.present(listPackagesResponse, listPackagesViewModel);

  // DEBUG: Log packages data to inspect pricing values from backend
  console.log('[tRPC: listPackages] API response:', listPackagesResponse);
  console.log('[tRPC: listPackages] ViewModel:', listPackagesViewModel);

  // Client state for show archived filter - default to true to show all packages
  const [showArchived, setShowArchived] = useState(true);

  // Modal state
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [packageToArchive, setPackageToArchive] = useState<string | null>(null);

  // Error and success message state for mutations
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Archive package presenter
  const [archivePackageViewModel, setArchivePackageViewModel] = useState<
    viewModels.TArchivePackageViewModel | undefined
  >(undefined);
  const { presenter: archivePresenter } = useArchivePackagePresenter(setArchivePackageViewModel);

  // Archive package mutation
  const archivePackageMutation = trpc.archivePackage.useMutation();

  // Get TRPC utils for query invalidation (must be at top level)
  const utils = trpc.useUtils();

  // Handle archive package mutation presentation
  useEffect(() => {
    if (archivePackageMutation.isSuccess && archivePackageMutation.data) {
      // @ts-ignore
      archivePresenter.present(archivePackageMutation.data, archivePackageViewModel);
    }
  }, [archivePackageMutation.isSuccess, archivePackageMutation.data, archivePresenter, archivePackageViewModel]);

  // Handle archive package success/error
  useEffect(() => {
    if (archivePackageViewModel?.mode === 'default') {
      // Close archive modal and show success modal
      setShowArchiveModal(false);
      setShowSuccessModal(true);
      // Refetch packages by invalidating the query
      utils.listPackages.invalidate({ platformSlug, platformLocale });
      // Auto-close success modal after 10 seconds
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        setPackageToArchive(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
    if (archivePackageViewModel?.mode === 'kaboom') {
      setErrorMessage(t('errorMessages.archiveFailed'));
      setSuccessMessage(null);
    }
  }, [archivePackageViewModel, platformSlug, platformLocale]);

  // Handle archive mutation errors (network/unknown)
  useEffect(() => {
    if (archivePackageMutation.isError) {
      setErrorMessage(archivePackageMutation.error?.message || t('errorMessages.archiveFailed'));
      setSuccessMessage(null);
    }
  }, [archivePackageMutation.isError, archivePackageMutation.error]);

  // Publish package mutation (no presenter available)
  const publishPackageMutation = trpc.publishPackage.useMutation({
    onSuccess: () => {
      setSuccessMessage(t('successMessages.packagePublished'));
      setErrorMessage(null);
      utils.listPackages.invalidate({ platformSlug, platformLocale });
      // Auto-dismiss success message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(null), 10000);
      return () => clearTimeout(timer);
    },
    onError: (error) => {
      setErrorMessage(error?.message || t('errorMessages.publishFailed'));
      setSuccessMessage(null);
    },
  });

  // Navigation handlers
  const handleCreatePackage = () => {
    router.push(`/${locale}/platform/${platformSlug}/${platformLocale}/packages/create`);
  };

  const handleEditPackage = (packageId: string) => {
    router.push(`/${locale}/platform/${platformSlug}/${platformLocale}/packages/edit/${packageId}`);
  };

  const handleArchivePackage = (packageId: string) => {
    setPackageToArchive(packageId);
    setShowArchiveModal(true);
  };

  const handleConfirmArchive = () => {
    if (packageToArchive) {
      archivePackageMutation.mutate({ packageId: Number(packageToArchive) });
    }
  };

  const handleCloseArchiveModal = () => {
    setShowArchiveModal(false);
    setPackageToArchive(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setPackageToArchive(null);
  };

  const handlePublishPackage = async (packageId: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await publishPackageMutation.mutateAsync({
        packageId: idToNumber(packageId)!
      });
    } catch (error) {
      // Error handled by mutation onError callback
    }
  };

  // Breadcrumbs following the standard pattern
  const breadcrumbItems = [
    {
      label: breadcrumbsTranslations('platforms'),
      onClick: () => router.push('/'),
    },
    {
      label: platformSlug.charAt(0).toUpperCase() + platformSlug.slice(1),
      onClick: () => {
        router.push(`/${locale}/platform/${platformSlug}/${platformLocale}`);
      },
    },
    {
      label: t('title'),
      onClick: () => {
        // Nothing should happen on clicking the current page
      },
    },
  ];

  // Loading state 
  if (!listPackagesViewModel) {
    return <DefaultLoading locale={currentLocale} variant="minimal" />;
  }

  // Error handling
  if (listPackagesViewModel.mode === 'kaboom') {
    return (
      <DefaultError
        type="simple"
        locale={currentLocale}
        title={t('error.title')}
        description={t('error.description')}
      />
    );
  }

  if (listPackagesViewModel.mode === 'not-found') {
    const errorData = listPackagesViewModel.data;
    return <DefaultNotFound locale={currentLocale} />;
  }

  // Success state - extract data using discovered pattern
  const packagesData = listPackagesViewModel.data;
  const packages = packagesData.packages;

  return (
    <div className="flex flex-col space-y-4">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Success Banner */}
      {successMessage && (
        <Banner
          title={t('success')}
          description={successMessage}
          style="success"
          closeable={true}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Error Message */}
      {errorMessage && (
        <FeedBackMessage
          type="error"
          message={errorMessage}
        />
      )}

      <PackageCmsCardList
        locale={currentLocale}
        packageCount={packages.length}
        showArchived={showArchived}
        onClickCheckbox={() => setShowArchived(!showArchived)}
        onCreatePackage={handleCreatePackage}
        helperContent={
          <div className="flex flex-col gap-3 bg-card-fill p-4 border border-card-stroke rounded-medium text-sm">
            <div>
              <p className="font-semibold text-text-primary text-base">{t('helperText.visibilityTitle')}</p>
              <p className="text-text-secondary">{t('helperText.visibilityDescription')}</p>
            </div>
            <div>
              <p className="font-semibold text-text-primary text-base">{t('helperText.languageTitle')}</p>
              <p className="text-text-secondary">{t('helperText.languageDescription')}</p>
            </div>
          </div>
        }
      >
        {packages.map((pkg) => {
          const baseProps = {
            title: pkg.title,
            description: pkg.description,
            imageUrl: pkg.image?.downloadUrl || '',
            duration: pkg.duration,
            courseCount: pkg.courseCount || 0,
            pricing: {
              currency: platform.currency,
              // Scratched price = sum of base prices + sum of coaching prices
              // Formula: savingsWithCoachings + priceWithCoachings = scratched price (from PRICING_SAVINGS.md)
              fullPrice: (pkg.savingsWithCoachings ?? 0) + pkg.priceWithCoachings,
              partialPrice: pkg.priceWithCoachings,      // Actual package price
            },
            locale: currentLocale,
            onClickEdit: () => handleEditPackage(`${pkg.id}`),
            onClickGoToPackage: () => window.open(
              `${platform.domainName}/${platformLocale}/packages/${pkg.id}`,
              '_blank'
            ),
          };

          if (pkg.status === 'published') {
            return (
              <PackageCmsCard
                key={pkg.id}
                {...baseProps}
                status="published"
                onClickArchive={() => handleArchivePackage(`${pkg.id}`)}
              />
            );
          } else if (pkg.status === 'archived') {
            return (
              <PackageCmsCard
                key={pkg.id}
                {...baseProps}
                status="archived"
                onClickPublished={() => handlePublishPackage(`${pkg.id}`)}
              />
            );
          } else {
            // Handle packages without status (treat as published)
            return (
              <PackageCmsCard
                key={pkg.id}
                {...baseProps}
                status="published"
                onClickArchive={() => handleArchivePackage(`${pkg.id}`)}
              />
            );
          }
        })}
      </PackageCmsCardList>

      {/* Archive Confirmation Modal */}
      <ArchivePackageModal
        isOpen={showArchiveModal}
        onClose={handleCloseArchiveModal}
        onConfirm={handleConfirmArchive}
        isLoading={archivePackageMutation.isPending}
        locale={currentLocale}
      />

      {/* Archive Success Modal */}
      <ArchiveSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        locale={currentLocale}
      />
    </div>
  );
}
